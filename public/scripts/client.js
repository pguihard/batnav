//0: water, 1-5: ship Id, 9: missed, shipId x 10: reached, shipId x 10 + 1: sank
var fleetArea = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
var fleetLen = 0;
var shotsNum = 0; //number of sunk ennemy ships

var nShots = 0; //number of shots

function clickOnBoard2(event, sock) {
    if (fleetLen == 0 || shotsNum == 0) {
        return;
    }
    textClients = document.getElementById("clients").innerText;
    if(textClients == "1 players" ){
        return;
    }
    alert = document.getElementById("alert").innerText;
    if(alert.substring(0, 1) == ">" ){
        return;
    }
    td = event.target.id;
    if (td == "" || td.substring(0, 5) == "board"){
        return;
    }
    document.getElementById(td).innerText = "O";
    document.getElementById(td).style.borderRadius = "100%";

    sock.send(td.substring(1));
    nShots++;
}

function shipIsSunk (ship_Id, sock) {
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            if (fleetArea[row][col] == ship_Id) {
                var id = "1" + row.toString() + col.toString();
                document.getElementById(id).style.backgroundColor = colorSunk;
                sock.send("S" + row.toString() + col.toString());
                fleetArea[row][col] += 1;
            }
        }
    }
}

function getTheShot(coord, sock){
    var row = parseInt(coord.substring(0, 1));
    var col = parseInt(coord.substring(1, 2));
    document.getElementById("1" + coord).innerText = "O";
    document.getElementById("1" + coord).style.borderRadius = "100%";
    if (fleetArea[row][col] == 0) {
        //missed
        fleetArea[row][col] = 9;
        document.getElementById("1" + coord).style.backgroundColor = colorMissed;
        sock.send("M" + coord);
    }
    else if (fleetArea[row][col] < 9) { //test if shot against a valid part of ship
        fleetLen--;
        if (fleetLen == 0) {
            $("#alert").text(msg3);
        }
        if (--shipArea[ fleetArea[row][col] - 1][0] == 0) { //test the current length of the ship
            //sunk
            fleetArea[row][col] *= 10;
            shipIsSunk(fleetArea[row][col], sock);
        }
        else {
            //just reached
            document.getElementById("1" + coord).style.backgroundColor = colorReached;
            sock.send("R" + coord);
            fleetArea[row][col] *= 10;
        }
    }
}

function getTheResponse(msg) {
    var coord = msg.substring(1);
    var alert = document.getElementById("alert").innerText;
    switch (msg.substring(0,1)) {
        case "M":
            document.getElementById("2" + coord).style.backgroundColor = colorMissed;
            $("#alert").text(msg20 + msg2);
            break;
        case "R":
            document.getElementById("2" + coord).style.backgroundColor = colorReached;
            $("#alert").text(msg21 + msg2);
            break;
        case "S":
            document.getElementById("2" + coord).style.backgroundColor = colorSunk;
            $("#alert").text(msg22 + msg2);
            shotsNum--;
            break;
    }
    if (shotsNum == 0) { //You have won
        $("#alert").text(msg4);
    }
}

function comWithServer(){
    var sock = io();
    
    sock.on("message", function (data) {
        var obj = JSON.parse(data);
        if (obj.message == "disconnect"){
            sock.disconnect();
            window.location.replace("Rejected.html");
            return;
        }
        if(obj.message) {
            // shot receive
            $("#message").text(obj.message);
            $("#alert").text(obj.alert);
            if (isNaN(obj.message.substring(0,1))) {
                getTheResponse(obj.message);
            } else {
                getTheShot(obj.message, sock);
            }
        }
        else { // sent by server every seconds
            $("#client").text(obj.client);
            $("#clients").text(obj.clients);
            alert = document.getElementById("alert").innerText;
            if (obj.clients == "1 players"){
                if (nShots == 0){
                    $("#alert").text(msg1);
                    
                } else {
                    $("#alert").text(msg11);
                }
                $("#message").text("");
                initGrid("2");
            }
            else if (alert == msg1){
                $("#alert").text(msg030);
            }
        }
    });
    sock.connect();
}

$(document).ready(function () {
    var myobjet_json = localStorage.getItem("mylocalobj");
	var mylocalobj = JSON.parse(myobjet_json);

    for(var ind = 0; ind < shipArea.length; ind++) {
        fleetLen += shipArea[ind][0];
        shotsNum = fleetLen;
    }
    fleetArea = mylocalobj.myfleet;
    createGrid("1"); initGrid2("1", mylocalobj.myfleet);
    createGrid("2"); initGrid("2");
    document.getElementById("board2").addEventListener("click", function(event) {
        clickOnBoard2(event, sock);
      });
    comWithServer();
});