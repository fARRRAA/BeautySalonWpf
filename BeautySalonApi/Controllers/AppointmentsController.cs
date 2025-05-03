using BeautySalonApi.Requests;
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
        [HttpPost("add")]
        public async Task<IActionResult> Create(CreateBook book)
        {
            var appointment = await _service.CreateAppointment(book);
            return Ok(appointment);
        }
        [HttpGet("masters")]
        public async Task<IActionResult> GetAvailableMasters(DateTime date, int typeid, int skillId)
        {
            return Ok(_service.GetAvailableMasters(date, typeid, skillId));

        }
        [HttpGet("time")]
        public async Task<IActionResult> GetAvaiableTime(int masterId, int serviceId, int skillId, DateTime date, int duration)
        {
            return Ok(_service.GetAvailableSlots(masterId,serviceId,skillId, date, duration));
        }
        [HttpGet("client/{id}")]
        public async Task<IActionResult> GetClientApps(int id)
        {
            return Ok(_service.GetClientsAppointments(id));
        }
        [HttpGet("cancel/{id}")]
        public async Task<IActionResult> CancelApp(int id)
        {
           await _service.CancelAppointment(id);
            return Ok();
        }
    }

}
