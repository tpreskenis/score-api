# Score API
<div align="center">
    <img src="assets\api-logo.png" width="200">
</div>
<div align="center">
This is a simple API using NodeJS.  The API consumes two different game feeds and then cashes that data in a database.
</div>

---
## Requesting Access
Before using you will need to request access.  I will give you the Mongodb Connection URL as well as put you on the IP Access List.

<div align="center" style="font-style: italic;">
Email: tpresk@comcast.net
</div>
<div align="center" style="font-style: italic;">
Subject Line: request-sports-api
</div>


## How to Run
In order to run this you need to do the following command in the terminal for the project.

```
node app.js
```

OR

```
npm start
```

This will run the API on a local : http://localhost:3000

---
## GET Commands
The following are two commands to get the two different games.

```
http://localhost:3000/nba_game
```
This will get you the information from the NBA feed.

```
http://localhost:3000/mlb_game
```
This will get you the information from the MLB feed.


