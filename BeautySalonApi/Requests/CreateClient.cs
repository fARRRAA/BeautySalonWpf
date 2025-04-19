using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Requests
{
    public class CreateClient
    {
        public string Lname { get; set; }
        public string FName { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
    }
    public class ConfirmEmailModel
    {
        public string email { get; set; }
        public int code { get; set; }
    }
}
