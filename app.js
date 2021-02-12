const Express = require("express");
const fetch = require("node-fetch");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;


const CONNECTION_URL = "mongodb+srv://Timothy:TestingMongodb@cluster0.v3isc.mongodb.net/barstool_challenge?retryWrites=true&w=majority";
const DATABASE_NAME = "barstool_challenge";

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));


var database, mlb_collection, nba_collection, nba_initial_data, mlb_initial_data;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        console.log("Connected to `" + DATABASE_NAME + "`!");

        // Collection connections
        database = client.db(DATABASE_NAME);
        mlb_collection = database.collection("MLBGame");
        nba_collection = database.collection("NBAGame");

        // Wipes the current information in the databases
        deleteData("NBAGame")
        deleteData("MLBGame")

        // Push Data to database for the first time
        pushData("https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json","NBAGame")
        pushData("https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json","MLBGame")
        
    });
});
app.get("/mlb_game", (request, response) => {
    mlb_collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/nba_game", (request, response) => {
    nba_collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// Functions 
// -- Delete Data in Current Database
async function deleteData(collection) {
    number = await database.collection(collection).countDocuments();
    if (number > 0)
        return database.collection(collection).deleteMany();
    else
        return
}

// -- Takes Json from URL and uploads it to Database
async function pushData(url,collection) {
    await fetch(url)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Something is wrong with game data server!');
          }
        })
        .then(response => {
            database.collection(collection).insertOne(response);
        }).catch(error => {
          console.error(error);
        });
}



//var CronJob = require('cron').CronJob;
//var job = new CronJob('*/10 * * * * *', function() {
//
//fetch('https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json')
//.then(response => {
//  if (response.status === 200) {
//    return response.json();
//  } else {
//    throw new Error('Something is wrong with game data server!');
//  }
//})
//.then(response => {
//  console.debug(response);
//  // ...
//}).catch(error => {
//  console.error(error);
//});
//
//
//}, null, true, 'America/Los_Angeles');
//job.start();
//