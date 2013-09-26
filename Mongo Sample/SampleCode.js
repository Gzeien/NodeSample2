var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection
var Server = require('mongodb').Server
var format = require('util').format;

console.log("Connecting to " + host + ":" + port);

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['DB2noSQL-0.1'][0].credentials;
} else {
    var mongo = {
        "host": "localhost",
        "port": "27017",
        "db": "acmeair"
    };
}
var db = mongo.db;
console.log("Hitting mongo at: " + mongo.host + ":" + mongo.port + ":" + mongo.db);


Db.connect(format("mongodb://%s:%s/%s?w=1", mongo.host, mongo.port, mongo.db), function(err,  db) {
     db.collection('test', function(err, collection) {
      // Erase all records from the collection, if any
      collection.remove({}, function(err, result) {
        // Insert 3 records
        for(var i = 0; i < 3; i++) {
          collection.insert({'a':i}, {w:0});
        }
 

        collection.count(function(err, count) {
          console.log("There are " + count + " records in the test collection. Here they are:");
          collection.find().each(function(err, item) {
            if(item != null) {
              console.dir(item);
              console.log("created at " + new Date(item._id.generationTime) + "\n")
            }

            // Null signifies end of iterator
            if(item == null) {
              // Destory the collection
              collection.drop(function(err, collection) {
                db.close();

              });
            }
          });

        });

      });

    });