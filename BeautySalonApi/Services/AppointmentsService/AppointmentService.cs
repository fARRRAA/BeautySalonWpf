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

        public async Task CreateAppointment(CreateBook app, List<ServiceSkill> services)
        {
            int totalTime = (int)services.Sum(s => s.runTime);
            int totalPrice = (int)services.Sum(s => s.price);
            var appointment = new Appointments()
            {
                masterId = app.masterId,
                timeStart = app.timeStart,
                timeEnd = app.timeStart.Add(TimeSpan.FromMinutes(totalTime)),
                statusId = 2,
                totalDuration = totalTime,
                totalSum = totalPrice,
                date = app.date,
                clientId = app.clientId
            };
            await _context.Appointments.AddAsync(appointment);
            foreach (ServiceSkill serviceSkill in services)
            {
                var service = serviceSkill.Services;
                var temp = new AppointmentsServices()
                {
                    Appointments = appointment,
                    Services = service
                };
                await _context.AppointmentsServices.AddAsync(temp);
            }
           await _context.SaveChangesAsync();

        }

        public List<Masters> GetAvailableMasters(DateTime date, TimeSpan timeSlot, int duration,int serviceId)
        {
            var availableMasters = new List<Masters>();
            var appointmentDuration = TimeSpan.FromMinutes(duration);
            var timeEnd = timeSlot.Add(appointmentDuration);
            var service = _context.Services.FirstOrDefault(x => x.serviceId == serviceId);
            var _masters = _context.Masters.Where(x=>x.qualificationId==service.typeServiceId).ToList();
            foreach (var master in _masters)
            {
                bool isAvailable = !_context.Appointments.Any(a =>
                
                    a.Masters.masterId == master.masterId &&
                    a.date == date && 
                    (  
                        (a.timeStart <= timeSlot && a.timeEnd > timeSlot) ||
                        (a.timeStart < timeEnd && a.timeEnd >= timeEnd)
                    )
                );

                if (isAvailable)
                {
                    availableMasters.Add(master);
                }
            }

            return availableMasters;
        }

        public List<TimeSpan> GetAvailableSlots(int masterId, DateTime date, int duration)
        {
            var availableSlots = new List<TimeSpan>();
            var startTime = new TimeSpan(9, 0, 0);
            var endTime = new TimeSpan(21, 0, 0);
            var appointmentDurations = TimeSpan.FromMinutes(duration);
            var master = _context.Masters.FirstOrDefault(x => x.masterId == masterId);
            for (var time = startTime; time.Add(appointmentDurations) <= endTime; time = time.Add(TimeSpan.FromMinutes(30)))
            {
                bool isAvailable = !_context.Appointments.Any(a =>
                    a.Masters.masterId == master.masterId &&
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

    }
}
