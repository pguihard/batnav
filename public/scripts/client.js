var msg01 = "Choisissez le cap ci-dessous et cochez la case correspondant à la poupe d'un bateau de ";
var msg02 = " cases puis validez.";
var msg03 = "Votre flotte est validée. Vous pouvez tirer sur la grille ci-dessus."

var msg1 = "Votre adversaire n'est pas connecté.";
var msg2 = "A votre adversaire de jouer, ";
var msg20 = "Vous avez manqué votre cible.";
var msg21 = "Vous avez touché un navire.";
var msg22 = "Vous avez coulé un navire.";
var msg3 = "Vous avez perdu!"
var msg4 = "Vous avez gagné!"

var colorMissed = "#73B1B7";
var colorReached = "#e78b8b";
var colorSunk = "#f72929";


var shipId = 0; // 0-4
// 5 ships [length, initial color]
var shipArea = [[5, "#8ca78d"]]//, [4, "#71ad73"], [3, "#858f74"], [3, "#7d9b48"], [2, "#5c8b3c"]];
//0:water, 1-5 ship Id, shipId x 10: reached, shipId x 10 + 1: sank
var fleetArea = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
var fleetLen = 0;
var shotsNum = 0; //number of sunk ennemy ships

function createGrid(boardn){
    var tableString = "<table>";
    for (var row = 0; row < 10; row++) {
        tableString += "<tr>";
        for (var col = 0; col < 10; col++) {
            tableString += '<td id="' + boardn + row + col + '"></td>';
        }
        tableString += "</tr>";
    }
    tableString += "</table>";
    document.getElementById("board"+boardn).innerHTML += tableString;
};

function initGrid(boardn){
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
        var id = boardn + row.toString() + col.toString();
        document.getElementById(id).textContent = " ";
        }
    }
};
// When many tries to set one ship
// "x"s are temporary and changed to "X" when valisating
function resetBoard1() {
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            var id = "1" + row.toString() + col.toString();
            if (document.getElementById(id).textContent == "x") {
                document.getElementById(id).textContent = " ";
                document.getElementById(id).style.backgroundColor = "";
            }
        }
    }
};
//validate one ship converting temporary "x"s to "X"s.
function validateShip() {
    validated = false;
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            var id = "1" + row.toString() + col.toString();
            if (document.getElementById(id).textContent == "x") {
                document.getElementById(id).textContent = "X";
                document.getElementById(id).style.backgroundColor = shipArea[shipId][1];
                fleetArea[row][col] = shipId+1; //0:water, 1-5 ship Id, ship Id x 10: reached, 99: sank
                validated = true;
            }
        }
    }
    return validated;
};

function clickOnBoard1(event) {
    if(shipId == shipArea.length) {
        return;
    }
    resetBoard1();
    var shipSize = shipArea[shipId][0]; // get the ship length
    var td = event.target.id;
    if (td == "" || td.substring(0, 5) == "board"){
        return;
    }
    if (south.checked && parseInt(td.substring(1,2)) + shipSize <= 10) {
        while (shipSize > 0) {
            if (document.getElementById(td).textContent != " "){
                resetBoard1();
                return;
            }
            document.getElementById(td).textContent = "x";
            document.getElementById(td).style.backgroundColor = shipArea[shipId][1];
            var newval = parseInt(td.substring(1,2)) + 1;
            td = td.substring(0,1) + newval.toString() + td.substring(2,3);
            shipSize--;
        }
        return;
    }
    if (north.checked && parseInt(td.substring(1,2)) - shipSize >= -1) {
        while (shipSize > 0) {
            if (document.getElementById(td).textContent != " "){
                resetBoard1();
                return;
            }
            document.getElementById(td).textContent = "x";
            document.getElementById(td).style.backgroundColor = shipArea[shipId][1];
            var newval = parseInt(td.substring(1,2)) - 1;
            td = td.substring(0,1) + newval.toString() + td.substring(2,3);
            shipSize--;
        }
        return;
    }
    if (east.checked && parseInt(td.substring(2,3)) + shipSize <= 10) {
        while (shipSize > 0) {
            if (document.getElementById(td).textContent != " "){
                resetBoard1();
                return;
            }
            document.getElementById(td).textContent = "x";
            document.getElementById(td).style.backgroundColor = shipArea[shipId][1];
            var newval = parseInt(td.substring(2,3)) + 1;
            td = td.substring(0,1) + td.substring(1,2) + newval.toString();
            shipSize--;
        }
        return;
    }
    if (west.checked && parseInt(td.substring(2,3)) - shipSize >= -1) {
        while (shipSize > 0) {
            if (document.getElementById(td).textContent != " "){
                resetBoard1();
                return;
            }
            document.getElementById(td).textContent = "x";
            document.getElementById(td).style.backgroundColor = shipArea[shipId][1];
            var newval = parseInt(td.substring(2,3)) - 1;
            td = td.substring(0,1) + td.substring(1,2) + newval.toString();
            shipSize--;
        }
        return;
    }
}

function validate(){
    if(shipId == shipArea.length) {
        return;
    }
    if (validateShip()){
        shipId++;
        if(shipId == shipArea.length) {
            lnorth.style.display = "none"; north.style.display = "none";
            lsouth.style.display = "none"; south.style.display = "none";
            least.style.display = "none"; east.style.display = "none";
            lwest.style.display = "none"; west.style.display = "none";
            validation.style.display = "none";
            $("#alert").text(msg03);
            createGrid("2"); initGrid("2");   
            comWithServer();
            return;
        }
        $("#alert").text(msg01  + shipArea[shipId][0] + msg02);
    }
};

function clickOnBoard2(event, sock) {
    if (fleetLen == 0 || shotsNum == 0) {
        return;
    }
    textClients = document.getElementById("clients").innerText;
    if(textClients == "1 players" ){
        return;
    }
    alert = document.getElementById("alert").innerText;
    if(alert.substring(0, msg2.length) == msg2 ){
        return;
    }
    td = event.target.id;
    if (td == "" || td.substring(0, 5) == "board"){
        return;
    }
    $("#alert").text(msg2);
    document.getElementById(td).innerText = "O";
    document.getElementById(td).style.borderRadius = "100%";

    sock.send(td.substring(1));
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
        document.getElementById("1" + coord).style.backgroundColor = colorMissed;
        sock.send("M" + coord);
    }
    else if (fleetArea[row][col] < 10) { //test if shot against a valid part of ship
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
            $("#alert").text(alert + msg20);
            break;
        case "R":
            document.getElementById("2" + coord).style.backgroundColor = colorReached;
            $("#alert").text(alert + msg21);
            break;
        case "S":
            document.getElementById("2" + coord).style.backgroundColor = colorSunk;
            $("#alert").text(alert + msg22);
            shotsNum--;
            break;
    }
    if (shotsNum == 0) { //You have won
        $("#alert").text(msg4);
    }
}

function comWithServer(){
    var sock = io();
    document.getElementById("board2").addEventListener("click", function(event) {
        clickOnBoard2(event, sock, "board2");
      });
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
        else {
            $("#client").text(obj.client);
            $("#clients").text(obj.clients);
            alert = document.getElementById("alert").innerText;
            if (obj.clients == "1 players"){
                $("#alert").text(msg1);
                $("#message").text("");
                initGrid("2");
            }
            else if (alert == msg1){
                $("#alert").text("");
            }
        }
    });
    sock.connect();
}

$(document).ready(function () {
    for(var ind = 0; ind < shipArea.length; ind++) {
        fleetLen += shipArea[ind][0];
        shotsNum = fleetLen;
    }
    createGrid("1"); initGrid("1");
    $("#alert").text(msg01  + shipArea[shipId][0] + msg02);
    document.getElementById("board1").addEventListener("click", function(event) {
        clickOnBoard1(event);
    });
    document.getElementById("validation").addEventListener("click", validate);
});