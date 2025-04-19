using BeautySalonApi.Services.ClientsService;
using BeautySalonApi.Services.ProductsService;
using Microsoft.AspNetCore.Mvc;

namespace BeautySalonApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        public readonly IProductsService _service;
        public ProductsController(IProductsService service)
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
