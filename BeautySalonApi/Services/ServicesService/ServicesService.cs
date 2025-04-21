
using BeautySalonApi.DataBase;
using BeautySalonApi.Models;
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
        public List<ServicesGroup> GetAll()
        {
            var typeServices = _context.TypeServices.Where(x=>x.id==1|| x.id == 2||x.id == 3 || x.id == 6 || x.id == 7).ToList();
            var services=_context.Services.Include(x=>x.TypeServices).ToList();
            var group =new List<ServicesGroup>();
            foreach (var typeService in typeServices) {
                group.Add(new ServicesGroup() { id=typeService.id, name=typeService.name,Services=services.Where(x=> x.typeServiceId==typeService.id).ToList() });
            }

            return group;
        }
    }
}
