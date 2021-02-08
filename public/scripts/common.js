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