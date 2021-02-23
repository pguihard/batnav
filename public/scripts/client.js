// This part communicates with the server when you play against another player online

var shotsNum = 0; //number of sunk ennemy ships

function getTheResponse(msg) {
    var coord = msg.substring(1);
    var id = 0;
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
            id = parseInt(msg.substring(1,2));
            coord = msg.substring(2);
            document.getElementById("2" + coord).style.backgroundColor = colorsSunk[id];
            $("#alert").text(msg22 + msg2);
            shotsNum--;
            break;
    }
    if (shotsNum == 0) { //You have won
        $("#alert").text(msg4 + " Nombre de tirs subis: " + nShots[0]);
    }
}

function comWithServer(sock){
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
                getTheShot(obj.message, myFleet, "1", sock);
            }
        }
        else { // sent by server every seconds
            $("#client").text(obj.client);
            $("#clients").text(obj.clients);
            alert = document.getElementById("alert").innerText;
            if (obj.clients == "1 players"){
                if (nShots[0] == 0){
                    $("#alert").text(msg1);
                    
                } else {
                    $("#alert").text(msg11);
                }
                $("#message").text("");
                initGrid("2");
            }
            else 
                if (alert == msg1 || alert == "")
                {
                    $("#alert").text(msg030);
                }
        }
    });
    sock.connect();
}

function clickOnBoard2(event, sock) {
    if (fleetLen[0] == 0 || shotsNum == 0) {
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
}

$(document).ready(function () {
    var myobjet_json = localStorage.getItem("mylocalobj");
	var mylocalobj = JSON.parse(myobjet_json);

    for(var ind = 0; ind < shipAreas[0].length; ind++) {
        fleetLen[0] += shipAreas[0][ind][0];
    }
    shotsNum = fleetLen[0];
    myFleet = mylocalobj.myfleet;
    createGrid("1"); initGrid2("1", mylocalobj.myfleet);
    createGrid("2"); initGrid("2");
    var sock = io();
    comWithServer(sock);

    $("#board2").on("click", function(event) {
       clickOnBoard2(event, sock);
   });
});