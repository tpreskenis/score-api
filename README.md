# Score API
This is a simple API using NodeJS.  The API consumes two different game feeds and then cashes that data in a database.

## How to Run
In order to run this you need to do the following command in the terminal for the project.

```node app.js```

OR

```npm start```

This will run the API on a local : http://localhost:3000

Additionally it is running on Azure at : https://scoredatabaseapi.azurewebsites.net/


## GET Commands
The following are two commands to get the two different games.

### /nba_game
http://localhost:3000/nba_game

This will get you the information from the NBA feed.

### /mlb_game
http://localhost:3000/mlb_game

This will get you the information from the MLB feed.


