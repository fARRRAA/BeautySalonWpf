using BeautySalonApi.Models;

namespace BeautySalonApi.Services.ServicesService
{
    public interface IServicesService
    {
        public List<Models.Services> GetAll();
    }
}
