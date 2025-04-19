using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public class Products
    {
        [Key]
        public int productId { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public string photo { get; set; }
        [ForeignKey(nameof(TypeProducts))]
        public int typeId { get; set; }
        public int soldCount { get; set; }
        public int inStock { get; set; }
        [JsonPropertyName("typeProducts")]
        public  TypeProducts TypeProducts { get; set; }

    }
    public class TypeProducts
    {
        [Key]
        public int typeId { get; set; }
        public string name { get; set; }

    }
}
