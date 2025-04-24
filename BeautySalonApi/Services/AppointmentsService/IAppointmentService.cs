using BeautySalonApi.Models;
using BeautySalonApi.Requests;

namespace BeautySalonApi.Services.AppointmentsService
{
    public interface IAppointmentService
    {
        public List<TimeSpan> GetAvailableSlots(int masterId, DateTime date, int duration);
        public List<Masters> GetAvailableMasters(DateTime date, TimeSpan timeSlot, int duration,int serviceId);
        public Task CreateAppointment(CreateBook app,List<ServiceSkill> services);
    }
}
