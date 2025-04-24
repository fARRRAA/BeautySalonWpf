using BeautySalonApi.Services.AppointmentsService;
using Microsoft.AspNetCore.Mvc;

namespace BeautySalonApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : Controller
    {
        private readonly IAppointmentService _service;
        public AppointmentsController(IAppointmentService service)
        {
            _service = service;
        }

        [HttpGet("masters")]
        public async Task<IActionResult> GetAvailableMasters(DateTime date, TimeSpan timeSlot, int duration, int serviceId)
        {
            return Ok(_service.GetAvailableMasters(date, timeSlot, duration, serviceId));

        }
        [HttpGet("time")]
        public async Task<IActionResult> GetAvaiableTime(int masterId, DateTime date, int duration)
        {
            return Ok(_service.GetAvailableSlots(masterId, date, duration));
        }
    }

}
