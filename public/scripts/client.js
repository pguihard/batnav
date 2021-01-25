msg1 = "Your opponent is not connected!";
msg2 = "Please wait!";

function createGrid(boardn){
    var tableString = "<table>";
    for (row = 0; row < 10; row++) {
        tableString += "<tr>";
        for (col = 0; col < 10; col++) {
            tableString += '<td id="' + boardn + row + col + '"></td>';
        }
        tableString += "</tr>";
    }
    tableString += "</table>";
    document.getElementById("board"+boardn).innerHTML += tableString;
};

function initGrid(boardn){
    for (row = 0; row < 10; row++) {
        for (col = 0; col < 10; col++) {
        id = boardn + row.toString() + col.toString();
        document.getElementById(id).innerText = " ";
        }
    }
};

function clickOnBoard2(event, sock) {
    textClients = document.getElementById("clients").innerText;
    if(textClients == "1 players" ){
        return;
    }
    alert = document.getElementById("alert").innerText;
    if(alert == msg2 ){
        return;
    }
    td = event.target.id;
    if (td == "" || td.substring(0, 5) == "board"){
        return;
    }
    $("#alert").text(msg2);
    document.getElementById(td).innerText = "X";
    sock.send(td.substring(1));
}

$(document).ready(function () {
    document.body.requestFullscreen();
    createGrid("1");
    createGrid("2");
    initGrid("1");
    initGrid("2");
    var sock = io();
    document.getElementById("board2").addEventListener("click", function(event) {
        clickOnBoard2(event, sock, "board2");
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
            document.getElementById("1" + obj.message).innerText = "X";
        }
        else {
            $("#client").text(obj.client);
            $("#clients").text(obj.clients);
            alert = document.getElementById("alert").innerText;
            if (obj.clients == "1 players"){
                $("#alert").text(msg1);
                $("#message").text("");
                initGrid("1");
                initGrid("2");
            }
            else if (alert == msg1){
                $("#alert").text("");
            }
        }
    });
    sock.connect();
});