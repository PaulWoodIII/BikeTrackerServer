
/*
 * GET home page.
 */

var mongo = require('mongodb');

var uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/biketrackerdb'; 

mongo.connect(uri,function(err,db){
	if(err) {
		console.log(err);
		return;
	}
	else{
		console.log('no error');
	}
  db.collection('locations', {safe:true}, function(err, collection) {
      if (err) {
          console.log("The 'Locations' collection doesn't exist. Creating it with sample data...");
          populateDB();
      }
			else{
				console.log('no error');
			}
  });
});

exports.index = function(req, res){
  res.render('index', { title: 'Bike Tracker' });
};

exports.recentLocation = function(req, res){
	// Use a timestamp
	mongo.connect(uri,function(err,db){
		if(err) {
			console.log(err);
			return;
		}
    db.collection('locations', function(err, collection) {
        collection.find().sort( [['_id', -1]] ).limit(30).toArray(function(err, items) {
            res.send(items);
        });
    });
	});
}

exports.addLocation = function(req, res) {
    var location = {};// = req.body;		
		if (req.body.lat && req.body.lng && req.body.hacc){
			location.lat = req.body.lat;
			location.lng = req.body.lng;
			location.hacc = req.body.hacc;
		}
		else{
      res.send(404);
			return;
		}	
    console.log('Adding location: ' + JSON.stringify(location));
		
		mongo.connect(uri,function(err,db){
			if(err) {
				console.log(err);
				return;
			}		
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
		});
}

exports.findAllLocations = function(req, res) {
	mongo.connect(uri,function(err,db){
		if(err) {
			console.log(err);
			return;
		}	
	  db.collection('locations', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
	});
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var locations = [
    {
        lat: 31.208621,
        lng: 121.469271,
        alt: 100.0,
        hacc: 50.0,
        vacc: 5.0,
        time: "1986-01-17 02:45:12",
        speed: 5.4,
        course: 90.0
    },
    {
        lat: 31.208631,
        lng: 121.469281,
        alt: 120.0,
        hacc: 51.0,
        vacc: 6.0,
        time: "1986-01-17 02:55:12",
        speed: 6.4,
        course: 93.0
    }
	];
	mongo.connect(uri,function(err,db){
		if(err) {
			console.log(err);
			return;
		}	
    db.collection('locations', function(err, collection) {
        collection.insert(locations, {safe:true}, function(err, result) {});
    });
	});
};