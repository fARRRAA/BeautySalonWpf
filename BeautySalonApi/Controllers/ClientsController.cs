using BeautySalonApi.Requests;
using BeautySalonApi.Services.ClientsService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautySalonApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : Controller
    {
        public readonly IClientsService _service;
        public ClientsController(IClientsService service)
        {
            _service = service;
        }
        [HttpGet("all")]
        public async Task<ActionResult> GetAllClients()
        {
            return Ok(_service.All());
        }
        [HttpPost("register")]
        public async Task<IActionResult> CreateClient(CreateClient client)
        {
            if (_service.isExists(client.email))
            {
                return NotFound("пользователь с такой почтой уже существует");
            }
            await _service.CreateClient(client);
            return Ok("Пожалуйста, подтвердите ваш email.");
        }
        [HttpPost("email-confirm")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailModel model)
        {
            var user = _service.GetClientByEmail(model.email);
            if (user == null || user.loginCode != model.code || user.codeExpiration < DateTime.UtcNow)
                return BadRequest("Неверный код или он истек.");
            await _service.ConfirmEmail(user);
            return Ok("Email успешно подтвержден.");
        }
        [HttpGet("client/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(_service.GetClientById(id));
        }

    }
}
