using BeautySalonApi.DataBase;
using BeautySalonApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BeautySalonApi.Services.CartService
{
    public class CartService : ICartService
    {
        private ContextDb _context;
        public CartService(ContextDb context)
        {
            _context = context;
        }

        public async Task ClearCart(int userId)
        {
            var cart = _context.Cart.Where(x => x.userId == userId).ToList();
            _context.Cart.RemoveRange(cart);
            await _context.SaveChangesAsync();
        }

        public async Task CreateCart(CartRequest cart)
        {
            var newCart = new Cart()
            {
                userId = cart.userId,
                productId = cart.productId,
                count = cart.count
            };
            await _context.Cart.AddAsync(newCart);
            await _context.SaveChangesAsync();
        }

        public async Task DecreaseProductCount(int userId, int productId)
        {
            var cart = _context.Cart.FirstOrDefault(x => x.userId == userId && x.productId == productId);

            cart.count -= 1;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteCart(int userId,int productId)
        {
            var cart = _context.Cart.FirstOrDefault(x => x.userId == userId && x.productId == productId);
            _context.Cart.Remove(cart);
            await _context.SaveChangesAsync();
        }

        public List<Cart> GetClientCart(int id)
        {
            return _context.Cart.Where(x => x.userId == id).Include(x => x.Product).Include(x => x.Product.TypeProducts).Include(x => x.Client).ToList();
        }

        public async Task IncreaseProductCount(int userId, int productId)
        {
            var cart = _context.Cart.FirstOrDefault(x => x.userId == userId && x.productId == productId);

            cart.count += 1;

            await _context.SaveChangesAsync();

        }
    }
}
