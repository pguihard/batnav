
var io = require("socket.io");
var express = require("express");
var http = require("http");

var app = express();
var server = http.createServer(app);
var socket = io(server);

server.listen(5000, '0.0.0.0');
console.log("Server is running and listening on 5000 port.");

app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res, next){
    res.render("./public/index.html");
});

var allClients = 0;
var clientId = 0;

socket.on("connection", function(client) {
    allClients += 1;
    clientId += 1;

    var my_timer;
    var my_client = { "id": clientId, "obj": client };
    
    if (allClients > 2){
        console.log("ClientID " + my_client.id + " is rejected.");
        my_client.obj.send(JSON.stringify({ message: "disconnect"}));
        allClients -= 1;
        return;
    }
    console.log("ClientID " + my_client.id + " is connected.");
    my_timer = setInterval(function () {
        my_client.obj.send(JSON.stringify({ "timestamp": (new Date()).getTime(), "client": `ID: ${my_client.id}`, "clients": `${allClients} players`}));
    }, 1000);
    client.on("message", function(data) {
        if (allClients < 2){
            console.log("Nobody to receive your message.");
            return;
        }
        //Send message to all clients except sender (broadcast)
        my_client.obj.broadcast.send(JSON.stringify({ message: '"' + data + '" from ClientID ' + my_client.id }));
        console.log("ClientID " + my_client.id + " sent: " + data);
    });
    client.on("disconnect", function() {
        clearTimeout(my_timer);
        allClients -= 1;
        console.log("ClientID " + my_client.id + " is disconnected.");
    });
});