using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using BeautySalonApi.Models;
using BeautySalonApi.Requests;
using BeautySalonApi.DataBase;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace BeautySalonApi.Services.AppointmentsService
{
    public class AppointmentService : IAppointmentService
    {
        private ContextDb _context;
        public AppointmentService(ContextDb context)
        {
            _context = context;
        }

        public async Task CancelAppointment(int id)
        {
            var app = _context.Appointments.FirstOrDefault(x => x.id == id);
            app.statusId = 3;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CreateAppointment(CreateBook app)
        {
            var appointment = new Appointments()
            {
                masterId = app.masterId,
                timeStart = app.timeStart,
                timeEnd = app.timeStart.Add(TimeSpan.FromMinutes(app.totalDuration)),
                statusId = 2,
                totalDuration = app.totalDuration,
                totalSum = app.totalSum,
                date = app.date,
                clientId = app.clientId
            };
            await _context.Appointments.AddAsync(appointment);
            foreach (Service service1 in app.services)
            {
                var service = _context.Services.FirstOrDefault(x => x.serviceId == service1.serviceId);
                var temp = new AppointmentsServices()
                {
                    Appointments = appointment,
                    Services = service
                };
                await _context.AppointmentsServices.AddAsync(temp);
            }
            await _context.SaveChangesAsync();
            return true;
        }
        public List<Masters> GetAvailableMasters(DateTime date, int typeid, int skillId)
        {

            var service = _context.Services.FirstOrDefault(x => x.serviceId == typeid);

            return _context.Masters.Where(x => x.qualificationId == service.typeServiceId && x.skillId == skillId).Include(x => x.MastersQualifications
            ).Include(x => x.MastersQualifications.TypeServices).Include(x => x.MastersSkills).ToList();
        }

        public List<TimeSpan> GetAvailableSlots(int serviceId, int skillId, DateTime date, int duration)
        {
            var availableSlots = new List<TimeSpan>();
            var startTime = new TimeSpan(9, 0, 0);
            var endTime = new TimeSpan(21, 0, 0);
            var appointmentDurations = TimeSpan.FromMinutes(duration);
            var service = _context.Services.FirstOrDefault(x => x.serviceId == serviceId);

            //var master = _context.Masters.FirstOrDefault(x => x.masterId == masterId);
            for (var time = startTime; time.Add(appointmentDurations) <= endTime; time = time.Add(TimeSpan.FromMinutes(30)))
            {
                bool isAvailable = !_context.Appointments.Any(a =>
                    a.Masters.qualificationId == service.typeServiceId &&
                    a.Masters.skillId == skillId &&
                    a.date == date &&
                    ((a.timeStart <= time && a.timeEnd > time) ||
                     (a.timeStart < time.Add(appointmentDurations) && a.timeEnd >= time.Add(appointmentDurations))));

                if (isAvailable)
                {
                    availableSlots.Add(time);
                }
            }
            return availableSlots;
        }

        public List<AppointmentsFull> GetClientsAppointments(int clientId)
        {
            var app = _context.Appointments.Where(x => x.clientId == clientId).Include(x => x.Masters)
                .Include(x => x.Masters.MastersQualifications).Include(x => x.Masters.MastersQualifications.TypeServices).Include(x => x.Masters.MastersSkills)
                .Include(x => x.AppointmentStatus).ToList();

            List<AppointmentsFull> full = new List<AppointmentsFull>();
            foreach (var appointment in app)
            {
                var services = _context.AppointmentsServices.Where(x => x.appointmentId == appointment.id).Include(x => x.Services).ToList();
                full.Add(new AppointmentsFull { appointment = appointment, appointmentServices = services });
            }
            return full;

        }
    }
}
