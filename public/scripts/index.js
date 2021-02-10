$(document).ready(function() {
	$(".start").on("click", function() {
		var fleetArea = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
		var mylocalobj = {players : 0, myfleet : fleetArea};
		
		if (twoPlayers.checked) {
			mylocalobj.players = 2;	
		}
		if (onePlayer.checked) {
			mylocalobj.players = 1;	
		}
		myobjet_json = JSON.stringify(mylocalobj);
		localStorage.setItem("mylocalobj",myobjet_json);
		
		if (buildTheFleet.checked) {
		    window.location.replace("pages/buildTheFleet.html");
		}
		if (atRandomFleet.checked) {
			mylocalobj.random = 1;
		    window.location.replace("pages/atRandomFleet.html");
		}

		myobjet_json = JSON.stringify(mylocalobj);
		localStorage.setItem("mylocalobj",myobjet_json);
	});
})