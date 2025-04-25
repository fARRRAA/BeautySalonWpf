using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Requests
{
    public class CreateBook
    {
        public int masterId { get; set; }
        public TimeSpan timeStart { get; set; }
        public TimeSpan timeEnd { get; set; }
        public int totalSum { get; set; }
        public int totalDuration { get; set; }
        public DateTime date { get; set; }
        public int clientId { get; set; }

        [JsonPropertyName("services")]
        public List<Service> services { get; set; } = new List<Service>();
    }

    public class Service
    {
        [JsonPropertyName("serviceId")]
        public int serviceId { get; set; }

        [JsonPropertyName("name")]
        public string name { get; set; }

        [JsonPropertyName("category")]
        public Category Category { get; set; }

        [JsonPropertyName("skillLevel")]
        public SkillLevel SkillLevel { get; set; }
    }

    public class Category
    {
        [JsonPropertyName("id")]
        public int id { get; set; }

        [JsonPropertyName("name")]
        public string name { get; set; }
    }

    public class SkillLevel
    {
        [JsonPropertyName("name")]
        public int name { get; set; }

        [JsonPropertyName("price")]
        public decimal price { get; set; }

        [JsonPropertyName("duration")]
        public int duration { get; set; }
    }
}