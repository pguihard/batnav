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
            alert = document.getElementById("alert").innerText;
            if (obj.clients == "1 players"){
                $("#alert").text("Please wait for 2 players!");
                $("#message").text("");
            }
            else if (alert == "Please wait for 2 players!"){
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
        if(alert == "Please wait!" ){
            return;
        }
        $("#alert").text("Please wait!");
        sock.send(document.getElementById("toSend").value); });
});