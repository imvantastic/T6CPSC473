var express = require("express"),
    http = require("http"),
    app = express(),
    MongoClient = require('mongodb').MongoClient,
    mongo = require('mongodb'),
    server = http.createServer(app),
    io = require("socket.io").listen(server),
    randomWord = require('random-word'),
    Shake = require('shake.js');

//post need bodyparser
var bodyParser = require("body-parser");

//static files
app.use(express.static(__dirname));

//body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());



var storyCount = 0;
//filesystem
var fs = require('fs');

//mongodb
var url = 'mongodb://localhost:27017/myproject';

server.listen(8000);
console.log("listening on port 8000");




//Checks to see if db is already populated
//and populates the db if it is not.
MongoClient.connect(url, function(err, db) {
    console.log("in monogo connect");
    console.log("Mongo Connection Error: " + err);
    findStory(db, function(doc) {
        if (doc.length === 0) {
            insertStory(db, function() {
                db.close();
            });
        }
    });
});
console.log("outside mongoconnect");

//Inserts sample mad lib story
var insertStory = function(db, callback) {
    var collection = db.collection('stories');
    collection.insert(
        [{
            story: "Say cheese the photographer said as the camera flashed! and I had gone to to get our photos taken today. The first photo we really wanted was a picture of us dressed as [[Animals]] pretending to be [[Feeling]]. When we saw the proofs of it, I was a bit [[Things (Plural)]] because it looked different than in my head. (I hadn't imagined so many [[A Professional (like 'Baker')]] behind us.)"
        }, {
            story: "A vacation is when you take a trip to some [[Adjective]] place with your [[Adjective (2nd)]] family. Usually you go to some place that is near a/an [[Noun]] or up on a/an [[Noun (2nd)]]. A good vacation place is one where you can ride [[Animal (Plural)]] or play [[Game]]."
        }],
        function(err, result) {
            console.log("Mongo Insertion Error:" + err);
            callback(result);
        });
    storyCount = db.collection.count('stories');
};

//Find random mad lib story from the database to use
//**Doesn't actually find a random story yet**
var findStory = function(db, callback) {

    var collection = db.collection('stories');

    collection.find({}).toArray(function(err, doc) {
        console.log("Found the following record");
        console.dir(doc);
        callback(doc);
    });
};

//Find mad lib story selected by id
var findStoryByID = function(id, db, callback) {

    var collection = db.collection('stories');

    //convert string to mongodb object
    var o_id = new mongo.ObjectID(id);

    collection.findOne({
        '_id': o_id
    }, function(err, doc) {
        console.log("Found the following record");
        console.dir(doc);
        callback(doc);
    });
};

//Adds a user created story to the database
var addUserStory = function(db, userStory, callback) {
    var collection = db.collection('stories');

    collection.insert({
            story: userStory
        },
        function(err, result) {
            console.log("Mongo Insertion Error:" + err);
            callback(result);
        });
}

//
//sockets start//
//
var gameDef = require('./js/game.js');
var gameArray = [];
var playerDef = require('./js/player.js');
var playersArray = [];

// game variables
var game;
var stories = [];
var host = null;
var hostname = "";
var storyArray = {
    length: 0,

    addElem: function addElem(elem) {
        // obj.length is automatically incremented every time an element is added.
        [].push.call(this, elem);
    }
};


// game not started
var gamestatus = "not started";
console.log("io: " + io);

// setInterval function()
//var inputInterval;
var intervals = [];


//when a player connects; socket starts here
io.sockets.on('connection', function(socket) {
    console.log("user connected");
    var player = new playerDef(socket.id);

    playersArray.push(player);

    console.log(player);

    // Socket rooms: gameroom, host, formView
    socket.join('gameroom');
    //emits command to load host a game button/lobby
    socket.emit('reload lobby');

    // remove player from game on disconnect
    socket.on('disconnect', function() {
        console.log("player disconnected");
        playersArray.length = 0;
        stories.length = 0;
        io.to('gameroom').emit('reset game');
        //playerCollection.deletePlayer(player);
        if (host === player) {
            host = null;
            hostname = "";
            game = null;
            gamestatus = "not started";
            io.to('gameroom').emit('reset game');
        }
    });

    //host game selected - set host and wait for other players
    socket.on('hostGame', function() {
        console.log("hosting game");
        socket.join('host'); // Assign this socket to host
        socket.leave('gameroom');
        host = player;
        //prepare game
        socket.emit('setupgame');
        //create game
        game = new gameDef(host.getId());
        gamestatus = "initializing";

        //send msg to other players
        io.to('gameroom').emit('waitingforhost');
        //var hostinroom = socket.clients('host');
        //var playersinroom = socket.clients('gameroom');
        //console.log(hostinroom);
        //console.log(playersinroom);

    })

    //start game
    socket.on('startgame', function() {
        console.log("in socket on of start game");
        //var storyCount = db.collection().count('stories');
        console.log("storyCount: " + storyCount);
        gamestatus = "started";
        io.to('host').emit('showform1');
        io.to('gameroom').emit('showform2');
        //socket.emit('showform');
    })

    //grab and hold story
    socket.on('waitforothers', function(data) {
        console.log("in waitforothers");

        //IS 2016-05-09: append array only if data is defined
        if (typeof data != 'undefined') {
            //add story to array
            var tempstory = data.story;
            //attempt to make a json array to pass
            storyArray.addElem({
                story: tempstory
            });
            //pushing to the regular stories array defined as []
            stories.push(tempstory);
        }

        //if all stories are submitted, show them
        if (playersArray.length == stories.length) {
            //show stories
            console.log("in show stories");
            //adjust this to pass the json object
            //socket.emit('showstory', {storyArray: storyArray});

            socket.emit('showstory', stories);

        } else {
            console.log("in nothing of waitforothers");
            console.log("#players: " + playersArray.length + " story length: " + stories.length);
            console.log(playersArray.length === stories.length);
            //do nothing
            //socket.emit('waitstoryscreen');

            //IS 2016-05-09 - checking for other players' submission - 5 seconds
            var inputInterval = setInterval(function() {
                socket.emit('checkOtherPlayerInput');
            }, 5000);

            intervals.push(inputInterval);
        }
    })

    socket.on('terminateSetInterval', function() {
        //IS 2016-05-09: break from inputInterval if it's defined
        if (intervals != null) {
            intervals.forEach(clearInterval);
            //clearInterval(inputInterval);
        }
    })

    //Generate a Random Word---------------------------
    //function generateWord() {
    socket.on('generateWord', function() {
        var rword = randomWord();
        io.to(socket.id).emit('wordGenerated', {
            word: rword
        });
        //socket.emit('generateWord');
    })

    if (gamestatus == "started") {
        //create shake event start
        var shakeEvent = new Shake({
            threshold: 15
        });

        var stopShake = function() {
            shakeEvent.stop();
        };

        shakeEvent.start();

        window.addEventListener('shake', (function() {
            var rword = randomWord();
            io.to(socket.id).emit('wordGenerated', {
                word: rword
            });
        }), false);

        if (!('ondevicemotion' in window)) {
            alert('Shaking Not Supported');
        }
        //create shake event end
    }

});
//SOCKETS END

var fixedInt;

//Accept user created story from client
// and store into mongo database
app.post("/submitStory", function(req, res) {
    console.log("User story: " + req.body.userStory);
    MongoClient.connect(url, function(err, db) {

        addUserStory(db, req.body.userStory, function(result) {
            console.log("User submission: " + result);
            db.close();
        })

    });

})

//Return story and stories id
app.get("/getStory", function(req, res) {
    if (typeof req.query.randomNum != 'undefined' && req.query.randomNum != 7) {
        console.log('DEBUG - the random number is = ' + req.query.randomNum);
        fixedInt = req.query.randomNum;
    }
    MongoClient.connect(url, function(err, db) {
        findStory(db, function(doc) {

            console.log("Fixed integer = " + fixedInt);

            res.json({
                story: doc[fixedInt].story,
                id: doc[fixedInt]._id
            });
            db.close();
        });
    });
});

//Return a story by id
app.get("/getStoryById", function(req, res) {
    console.log("the story id is = " + req.query.storyID);
    console.log('getstory by id - DeBUG');
    MongoClient.connect(url, function(err, db) {
        findStoryByID(req.query.storyID, db, function(doc) {
            res.json({
                story: doc.story,
                id: doc._id
            });
            db.close();
        });
    });
});

//can comment this out
//Create a new game if there's no existing game to join
app.post("/createNewGame", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('games');

        // Look for random story Id in the DB
        // Doesn't do that yet, hard-coded the story id for now
        var newStoryId = "5709d7f045e3cbfb09d22164";

        collection.insertOne({
            storyId: newStoryId,
            isPlayer1Ready: true,
            isPlayer2Ready: false,
            player1Story: "",
            player2Story: ""
        });
        db.close();
    });
});

//can comment this out
//Find an open/ available game
app.get("/joinGame", function(req, res) {
    console.log("/joinGame");
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('games');
        collection.findOne({
            "isPlayer2Ready": false
        }, function(err, doc) {
            if (err) {
                console.log("ERROR = " + err);
            } else if (doc) {
                console.log('Found: ' + doc);
                res.json(doc);
            } else {
                console.log('no data yet!')
                res.json(doc);
            }
        });
    });
});




// get the input value and stories id and put it in the DB
app.post("/inputs", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        console.log("post Error: " + err);
        console.log("req.body", req.body);
        console.log("req.body.id:  " + req.body.id);
        var inputsObj = req.body;
        insertInputValue(db, inputsObj, function() {
            db.close();
        });
        res.end("OK");
    });
}); //end post

var insertInputValue = function(db, inputsObj, callback) {
    var collection = db.collection('inputs');
    collection.insertOne({
            input: inputsObj
        },
        function(err, result) {
            console.log("Insert input values Error:" + err);
            console.log("Insert input values result:" + result);
            callback(result);
        });
};

//Return inputs and id
app.get("/inputs", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        console.log("app.get req.body.id:  " + req.body.id);
        findInput(db, function(doc) {
            res.json({
                inputs: doc
            });
            db.close();
        });
    });
});

var findInput = function(db, callback) {
    var collection = db.collection('inputs');
    collection.find({}).toArray(function(err, doc) {
        callback(doc);
    });
};