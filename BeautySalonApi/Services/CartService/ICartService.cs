using BeautySalonApi.Models;

namespace BeautySalonApi.Services.CartService
{
    public interface ICartService
    {
        public List<Cart> GetClientCart(int id);
        public Task IncreaseProductCount(int userId, int productId);
        public Task DecreaseProductCount(int userId, int productId);
        public Task CreateCart(CartRequest cart);
        public Task DeleteCart(int cartId);
    }
}
