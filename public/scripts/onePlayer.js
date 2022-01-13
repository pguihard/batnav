// Here the player is fighting against the computer, the server is not involved

var computerFleet = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
    
var computerShot = "**";
var reachedShot = "**";
var nor = -1;
var wes = -1;
var sou = -1;
var eas = -1;

var aShip = [1, 2, 3, 4, 5];
var reached = [10, 20, 30, 40, 50];
var sank = [11, 21, 31, 41, 51];

function reachedRemaining () {
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            if (reached.indexOf(myFleet[row][col]) != -1) {
                return row.toString() + col.toString();
            }
        }
    }
    return "**";
}

function shotAtRandom (minr, maxr, minc, maxc) {
    var row = getRandomIntInclusive(minr, maxr);
    var col = getRandomIntInclusive(minc, maxc);
    while (myFleet[row][col] >= 9) {    //already shooted at this location
        row = getRandomIntInclusive(minr, maxr);
        col = getRandomIntInclusive(minc, maxc);
    }
    return row.toString()+col.toString();
}

function aroundTheCell(row, col) {
    var direction = 0;
    if (nor != -1) {
        nor--;
        if (nor == -1 || myFleet[nor][col] >= 9) { //stop to go to this direction
            if (row - nor > 1) {
                sou = row; //take the opposite direction
            }
            else {
                wes = col;
            }
            nor = -1;
        }
        else    //pursue into this direction
        {
            direction = nor;
            if (myFleet[nor][col] == 0) {
                if (row - nor > 1) {
                    sou = row; // will take the opposite direction after this shot
                }
                else {
                    wes = col;
                }
                nor = -1;
            }
            else {
                if (myFleet[nor][col] * 10 != myFleet[row][col]) {
                    // another ship, change the direction, this is an advantage for the computer
                    nor = -1; wes = col;
                }
            }
            return direction.toString() + col.toString();  
        }
    }

    if (wes != -1) {
        wes--;
        if (wes == -1 || myFleet[row][wes] >= 9) { //stop to go to this direction
            if (col - wes > 1) {
                eas = col; //take the opposite direction
            }
            else {
                sou = row;
            }
            wes = -1;
        }
        else    //pursue into this direction
        {
            direction = wes;
            if (myFleet[row][wes] == 0)
            {
                if (col - wes > 1) {
                    eas = col; // will take the opposite direction after this shot
                }
                else {
                    sou = row;
                }
                wes = -1;
            }
            else {
                if (myFleet[row][wes] * 10 != myFleet[row][col]) {
                    // another ship, change the direction, this is an advantage for the computer
                    wes = -1; sou = row;
                }
            }
            return row.toString() + direction.toString();  
        }
    }

    if (sou != -1) {
        sou++;
        if (sou == 10 || myFleet[sou][col] >= 9) { //stop to go to this direction
            if (sou - row > 1) {
                //nothing to do
            }
            else {
                eas = col;
            }
            sou = -1;
        }
        else    //pursue into this direction
        {
            direction = sou;
            if (myFleet[sou][col] == 0) {
                if (sou - row > 1) {
                    //nothing to do
                }
                else {
                    eas = col;
                }
                sou = -1;
            }
            else {
                if (myFleet[sou][col] * 10 != myFleet[row][col]) {
                    // another ship, change the direction, this is an advantage for the computer
                    sou = -1; eas = col;
                }
            }
            return direction.toString() + col.toString();  
        }
    }

    if (eas != -1) {
        eas++;
        if (eas == -1 || myFleet[row][eas] >= 9) { //stop to go to this direction
            eas = -1;
        }
        else    //pursue into this direction
        {
            direction = eas;
            if (myFleet[row][eas] == 0) {
                eas = -1;
            }
            else {
                if (myFleet[row][eas] * 10 != myFleet[row][col]) {
                    // another ship, change the direction, this is an advantage for the computer
                    eas = -1;
                }
            }
            return row.toString() + direction.toString();  
        }
    }
    return shotAtRandom(0, 9, 0, 9);
}

function computeTheShot() { //computer against my fleet
    while (reachedShot != "**") {
        var prow = parseInt(reachedShot.substring(0, 1));
        var pcol = parseInt(reachedShot.substring(1, 2));
        if (reached.indexOf(myFleet[prow][pcol]) != -1) {
            computerShot = aroundTheCell(prow, pcol);
            return computerShot;
        }
        if (sank.indexOf(myFleet[prow][pcol]) != -1) {
            nor = sou = wes = eas = -1;
            reachedShot = reachedRemaining();
            if (reachedShot != "**") {
                nor = prow;
            }
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
    var td = event.target.id;
    if (td == "" || td.substring(0, 5) == "board"){
        return;
    }
    document.getElementById(td).innerText = "O";
    document.getElementById(td).style.borderRadius = "100%";

    getTheShot(td.substring(1), computerFleet, "2", null);
    // this is the turn for the computer to shoot
    getTheShot(computeTheShot(), myFleet, "1", null);
    var prow = parseInt(computerShot.substring(0, 1));
    var pcol = parseInt(computerShot.substring(1, 2));
    if (reached.indexOf(myFleet[prow][pcol]) != -1 && reachedShot == "**") {
        reachedShot = computerShot;
        nor = prow;
    }
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

    createGrid("1"); initGrid2("1", mylocalobj.myfleet);
    createGrid("2"); initGrid("2");
    $("#alert").text(msg030);
    
    $("#board2").on("click", function(event) {
        clickOnBoard2(event);
    });
});