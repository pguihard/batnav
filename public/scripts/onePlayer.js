//0: water, 1-5: ship Id, 9: missed, shipId x 10: reached, shipId x 10 + 1: sank
var myFleet = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
var computerFleet = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
    
var fleetLen = [0, 0];
var shipAreas = [[[5, "#8ca78d"], [4, "#71ad73"], [3, "#858f74"], [3, "#7d9b48"], [2, "#5c8b3c"]],
                [[5, "#8ca78d"], [4, "#71ad73"], [3, "#858f74"], [3, "#7d9b48"], [2, "#5c8b3c"]]];
               
var computerShot = "**";
var reachedShot = "**";
var nor = -1;
var wes = -1;
var sou = -1;
var eas = -1;
//var computerShot2 = "**";

var aShip = [1, 2, 3, 4, 5];
var reached = [10, 20, 30, 40, 50];
var sank = [11, 21, 31, 41, 51];

function shipIsSunk (theFleet, ship_Id, boardn) {
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            if (theFleet[row][col] == ship_Id) {
                var id = boardn + row.toString() + col.toString();
                document.getElementById(id).style.backgroundColor = colorSunk;
                //sock.send("S" + row.toString() + col.toString());
                theFleet[row][col] += 1;
            }
        }
    }
}

function getTheShot(coord, theFleet, boardn){
    var row = parseInt(coord.substring(0, 1));
    var col = parseInt(coord.substring(1, 2));
    document.getElementById(boardn + coord).innerText = "O";
    document.getElementById(boardn + coord).style.borderRadius = "100%";
    if (theFleet[row][col] == 0) {
        //missed
        theFleet[row][col] = 9;
        document.getElementById(boardn + coord).style.backgroundColor = colorMissed;
        //sock.send("M" + coord);
    }
    else if (theFleet[row][col] < 9) { //test if shot against a valid part of ship
        fleetLen[boardn-1]--;
        if (fleetLen[0] == 0) {
            $("#alert").text(msg3);
        }
        if (fleetLen[1] == 0) {
            $("#alert").text(msg4);
        }

        if (--shipAreas[boardn-1][ theFleet[row][col] - 1][0] == 0) { //test the current length of the ship
            //sunk
            theFleet[row][col] *= 10;
            shipIsSunk(theFleet, theFleet[row][col], boardn);
        }
        else {
            //just reached
            document.getElementById(boardn + coord).style.backgroundColor = colorReached;
            //sock.send("R" + coord);
            theFleet[row][col] *= 10;
        }
    }
}

function shotAtRandom (minr, maxr, minc, maxc) {
    var row = getRandomIntInclusive(minr, maxr);
    var col = getRandomIntInclusive(minc, maxc);
    //var ind = 0;
    while (myFleet[row][col] >= 9) {    //already shooted at this location
        row = getRandomIntInclusive(minr, maxr);
        col = getRandomIntInclusive(minc, maxc);
        //ind++;
    }
    return row.toString()+col.toString();
}

function aroundTheCell(row, col) {
    var direction = 0;
    console.log(myFleet);
    console.log("around the cell: " + row + col);
    console.log(">nor wes sou eas: " + nor + wes + sou + eas);
    console.log("computerShot: " + computerShot);

    if (nor != -1) {
        nor--;
        if (nor >= 0 && myFleet[nor][col] <= 9) {
            direction = nor;
            if (myFleet[nor][col] == 0) {
                nor = -1; wes = col;
            }
            return direction.toString() + col.toString();
        }
        else {
            nor = -1; wes = col;
        }
    }

    if (wes != -1) {
        wes--;
        if (wes >= 0 && myFleet[row][wes] <= 9) {
            direction = wes;
            if (myFleet[row][wes] == 0) {
                wes = -1; sou = row;
            }
            return row.toString() + direction.toString();
        }
        else {
            wes = -1; sou = row;
        }
    }
    
    if (sou != -1) {
        sou++;
        if (sou <= 9 && myFleet[sou][col] <= 9) {
            direction = sou;
            if (myFleet[sou][col] == 0) {
                sou = -1; eas = col;
            }
            return direction.toString()+col.toString();
        }
        else {
            sou = -1; eas = col;
        }
    }

    if (eas != -1) {
        eas++;
        if (eas <= 9 && myFleet[row][eas] <= 9) {
            direction = eas;
            if (myFleet[row][eas] == 0) {
                eas = -1;
            }
            return row.toString() + direction.toString();
        }
        else {
            eas = -1;
        }
    }
    
    console.log("<nor wes sou eas: " + nor + wes + sou + eas);
    return shotAtRandom(0, 9, 0, 9);
}

function computeTheShot() { //computer against my fleet
    //previous shot analysis
    if (computerShot != "**") {
        var prow = parseInt(computerShot.substring(0, 1));
        var pcol = parseInt(computerShot.substring(1, 2));
        if (reached.indexOf(myFleet[prow][pcol]) != -1 && reachedShot == "**") {
            reachedShot = computerShot;
            nor = prow;
        }
    }
    if (reachedShot != "**") {
        var prow = parseInt(reachedShot.substring(0, 1));
        var pcol = parseInt(reachedShot.substring(1, 2));
        if (reached.indexOf(myFleet[prow][pcol]) != -1) {
            console.log("**** ship " + reachedShot + " is reached.");
            computerShot = aroundTheCell(prow, pcol);
            return computerShot;
        }
        if (sank.indexOf(myFleet[prow][pcol]) != -1) {
            console.log("**** ship " + reachedShot + " is sank.");
            reachedShot = "**";
        }
    }
    computerShot = shotAtRandom(0, 9, 0, 9);
    return computerShot;
}

function clickOnBoard2(event) {
    if (fleetLen[0] == 0 || fleetLen[1] == 0) {
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

    //    sock.send(td.substring(1));
    getTheShot(td.substring(1), computerFleet, "2");
    // this is the turn for the computer to shoot
    getTheShot(computeTheShot(), myFleet, "1");
}

$(document).ready(function () {
    var myobjet_json = localStorage.getItem("mylocalobj");
	var mylocalobj = JSON.parse(myobjet_json);

    for(var ind = 0; ind < shipAreas[0].length; ind++) {
        fleetLen[0] += shipAreas[0][ind][0];
        fleetLen[1] += shipAreas[1][ind][0];
    }
    myFleet = mylocalobj.myfleet;
    buildTheFleetAtRandom(computerFleet);
    console.log(">>>computerFleet: " + computerFleet);

    createGrid("1"); initGrid2("1", mylocalobj.myfleet);
    createGrid("2"); initGrid("2");
    $("#alert").text(msg030);
    document.getElementById("board2").addEventListener("click", function(event) {
        clickOnBoard2(event);
      });
});