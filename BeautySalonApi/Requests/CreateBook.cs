using System.ComponentModel.DataAnnotations;

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
    }
}
