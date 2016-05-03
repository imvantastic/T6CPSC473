var express = require("express"),
    http = require("http"),
    app = express(),
    MongoClient = require('mongodb').MongoClient,
    server = http.createServer(app),
    io = require("socket.io").listen(server);

//post need bodyparser
var bodyParser = require("body-parser");

//static files
app.use(express.static(__dirname));

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




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
        if (doc.length === 0){
            insertStory(db, function() {
                db.close();
            });
        }
    });
});
console.log("outside mongoconnect");
//gets stories from json file
/*var storycollection [];
var jsonStory = "stories.json";
    fs.readFile(jsonStory, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            var jsondata = JSON.parse(data);
            storycollection = jsondata.story;
        }
    })*/

//Inserts sample mad lib story
var insertStory = function(db, callback) {
    var collection = db.collection('stories');
    collection.insertOne(
        {story:"Say cheese the photographer said as the camera flashed! and I had gone to to get our photos taken today. The first photo we really wanted was a picture of us dressed as [[Animals]] pretending to be a [[Feeling]]. When we saw the proofs of it, I was a bit [[Things (Plural)]] because it looked different than in my head. (I hadn't imagined so many [[A Professional (like 'Baker')]] behind us.)"},
        function(err, result) {
            console.log("Mongo Insertion Error:" + err);
            callback(result);
    });
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
/*var findStoryByID = function(id, db, callback) {

    var collection = db.collection('stories');

    collection.find({_id: id}).toArray(function(err, doc) {
        console.log("Found the following record");
        console.dir(doc);
        callback(doc);
    });
};*/

//
//sockets start//
//
var gameDef = require('./js/game.js');
var gameArray = [];
var playerDef = require('./js/player.js');
var playersArray = [];

// game variables
var game;
var story = "";
var host = null;
var hostname = "";

// game not started
var gamestatus = "not started";
console.log("io: " + io);
//when a player connects
io.sockets.on('connection', function(socket){
    console.log("user connected");
    var player = new playerDef(socket.id);
    playersArray.push(player);

    console.log(player);

    // Socket rooms: gameroom, host, formView
    socket.join('gameroom');
    socket.emit('reload lobby');

    // remove player from game on disconnect
    socket.on('disconnect', function () {
        console.log("player disconnected");
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
    socket.on('startgame', function(){
        console.log("in socket on of start game");
        io.to('host').emit('showform1');
        io.to('gameroom').emit('showform2');
        //socket.emit('showform');
    })

});
//sockets end

//Return story and stories id
app.get("/getStory", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        findStory(db, function(doc) {
            res.json({
                story: doc[0].story,
                id: doc[0]._id
            });
            db.close();
        });
    });
});

//Create a new game if there's no existing game to join
app.post("/createNewGame", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('games');
        
        // Look for random story Id in the DB
        // Doesn't do that yet, hard-coded the story id for now
        var newStoryId = "5709d7f045e3cbfb09d22164";

        collection.insertOne(
            {storyId: newStoryId,
             isPlayer1Ready: true,
             isPlayer2Ready: false,
             player1Story: "",
             player2Story: "" 
         });
        db.close();
    });
});

//Find an open/ available game
app.get("/joinGame", function(req, res) {
    console.log("/joinGame");
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('games');
        collection.findOne({"isPlayer2Ready":false}, function(err, doc) {
            if (err) {
                console.log("ERROR = " + err);
            }
            else if (doc) {
                console.log('Found: ' + doc);
                res.json(doc);
            } 
            else {
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
        console.log("req.body.id:  "+req.body.id  );
        var inputsObj = req.body;
        insertInputValue(db, inputsObj, function() { db.close(); }); 
        res.end("OK");
    });
});//end post

var insertInputValue = function(db, inputsObj, callback) {
    var collection = db.collection('inputs');
    collection.insertOne(
        { input: inputsObj },
        function(err, result) {
            console.log("Insert input values Error:" + err);
            console.log("Insert input values result:" + result);
            callback(result);
    });
};
 
//Return inputs and id
app.get("/inputs", function(req, res) {
    MongoClient.connect(url, function(err, db) {
         console.log("app.get req.body.id:  "+req.body.id);
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



//http.createServer(app).listen(8000);
