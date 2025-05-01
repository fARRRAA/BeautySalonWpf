using BeautySalonApi.Models;
using BeautySalonApi.Services.OrdersService;
using Microsoft.AspNetCore.Mvc;

namespace BeautySalonApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private IOrderService _service;
        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserOrders(int id)
        {
            return Ok(_service.GetUserOrders(id));
        }
        [HttpPost("add")]
        public async Task<IActionResult> CreateOrder(OrderReq orderReq)
        {
            await _service.CreateOrder(orderReq);
            return Ok();
        }

    }
}
