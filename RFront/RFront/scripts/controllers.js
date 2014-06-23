var controllers = (function () {
    'use strict';
    $.connection.hub.url = 'http://localhost:65075/signalr';
    $.connection.hub.start();
    var chat = $.connection.chat;

    var UIController = Class.create({
        isLoggedIn: function () {
            var username = localStorage['username'];
            console.log(username);
            return username !== undefined || username !== null;
        },
        loadUI: function (selector) {
            this.defineClientHubFunctions(selector);
            this.attachEvents(selector);
            
            //TODO: check if user has already assigned a nickname
            //current implementation with localStorage
            if (false) {
                this.loadMainChatLayout(selector);
            } else {
                this.loadInitialPage(selector);
            }
        },
        loadInitialPage: function (selector) {
            var that = this;
            $(selector).load('../partialviews/initial-page.html', function () {
                //additional logic here
                that.attachInitPageEvents(selector);
            });
        },
        loadMainChatLayout: function (selector, connectedUsers) {
            var that = this;
            $(selector).load('../partialviews/main-layout.html', function () {
                //additional logic here
                that.attachMainLayoutEvents();
                var usersContainer = $('#connected-users-list');
                if (connectedUsers !== undefined) {
                    usersContainer.append(connectedUsers.map(function (user) {
                        return $('<div class="userlist-item"></div>').text(user.Username);
                    }))
                }
            });
        },
        attachEvents: function (selector) {
            //initial page events
        },
        attachInitPageEvents: function (selector) {
            var that = this;
            $('#connect').click(function () {
                var username = $('#username').val();
                if (username !== '') {
                    chat.server.connect(username);
                    localStorage.setItem('username', username);
                }
            });
            $('#logout-button').click(function() {
                localStorage.setItem('username', null);
                that.loadInitialPage(selector);
            });
            $('#username').keypress(function(e) {
                if (e.which == 13) {
                    $('#connect').click();
                }
            });
        },
        attachMainLayoutEvents: function () {
            $('#send-message').click(function() {
                var username = localStorage['username'];
                var message = $('#message-input').val();
                console.log("Message to send: username:" + username + ", message:" + message);
                if (message !== '') {
                    chat.server.sendMessageToAll(username, message);
                    $('#message-input').val('');
                }
            });
            //add Enter handler for posting messages
            $('#message-input').keypress(function(e) {
                if (e.which == 13) {
                    $('#send-message').click();
                    $('#message-input').focus();
                }
            });
        },
        defineClientHubFunctions: function (selector) {
            var that = this;

            chat.client.onFirstConnection = function (id, username, connectedUsers, messages) {
                that.logNotification('onFirstConnection');
                that.loadMainChatLayout(selector, connectedUsers);
            }

            chat.client.onNewUserConnected = function (id, username) {
                that.logNotification('onNewUserConnected');
            }

            chat.client.receiveMessage = function (username, message) {
                that.logNotification("messageReceived: " + message);
                $('#messages-feed').append('<div class="message"><span class="message-username">' + username + '</span>: ' + message + '</div>')
            }
        },
        logError: function (message) {
            $('#notification-feed').prepend('<p class="log-error">' + message + '</p>')
        },
        logNotification: function (message) {
            $('#notification-feed').prepend('<p class="log-notification">' + message + '</p>')
        }
    });
    return {
        getUIController: function () {
            return new UIController();
        }
    }
}());