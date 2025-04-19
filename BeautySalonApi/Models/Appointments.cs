using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BeautySalonApi.Models
{
    public class Appointments
    {
        [Key]
        public int id { get; set; }
        [ForeignKey(nameof(Masters))]
        public int masterId { get; set; }
        [JsonPropertyName("masters")]
        public Masters Masters { get; set; }
        public TimeSpan timeStart { get; set; }
        public TimeSpan timeEnd { get; set; }
        public int totalSum { get; set; }
        public int totalDuration { get; set; }
        [ForeignKey(nameof(AppointmentStatus))]
        public int statusId { get; set; }
        [JsonPropertyName("appointmentStatus")]
        public AppointmentStatus AppointmentStatus { get; set; }
        public DateTime date {  get; set; }
        [ForeignKey(nameof(Clients))]
        public int clientId { get; set; }
        [JsonPropertyName("clients")]
        public Clients Clients { get; set; }
    }
    public  class AppointmentStatus
    {
        [Key]
        public int statusId { get; set; }
        public string name { get; set; }
    }
    public partial class AppointmentsServices
    {
        [Key]
        public int id { get; set; }
        [ForeignKey(nameof(Appointments))]
        public int appointmentId { get; set; }
        [ForeignKey(nameof(Services))]

        public int serviceId { get; set; }
        [JsonPropertyName(name: "appointments")]

        public Appointments Appointments { get; set; }
        [JsonPropertyName(name: "services")]

        public Services Services { get; set; }
    }
}
