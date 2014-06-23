//$(document).ready(function() {
//    $.connection.hub.url = 'http://localhost:65075/signalr';
//    $.connection.hub.start();
//    var chat = $.connection.chat;
    
//    chat.client.onFirstConnection = function(id, username, connectedusers, messages) {
//        console.log(id);
//        console.log(username);
//        console.log(connectedusers);
//    }
    
//    chat.client.onNewUserConnected = function(id, username) {
        
//    }

//    $('#connect').click(function() {
//        var username = $('#username').val();
//        chat.server.connect(username);
//    });
//});