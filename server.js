var msg11 = "A vous de jouer."

var io = require("socket.io");
var express = require("express");
var http = require("http");

var app = express();
var server = http.createServer(app);
var socket = io(server);

//That way it'll still listen to port 5000 when you test locally, but it will also work on Heroku.
var listenPort = process.env.PORT || 5000;
server.listen(listenPort, function() {
    console.log("*** Server is running and listening on " + listenPort + " port.");
});

app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res, next){
    res.render("./public/index.html");
});

var allClients = 0;
var clientId = 0;

socket.on("connection", function(client) {
    console.log("*** Welcome to the new player!");
    allClients += 1;
    clientId += 1;

    var my_timer;
    var my_client = { "id": clientId, "obj": client };
    
    if (allClients > 2){
        console.log("*** ClientID " + my_client.id + " is rejected.");
        my_client.obj.send(JSON.stringify({ "message": "disconnect"}));
        allClients -= 1;
        return;
    }
    console.log("*** ClientID " + my_client.id + " is connected.");
    my_timer = setInterval(function () {
        my_client.obj.send(JSON.stringify({ "client": `Player Id: ${my_client.id}`, "clients": `${allClients} players`}));
    }, 1000);
    client.on("message", function(data) {
        if (allClients < 2){
            console.log("*** Nobody to receive your message.");
            return;
        }
        //Send message to all clients except sender (broadcast)
        if (isNaN(data.substring(0,1))) {
            my_client.obj.broadcast.send(JSON.stringify({ "message": `${data}` }));
        } else {
            my_client.obj.broadcast.send(JSON.stringify({ "message": `${data}`, "alert": `${msg11}` }));
        }
        
        console.log("*** ClientID " + my_client.id + " sent: " + data);
    });
    client.on("disconnect", function() {
        clearTimeout(my_timer);
        allClients -= 1;
        console.log("*** ClientID " + my_client.id + " is disconnected.");
    });
});