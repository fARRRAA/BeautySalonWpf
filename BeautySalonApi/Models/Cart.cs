using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public class Cart
    {
        [Key]
        public int id { get; set; }
        [ForeignKey(nameof(Client))]
        public int userId { get; set; }
        [JsonPropertyName("client")]
        public Clients Client { get; set; }
        [ForeignKey(nameof(Product))]
        public int productId { get; set; }
        [JsonPropertyName("product")]
        public Products Product { get; set; }
        public int count { get; set; }
    }
    public class CartRequest
    {
        public int userId { get; set; }
        public int productId { get; set; }
        public int count { get; set; }

    }
}
