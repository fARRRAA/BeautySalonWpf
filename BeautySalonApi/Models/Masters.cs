using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public  class Masters
    {
        [Key]
        public int masterId { get; set; }
        public string Lname { get; set; }
        public string Fname { get; set; }
        public string Patronymic { get; set; }
        public DateTime dateBirth { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public string photo { get; set; }
        [ForeignKey(nameof(MastersQualifications))]
        public int qualificationId { get; set; }
        [ForeignKey(nameof(MastersSkills))]
        public int skillId { get; set; }
        [ForeignKey(nameof(Roles))]
        public int roleId { get; set; }
        [JsonPropertyName(name: "roles")]
        public Roles Roles { get; set; }
        [JsonPropertyName(name: "mastersQualifications")]
        public MastersQualifications MastersQualifications { get; set; }
        [JsonPropertyName(name: "mastersSkills")]
        public MastersSkills MastersSkills { get; set; }

    }
    public class MastersFull
    {
        public Masters master { get; set; }
        public TypeServices typeServices { get; set; }

    }
    public partial class MastersQualifications
    {

        [Key]
        public int qualifictionId { get; set; }
        [ForeignKey(nameof(TypeServices))]
        public int typeServiceId { get; set; }
        [JsonPropertyName(name: "typeServices")]
        public  TypeServices TypeServices { get; set; }
    }
    public  class MastersSkills
    {
        [Key]
        public int skillId { get; set; }
        public string name { get; set; }
        public int rate { get; set; }
    }
    public partial class TypeServices
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
    }

}
