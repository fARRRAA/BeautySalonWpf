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
        [HttpGet("login")]
        public async Task<IActionResult> LoginClient(string email)
        {

            await _service.LoginClient(email);
            return Ok("Пожалуйста, подтвердите ваш email.");
        }
        [HttpPost("email-confirm")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailModel model)
        {
            var user = _service.GetClientByEmail(model.email);
            if (user == null || user.loginCode != model.code || user.codeExpiration < DateTime.UtcNow)
                return Ok(false);
            await _service.ConfirmEmail(user);
            return Ok(true);
        }
        [HttpGet("client/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(_service.GetClientById(id));
        }
        [HttpGet("client/email/{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            return Ok(_service.GetClientByEmail(email));
        }
        [HttpGet("client/exists/{email}")]
        public async Task<IActionResult> ClientExists(string email)
        {
            return Ok(_service.isExists(email));
        }
    }
}
