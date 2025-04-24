using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public class Clients
    {
        [Key]
        public int userID { get; set; }
        public string? Lname { get; set; } // Объявлено как nullable
        public string? FName { get; set; } // Объявлено как nullable
        public DateTime dateBirth { get; set; }
        public string? login { get; set; } // Объявлено как nullable
        public string? password { get; set; } // Объявлено как nullable
        public string? phone { get; set; } // Объявлено как nullable
        public string? email { get; set; } // Объявлено как nullable
        public string? photo { get; set; }
        public string? Preferences { get; set; } // Объявлено как nullable
        [ForeignKey(nameof(Roles))]
        public int roleId { get; set; }
        [JsonPropertyName("roles")]
        public Roles Roles { get; set; }
        public int visitsCount { get; set; }
        public bool isEmailConfirmed { get; set; } = false;
        public int? loginCode { get; set; }
        public DateTime? codeExpiration { get; set; }
    }
    public  class Roles
    {

        [Key]
        public int roleId { get; set; }
        public string Name { get; set; }
    }

}
