using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public partial class Orders
    {

        [Key]
        public int id { get; set; }
        public DateTime date { get; set; }
        public int clientId { get; set; }
        public int sum { get; set; }
        public int count { get; set; }
        [ForeignKey(nameof(OrderStatus))]
        public int statusId { get; set; }
        public int discount { get; set; }
        public decimal discountSum { get; set; }
        [JsonPropertyName("orderStatus")]
        public OrderStatus OrderStatus { get; set; }
    }
    public  class OrderStatus
    {

        [Key]
        public int id { get; set; }
        public string name { get; set; }


    }
    public  class OrderProducts
    {
        [Key]
        public int id { get; set; }
        [ForeignKey(nameof(Orders))]
        public int orderId { get; set; }
        [ForeignKey(nameof(Products))]
        public int productId { get; set; }
        public int count { get; set; }
        [JsonPropertyName("orders")]
        public virtual Orders Orders { get; set; }
        [JsonPropertyName("products")]
        public virtual Products Products { get; set; }
    }
}
