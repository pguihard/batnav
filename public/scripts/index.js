$(document).ready(function () {
    var sock = io();
    sock.on("message", function (data) {
        var obj = JSON.parse(data);
        if (obj.message == "disconnect"){
            sock.disconnect();
            window.location.replace("Rejected.html");
            return;
        }
        if(obj.message) {
            $("#message").text(obj.message);
            $("#alert").text(obj.alert);
        }
        else {
            $("#client").text(obj.client);
            $("#clients").text(obj.clients);
            if (obj.clients == "1 players"){
                $("#alert").text("Please wait for the 2nd player to connect!");
            }
            else{
                $("#alert").text("");
            }
        }
    });
    sock.connect();
    $("#poke").click(function() {
        textClients = document.getElementById("clients").innerText;
        if(textClients == "1 players" ){
            return;
        }
        alert = document.getElementById("alert").innerText;
        if(alert == "Please Wait!" ){
            return;
        }
        $("#alert").text("Please Wait!");
        sock.send(document.getElementById("toSend").value); });
});