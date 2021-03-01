// common data and functions called by other scripts

var msg030 = "Vous pouvez jouer.";

var msg1 = "Votre adversaire n'est pas prêt à jouer.";
var msg11 = "Votre adversaire s'est déconnecté en cours de jeu. Reconnectez vous.";
var msg2 = "A votre adversaire de jouer.";
var msg20 = "> Manqué. ";
var msg21 = "> Touché. ";
var msg22 = "> Coulé. ";
var msg3 = "Vous avez perdu!";
var msg4 = "Vous avez gagné!";

var shipId = 0; // 1-5

var colorMissed = "#73B1B7";
var colorReached = "#e78b8b";
//var colorSunk = "#f72929";
var colorsSunk = ["#ff0000", "#cc0000", "#990000", "#660000", "#ffff00"];

//0: water, 1-5: ship Id, 9: missed, shipId x 10: reached, shipId x 10 + 1: sunk
var myFleet = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];

var shipAreas = [[[5, "#8ca78d"], [4, "#71ad73"], [3, "#858f74"], [3, "#7d9b48"], [2, "#5c8b3c"]],
                [[5, "#8ca78d"], [4, "#71ad73"], [3, "#858f74"], [3, "#7d9b48"], [2, "#5c8b3c"]]];

var fleetLen = [0, 0];
var nShots = [0, 0]; //number of shots                

// called by atRandomFleet.js, buildTheFleet.js, client.js
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
}

// called by buildTheFleet.js, client.js
function initGrid(boardn){
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
        var id = boardn + row.toString() + col.toString();
        document.getElementById(id).textContent = " ";
        }
    }
}

// called by atRandomFleet.js, client.js
function initGrid2(boardn, fleetArea){
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
			var id = boardn + row.toString() + col.toString();

			if (fleetArea[row][col] == 0) {
				document.getElementById(id).textContent = " ";
			} else {
				document.getElementById(id).style.backgroundColor = shipAreas[boardn-1][ fleetArea[row][col] - 1 ][1];
					document.getElementById(id).textContent = "X";
			}
        }
    }
}

// return an interger at random between a min value (included)
// and a max value (included).
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function resetFleet(shipId, fleetArea) {
	for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            if (fleetArea[row][col] == shipId) {
				fleetArea[row][col] = 0;
			}
        }
    }
  }

function putOneShip (fleetArea, shipId) {
	
	var direction = getRandomIntInclusive(0, 1); //0:North, 1:South, 2:East, 3:West
	
	var row = 0;
	var col = 0;
	var collision = true;
	var shipSize = shipAreas[0][shipId-1][0];
    var ind = 0;

	while(collision) {
		if (collision) {
			resetFleet(shipId, fleetArea);
		}
		collision = false;
		switch (direction) {
			case 0:	//North
				row = getRandomIntInclusive(shipSize-1, 9);
				col = getRandomIntInclusive(0, 9);
				for(ind = 0; ind < shipSize; ind++) {
					if (fleetArea[row - ind][col] != 0) {
						collision = true;
					}
					else {
						fleetArea[row - ind][col] = shipId;
					}
				}
				break;
			case 1:	//East
				row = getRandomIntInclusive(0, 9);
				col = getRandomIntInclusive(0, 10-shipSize);
				for(ind = 0; ind < shipSize; ind++) {
					if (fleetArea[row][col + ind] != 0) {
						collision = true;
					} else {
						fleetArea[row][col + ind] = shipId;
					}
				}
				break;
		}
	}
}
function buildTheFleetAtRandom(fleetArea) {
	putOneShip (fleetArea, 1);
	putOneShip (fleetArea, 2);
	putOneShip (fleetArea, 3);
	putOneShip (fleetArea, 4);
	putOneShip (fleetArea, 5);
}
//called by the next getTheShot funtion
function shipIsSunk (theFleet, ship_Id, boardn, sock) {
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            if (theFleet[row][col] == ship_Id) {
                var id = boardn + row.toString() + col.toString();
                document.getElementById(id).style.backgroundColor = colorsSunk[ship_Id / 10 - 1];
                if (sock != null) 
                {
                    sock.send("S" + (ship_Id / 10 - 1).toString() + row.toString() + col.toString());
                }
                theFleet[row][col] += 1;
            }
        }
    }
}
//called by client.js and onePlayer.js
function getTheShot(coord, theFleet, boardn, sock){
    var row = parseInt(coord.substring(0, 1));
    var col = parseInt(coord.substring(1, 2));
    document.getElementById(boardn + coord).innerText = "O";
    document.getElementById(boardn + coord).style.borderRadius = "100%";
    if (theFleet[row][col] == 0) {
        //missed
        theFleet[row][col] = 9;
        document.getElementById(boardn + coord).style.backgroundColor = colorMissed;
        if (sock != null) 
        {
            sock.send("M" + coord);
        }
    }
    else if (theFleet[row][col] < 9) { //test if shot against a valid part of ship
        fleetLen[boardn-1]--;
        if (fleetLen[boardn-1] == 0) {
            ++nShots[0];
            $("#alert").text(msg3 + " Nombre de tirs subis: " + nShots[0]);
        }

        if (boardn == 2 && fleetLen[boardn-1] == 0) {   //called by onePlayer only
            ++nShots[1];
            $("#alert").text(msg4 + " Nombre de vos tirs: " + nShots[1]);
        }

        if (--shipAreas[boardn-1][ theFleet[row][col] - 1][0] == 0) { //test the current length of the ship
            //sunk
            theFleet[row][col] *= 10;
            shipIsSunk(theFleet, theFleet[row][col], boardn, sock);
        }
        else {
            //just reached
            document.getElementById(boardn + coord).style.backgroundColor = colorReached;
            if (sock != null) 
            {
                sock.send("R" + coord);
            }
            theFleet[row][col] *= 10;
        }
    }
        nShots[boardn-1]++;
}