using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public class Clients
    {
        [Key]
        public int userID { get; set; }
        public string Lname { get; set; }
        public string FName { get; set; }
        public DateTime dateBirth { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string photo { get; set; }
        public string Preferences { get; set; }
        [ForeignKey(nameof(Roles))]
        public int roleId { get; set; }
        [JsonPropertyName("roles")]
        public Roles Roles { get; set; }
        public int visitsCount { get; set; }
        public bool isEmailConfirmed { get; set; }
        public int loginCode { get; set; }
        public DateTime codeExpiration { get; set; }
    }
    public  class Roles
    {

        [Key]
        public int roleId { get; set; }
        public string Name { get; set; }
    }

}
