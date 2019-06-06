import _ from 'lodash';
import io from 'socket.io-client';

$(function () {

    const socket = io('http://localhost:3000/');
    var nickName = "",
        id = "",
        btnState = false

    $('#nicknameButton').click(function (e) {
        console.log("submit", $('#nicknameInput').val())
        e.preventDefault(); // prevents page reloading
        nickName = $('#nicknameInput').val()
        socket.emit('login', { nickName: nickName });
        $('#nicknameInput').val('');
        $("#userLogin").hide();


        return false;


    });

    $('#buttonerators').click(function (e) {
        if (!btnState) { // if btnState is false
            btnState = true
        } else {
            btnState = false
        }
        e.preventDefault(); // prevents page reloading
        socket.emit('ready', { readyState: btnState });
        return false;
    });

    $('.btnMessage').click(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', { nickName: nickName, message: $('#messageInput').val() });
        $('#messageInput').val('');
        return false;
    });

    socket.on('login', function (data) {
        console.log(data)
        id = data.id
        let source = document.getElementById("cardPlayer").innerHTML;
        let template = Handlebars.compile(source)
        $('.messages').append($(template(data)));
        if(data.nickName== nickName){
            $("#readyBtn").show();
        }      
    });


    $("#readyBtn").hide();
    $("#messageForm").hide();

    $('#readyBtn').click(function (e) {
        if (!btnState) { // if btnState is false
            btnState = true
        } else {
            btnState = false
        }
        e.preventDefault(); // prevents page reloading
        socket.emit('ready', { readyState: btnState });
        $('#messages').append($('<li id="waitMsg">').text("Waiting for other players ..."));
        $("#readyBtn").hide();
        
        return false;
    });

    socket.on('ready', function (data) {
        console.log(data)
        $("#messageForm").show();
        $("#waitMsg").hide();
    });

    socket.on('chat message', function (msg) {
        console.log(msg.nickName)
        if (msg.character) {
            $('#messages').append($('<li>').text(" (" + msg.nickName + ")" + msg.message));
        } else {
            $('#messages').append($('<li>').text(" (" + msg.nickName + ")" + msg.message));
        }
        console.log(msg)
        if (msg.message ==  "ha vinto") {
            let win = document.querySelector("#win");
            if (msg.character) {
                win.innerHTML = msg.nickName + " Win !!";
            win.classList.add("win");
            $("#messageForm").hide();
            }
            else{ win.innerHTML = "You Win !!";
            win.classList.add("win");
            $("#messageForm").hide();
        }
           
        }
    });

    socket.on('connection', function (data) {
        console.log(data)
        data.map((x)=>{
            id = x.id
            let source = document.getElementById("cardPlayer").innerHTML;
            let template = Handlebars.compile(source)
            $('.messages').append($(template(x)));

        });
        
    });

    socket.on('disconnect', function (data) {
        console.log(data)
        $("#cardP").hide();
       

    });
});






/*socket.on('login', function(msg){
    // un utente si è connesso
 let nome_utente = msg.nickName
 let nome_personaggio= msg.character.name
});
$( "#buttonerators" ).click(function() {
    let nickName =$( "#single" ).val();
  });
/*
on form submit function() {
    socket.emit('login', { nickName: valore dell'input })
}
*/