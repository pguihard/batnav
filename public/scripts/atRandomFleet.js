
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
		if (mylocalobj.players == 1) {
			mylocalobj.myfleet = fleetArea;
			myobjet_json = JSON.stringify(mylocalobj);
			localStorage.setItem("mylocalobj",myobjet_json);
			window.location.replace("../pages/onePlayer.html");
		}
		if (mylocalobj.players == 2) {
			mylocalobj.myfleet = fleetArea;
			myobjet_json = JSON.stringify(mylocalobj);
			localStorage.setItem("mylocalobj",myobjet_json);
			window.location.replace("../pages/client.html");
		}
	});
})