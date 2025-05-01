using BeautySalonApi.Models;
using BeautySalonApi.Services.CartService;
using Microsoft.AspNetCore.Mvc;

namespace BeautySalonApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : Controller
    {
        private ICartService _service;
        public CartController(ICartService service)
        {
            _service = service;
        }

        [HttpGet("cart/{user}")]
        public async Task<IActionResult> GetClientCart(int user)
        {
            return Ok(_service.GetClientCart(user));
        }
        [HttpGet("cart/{userId}/product/{productId}/inc")]
        public async Task<IActionResult> IncreaseProductCount(int userId, int productId)
        {
            await _service.IncreaseProductCount(userId, productId);
            return Ok();
        }
        [HttpGet("cart/{userId}/product/{productId}/dec")]
        public async Task<IActionResult> DecreaseProductCount(int userId, int productId)
        {
            await _service.DecreaseProductCount(userId, productId);
            return Ok();
        }
        [HttpPost("cart/add")]
        public async Task<IActionResult> CreateCart(CartRequest cart)
        {
            await _service.CreateCart(cart);
            return Ok();
        }
        [HttpDelete("cart/{userId}/product/{productId}/del")]
        public async Task<IActionResult> CreateCart(int userId,int productId)
        {
            await _service.DeleteCart(userId,productId);
            return Ok();
        }
        [HttpDelete("cart/{id}/clear")]
        public async Task<IActionResult> ClearCart(int id)
        {
            await _service.ClearCart(id);
            return Ok();
        }

    }
}
