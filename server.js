var express = require("express"),
    http = require("http"),
    app = express(),
    MongoClient = require('mongodb').MongoClient;


app.use(express.static(__dirname));

var url = 'mongodb://localhost:27017/myproject';

//Checks to see if db is already populated
//and populates the db if it is not.
MongoClient.connect(url, function(err, db) {
    console.log("Mongo Connection Error: " + err);
    findStory(db, function(doc) {
        if (doc.length === 0){
            insertStory(db, function() {
                db.close();
            });
        }
    });


});

//Inserts sample mad lib story
var insertStory = function(db, callback) {
    console.log("Inserting");
    var collection = db.collection('stories');
    collection.insertOne(
        {story:"Say cheese the photographer said as the camera flashed! and I had gone to to get our photos taken today. The first photo we really wanted was a picture of us dressed as [[Animals]] pretending to be a [[Feeling]]. When we saw the proofs of it, I was a bit [[Things (plural)]] because it looked different than in my head. (I hadn't imagined so many [[A Professional (like 'Baker')]] behind us.)"},
        function(err, result) {
            console.log("Mongo Insertion Error:" + err);
            callback(result);
    });
};

//Find random mad lib story from the database to use
var findRandomStory = function(db, callback) {

    var collection = db.collection('stories');

    collection.find({}).toArray(function(err, doc) {
        console.log("Found the following record");
        console.dir(doc);
        callback(docs);
    });
};

//Find mad lib story selected by id
var findStory = function(id, db, callback) {

    var collection = db.collection('stories');

    collection.find({_id: id}).toArray(function(err, doc) {
        console.log("Found the following record");
        console.dir(doc);
        callback(docs);
    });
};

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

http.createServer(app).listen(8000);
