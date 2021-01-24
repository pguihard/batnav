var createGrid=function(){
    var tableString = "<table>";
    for (row = 0; row < 10; row++) {
        tableString += "<tr>";
        for (col = 0; col < 10; col++) {
            tableString += '<td id="' + row + col + '">O</td>';
        }
        tableString += "</tr>";
    }
    tableString += "</table>";
    document.getElementById("board").innerHTML += tableString;
};

function clickOnBoard(event, sock) {
    textClients = document.getElementById("clients").innerText;
    if(textClients == "1 players" ){
        return;
    }
    alert = document.getElementById("alert").innerText;
    if(alert == "Please wait!" ){
        return;
    }
    td = event.target.id
    if (td == "board"){
        return;
    }
    $("#alert").text("Please wait!");
    document.getElementById(td).innerText = "X";
    sock.send(td);
}

$(document).ready(function () {
    createGrid();
    var sock = io();
    document.getElementById("board").addEventListener("click", function(event) {
        clickOnBoard(event, sock);
      });
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
});