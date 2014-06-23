using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using RBack.Models;

namespace RBack.Hubs
{
    [HubName("chat")]
    public class ChatHub : Hub
    {
        private static List<ChatUserModel> ConnectedUsers = new List<ChatUserModel>();
        private static List<MessageModel> MessagesCache = new List<MessageModel>();
        private static List<ChatGroupModel> Groups = new List<ChatGroupModel>(); 

        public void Connect(string username)
        {
            var id = Context.ConnectionId;
            if (!ConnectedUsers.Any(x => x.ConnectionId == id))
            {
                ConnectedUsers.Add(new ChatUserModel
                {
                    ConnectionId = id,
                    Username = username
                });

                Clients.Caller.onFirstConnection(id, username, ConnectedUsers, MessagesCache);
                Clients.AllExcept(id).onNewUserConnected(id, username);
            }
        }

        public void SendMessageToAll(string username, string message)
        {
            AddMessageToCache(username, message);
            Clients.All.receiveMessage(username, message);
        }

        private void AddMessageToCache(string username, string message)
        {
            MessagesCache.Add(new MessageModel { Username = username, Message = message });
            //have only the last 200 messages in the cache
            if (MessagesCache.Count > 200)
            {
                MessagesCache.RemoveAt(0);
            }
        }

        //public void ConnectToGroup(string username, string group)
        //{
            
        //}
    }
}