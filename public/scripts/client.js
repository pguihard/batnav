var msg01 = "Choisissez le cap ci-dessous et cochez la case correspondant à la poupe d'un bateau de ";
var msg02 = " cases puis validez.";
var msg03 = "Votre flotte est validée. Vous pouvez tirer sur la grille ci-dessus."

var msg1 = "Votre adversaire n'est pas connecté.";
var msg2 = "Svp Attendez!";

var shipId = 0; // 0-4
// 5 ships [length, initial color]
var shipArea = [[5, "#8ca78d"]]//, [4, "#71ad73"], [3, "#858f74"], [3, "#7d9b48"], [2, "#5c8b3c"]];
//0:water, 1-5 ship Id, shipId x 10: reached, shipId x 10 + 1: sank
var fleetArea = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];

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
            console.log(fleetArea);
            createGrid("2"); initGrid("2");   
            comWithServer();
            return;
        }
        $("#alert").text(msg01  + shipArea[shipId][0] + msg02);
    }
};

function clickOnBoard2(event, sock) {
    textClients = document.getElementById("clients").innerText;
    if(textClients == "1 players" ){
        return;
    }
    alert = document.getElementById("alert").innerText;
    if(alert == msg2 ){
        return;
    }
    td = event.target.id;
    if (td == "" || td.substring(0, 5) == "board"){
        return;
    }
    $("#alert").text(msg2);
    document.getElementById(td).innerText = "X";
    sock.send(td.substring(1));
}

function shipIsSank (ship_Id) {
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            if (fleetArea[row][col] == ship_Id) {
                var id = "1" + row.toString() + col.toString();
                document.getElementById(id).style.backgroundColor = "#f72929";
                fleetArea[row][col] += 1;
            }
        }
    }
}

function getTheShot(coord){
    var row = parseInt(coord.substring(0, 1));
    var col = parseInt(coord.substring(1, 2));
    document.getElementById("1" + coord).innerText = "O";
    if (fleetArea[row][col] == 0) {
        //into the water
        document.getElementById("1" + coord).style.backgroundColor = "#73B1B7";        
    }
    else if (fleetArea[row][col] < 10) {
        if (--shipArea[ fleetArea[row][col] - 1][0] == 0) {
            //sank
            fleetArea[row][col] *= 10;
            shipIsSank(fleetArea[row][col]);
        }
        else {
            //just reached
            document.getElementById("1" + coord).style.backgroundColor = "#e78b8b";
            fleetArea[row][col] *= 10;
        }
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
            getTheShot(obj.message);
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
    createGrid("1"); initGrid("1");
    $("#alert").text(msg01  + shipArea[shipId][0] + msg02);
    document.getElementById("board1").addEventListener("click", function(event) {
        clickOnBoard1(event);
    });
    document.getElementById("validation").addEventListener("click", validate);
});