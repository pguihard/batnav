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

function resetBoard1() {
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            var id = "1" + row.toString() + col.toString();
            if (document.getElementById(id).textContent == "X") {
                document.getElementById(id).textContent = " ";
                document.getElementById(id).style.backgroundColor = "";
            }
        }
    }
};

$(document).ready(function() {
	playing.style.display = "none";
	var myobjet_json = localStorage.getItem("mylocalobj");
	var mylocalobj = JSON.parse(myobjet_json);

	var fleetArea = mylocalobj.myfleet;

	createGrid("1");

	$(".generate").on("click", function() {
		resetBoard1();
		buildTheFleetAtRandom(fleetArea);
		initGrid2("1", fleetArea);
		$("#alert").text("");
		playing.style.display = "initial";
	});
	
	$(".return").on("click", function() {
		window.location.replace("../index.html");
	});

	$(".play").on("click", function() {
		if (mylocalobj.players == 2) {
			mylocalobj.myfleet = fleetArea;
			myobjet_json = JSON.stringify(mylocalobj);
			localStorage.setItem("mylocalobj",myobjet_json);
			window.location.replace("../pages/client.html");
		}
	});
})