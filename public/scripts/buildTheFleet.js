// This part lets you to build your fleet yourself

var msg01 = "Choisissez le cap ci-dessous et cochez la case correspondant à la poupe d'un bateau de ";
var msg02 = " cases puis validez.";
var msg03 = "Votre flotte est validée. ";

var shipId = 0; // 1-5

//validate one ship converting temporary "x"s to "X"s.
function validateShip() {
    var validated = false;
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            var id = "1" + row.toString() + col.toString();
            if (document.getElementById(id).textContent == "x") {
                document.getElementById(id).textContent = "X";
                document.getElementById(id).style.backgroundColor = shipAreas[0][shipId][1];
                myFleet[row][col] = shipId+1; //0:water, 1-5 ship Id, ship Id x 10: reached, 99: sank
                validated = true;
            }
        }
    }
    return validated;
}

function clickOnBoard1(event) {
    if(shipId == shipAreas[0].length) {
        return;
    }
    resetBoard1();
    var shipSize = shipAreas[0][shipId][0]; // get the ship length
    var td = event.target.id;
    if (td == "" || td.substring(0, 5) == "board"){
        return;
    }
    var newval = 0;
    if (south.checked && parseInt(td.substring(1,2)) + shipSize <= 10) {
        while (shipSize > 0) {
            if (document.getElementById(td).textContent != " "){
                resetBoard1();
                return;
            }
            document.getElementById(td).textContent = "x";
            document.getElementById(td).style.backgroundColor = shipAreas[0][shipId][1];
            newval = parseInt(td.substring(1,2)) + 1;
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
            document.getElementById(td).style.backgroundColor = shipAreas[0][shipId][1];
            newval = parseInt(td.substring(1,2)) - 1;
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
            document.getElementById(td).style.backgroundColor = shipAreas[0][shipId][1];
            newval = parseInt(td.substring(2,3)) + 1;
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
            document.getElementById(td).style.backgroundColor = shipAreas[0][shipId][1];
            newval = parseInt(td.substring(2,3)) - 1;
            td = td.substring(0,1) + td.substring(1,2) + newval.toString();
            shipSize--;
        }
        return;
    }
}

function validate(){
    if(shipId == shipAreas[0].length) {
        return;
    }
    if (validateShip()){
        shipId++;
        if(shipId == shipAreas[0].length) {
            lnorth.style.display = "none"; north.style.display = "none";
            lsouth.style.display = "none"; south.style.display = "none";
            least.style.display = "none"; east.style.display = "none";
            lwest.style.display = "none"; west.style.display = "none";
            validation.style.display = "none";
            playing.style.display = "initial";
            $("#alert").text(msg03 + msg030); //
            return;
        }
        $("#alert").text(msg01  + shipAreas[0][shipId][0] + msg02);
    }
}

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
}

$(document).ready(function () {
    playing.style.display = "none";
    var myobjet_json = localStorage.getItem("mylocalobj");
	var mylocalobj = JSON.parse(myobjet_json);

    createGrid("1"); initGrid("1");

    $("#alert").text(msg01  + shipAreas[0][shipId][0] + msg02);

    $("#board1").on("click", function(event) {
        clickOnBoard1(event);
    });
    
    $(".validate").on("click", function() {
		validate();
	});
    
    $(".return").on("click", function() {
		window.location.replace("../index.html");
	});

    $(".play").on("click", function() {
        if (mylocalobj.players == 1) {
			mylocalobj.myfleet = myFleet;
			myobjet_json = JSON.stringify(mylocalobj);
			localStorage.setItem("mylocalobj",myobjet_json);
			window.location.replace("../pages/onePlayer.html");
		}
		if (mylocalobj.players == 2) {
			mylocalobj.myfleet = myFleet;
			myobjet_json = JSON.stringify(mylocalobj);
			localStorage.setItem("mylocalobj",myobjet_json);
			window.location.replace("../pages/client.html");
		}
	});
});