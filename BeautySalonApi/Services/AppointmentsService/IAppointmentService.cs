using BeautySalonApi.Models;
using BeautySalonApi.Requests;

namespace BeautySalonApi.Services.AppointmentsService
{
    public interface IAppointmentService
    {
        public List<TimeSpan> GetAvailableSlots(int serviceId,int skillId, DateTime date, int duration);
        public List<Masters> GetAvailableMasters(DateTime date,int serviceId, int skillId);
        public Task<bool> CreateAppointment(CreateBook app);
        public List<AppointmentsFull> GetClientsAppointments(int clientId);
        public Task CancelAppointment(int id);
    }
}
