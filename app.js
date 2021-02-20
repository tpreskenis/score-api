const Express = require("express");
const fetch = require("node-fetch");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const CronJob = require('cron').CronJob;

// --------------------------------------------
// | Database Connection / Database Functions |
// --------------------------------------------

const CONNECTION_URL = "mongodb+srv://Timothy:TestingMongodb@cluster0.v3isc.mongodb.net/barstool_challenge?retryWrites=true&w=majority";
const DATABASE_NAME = "barstool_challenge";

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));


var database, mlb_collection, nba_collection;

app.listen(3000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        console.log("Connected to `" + DATABASE_NAME + "`!");

        // Collection connections
        database = client.db(DATABASE_NAME);
        mlb_collection = database.collection("MLBGame");
        nba_collection = database.collection("NBAGame");

        // Wipes the current information in the databases, then push the data for the first time
        initialDataDeleteAndPush("https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json","NBAGame")
        initialDataDeleteAndPush("https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json","MLBGame")
    });
});

// ----------------
// | GET Commands |
// ----------------

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

// -------------
// | Functions |
// -------------

// -- Deletes Old Database and then uploads Current data Database
async function initialDataDeleteAndPush(url,collection) {
    number = await database.collection(collection).countDocuments();
    if (number > 0) {
        await database.collection(collection).deleteMany();  
        console.debug("Deleted " + collection)
    }
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
            console.debug("Pushed " + collection)
            updateAPI(url,collection)
        }).catch(error => {
          console.error(error);
        });
}

// -- CronJob using Node Cron
async function updateAPI (url,collection) {
    var job = new CronJob('*/15 * * * * *', function() {
        fetch(url)
            .then(response => {
              if (response.status === 200) {
                return response.json();
              } else {
                throw new Error('Something is wrong with game data server!');
              }
            })
            .then(response => {
                updatedata(collection,response)
            }).catch(error => {
              console.error(error);
            });
    }, null, true, 'America/New_York');
    job.start();
}

// -- Takes Json from URL and UPDATES it in Database
async function updatedata(collection,response) {
    await database.collection(collection).updateOne({},{$set : {response}});
        return console.log("Updated " + collection) // Feel Free to remove
}