using BeautySalonApi.Models;

namespace BeautySalonApi.Services.ProductsService
{
    public interface IProductsService
    {
        public List<Products> GetAll();
        public List<TypeProducts> GetTypes();
    }
}
