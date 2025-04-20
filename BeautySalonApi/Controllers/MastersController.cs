using BeautySalonApi.Services.MastersService;
using Microsoft.AspNetCore.Mvc;

namespace BeautySalonApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MastersController : Controller
    {
        private readonly IMastersService _service;
        public MastersController(IMastersService service)
        {
            _service = service;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(_service.GetAll());
        }
    }
}
