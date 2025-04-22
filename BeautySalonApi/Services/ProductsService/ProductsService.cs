using BeautySalonApi.DataBase;
using BeautySalonApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BeautySalonApi.Services.ProductsService
{
    public class ProductsService : IProductsService
    {
        private ContextDb _context;
        public ProductsService(ContextDb context)
        {
            _context = context;
        }
        public List<Products> GetAll()
        {
            return _context.Products.Include(x=>x.TypeProducts).ToList();
        }

        public List<TypeProducts> GetTypes()
        {
            return _context.TypeProducts.Where(x=>x.typeId!=1).ToList();
        }
    }
}
