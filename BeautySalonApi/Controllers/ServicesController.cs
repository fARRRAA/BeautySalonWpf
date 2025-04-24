using BeautySalonApi.Services.ServicesService;
using Microsoft.AspNetCore.Mvc;

namespace BeautySalonApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : Controller
    {
        private readonly IServicesService _service;
        public ServicesController(IServicesService service)
        {
            _service = service;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(_service.GetAll());
        }
        [HttpGet("services")]
        public async Task<IActionResult> GetServiceSkills()
        {
            return Ok(_service.GetAllSkill());
        }

    }
}
