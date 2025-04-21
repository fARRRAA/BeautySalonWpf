
using BeautySalonApi.DataBase;
using Microsoft.EntityFrameworkCore;

namespace BeautySalonApi.Services.ServicesService
{
    public class ServicesService : IServicesService
    {
        private ContextDb _context;
        public ServicesService(ContextDb context)
        {
            _context = context;
        }
        public List<Models.Services> GetAll()
        {
            return _context.Services.Include(x=>x.TypeServices).ToList();
        }
    }
}
