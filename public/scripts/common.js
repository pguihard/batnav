var msg030 = "Vous pouvez jouer.";

var msg1 = "Votre adversaire n'est pas prêt à jouer.";
var msg11 = "Votre adversaire s'est déconnecté en cours de jeu. Reconnectez vous.";
var msg2 = "A votre adversaire de jouer.";
var msg20 = "> Manqué. ";
var msg21 = "> Touché. ";
var msg22 = "> Coulé. ";
var msg3 = "Vous avez perdu!"
var msg4 = "Vous avez gagné!"

var shipId = 0; // 1-5

var colorMissed = "#73B1B7";
var colorReached = "#e78b8b";
var colorSunk = "#f72929";

var shipArea = [[5, "#8ca78d"], [4, "#71ad73"], [3, "#858f74"], [3, "#7d9b48"], [2, "#5c8b3c"]];

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
};

// called by buildTheFleet.js, client.js
function initGrid(boardn){
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
        var id = boardn + row.toString() + col.toString();
        document.getElementById(id).textContent = " ";
        }
    }
};

// called by atRandomFleet.js, client.js
function initGrid2(boardn, fleetArea){
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
			var id = boardn + row.toString() + col.toString();

			if (fleetArea[row][col] == 0) {
				document.getElementById(id).textContent = " ";
			} else {
				document.getElementById(id).style.backgroundColor = shipArea[ fleetArea[row][col] - 1 ][1];
					document.getElementById(id).textContent = "X";
			}
        }
    }
};

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
	var shipSize = shipArea[shipId-1][0];

	while(collision) {
		if (collision) {
			resetFleet(shipId, fleetArea);
		}
		collision = false;
		switch (direction) {
			case 0:	//North
				row = getRandomIntInclusive(shipSize-1, 9);
				col = getRandomIntInclusive(0, 9);
				for(var ind = 0; ind < shipSize; ind++) {
					if (fleetArea[row - ind][col] != 0) {
						collision = true;
					}
					else {
						fleetArea[row - ind][col] = shipId;
					}
				}
				break;
			case 1:	//South
				row = getRandomIntInclusive(0, 9);
				col = getRandomIntInclusive(0, 10-shipSize);
				for(var ind = 0; ind < shipSize; ind++) {
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