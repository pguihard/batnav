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
        }
    });
    sock.connect();
    $("#poke").click(function() {
        textClients = document.getElementById("clients").innerText;
        if(textClients == "1 players" ){
            $("#message").text("There is nobody connected to receive your message!");
            return;
        }
        alert = document.getElementById("alert").innerText;
        if(alert == "Please Wait!" ){
            return;
        }
        $("#alert").text("Please Wait!");
        sock.send(document.getElementById("toSend").value); });
});