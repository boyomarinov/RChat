using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RBack.Models
{
    public class MessageModel
    {
        public string Username { get; set; }
        
        public DateTime PublishTime { get; set; }

        public string Message { get; set; }
    }
}