using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public  class Services
    {
        [Key]
        public int serviceId { get; set; }
        public string serviceName { get; set; }
        [ForeignKey(nameof(TypeServices))]
        public int typeServiceId { get; set; }
        public int juniorRunTime { get; set; }
        public int middleRunTime { get; set; }
        public int SeniorRunTime { get; set; }
        public int juniorPrice { get; set; }
        public int middlePrice { get; set; }
        public int seniorPrice { get; set; }
        [JsonPropertyName("typeServices")]
        public  TypeServices TypeServices { get; set; }

    }
}
