
/*
 * GET home page.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
	
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('biketrackerdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'biketrackerdb' database");
        db.collection('locations', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'Locations' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.index = function(req, res){
  res.render('index', { title: 'Bike Tracker' });
};

exports.recentLocation = function(req, res){
	// Use a timestamp
    db.collection('locations', function(err, collection) {
        collection.find().sort( [['_id', -1]] ).limit(30).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addLocation = function(req, res) {
    var location = req.body;
    console.log('Adding location: ' + JSON.stringify(location));
    db.collection('locations', function(err, collection) {
        collection.insert(location, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.findAllLocations = function(req, res) {
    db.collection('locations', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var locations = [
    {
        lat: 131.00001,
        lng: 21.00001,
        alt: 100.0,
        hacc: 50.0,
        vacc: 5.0,
        time: "1986-01-17 02:45:12",
        speed: 5.4,
        course: 90.0
    },
    {
        lat: 132.00001,
        lng: 22.00001,
        alt: 120.0,
        hacc: 51.0,
        vacc: 6.0,
        time: "1986-01-17 02:55:12",
        speed: 6.4,
        course: 93.0
    }
	];

    db.collection('locations', function(err, collection) {
        collection.insert(locations, {safe:true}, function(err, result) {});
    });

};