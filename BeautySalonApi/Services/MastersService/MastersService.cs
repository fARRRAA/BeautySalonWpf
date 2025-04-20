using BeautySalonApi.DataBase;
using BeautySalonApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BeautySalonApi.Services.MastersService
{
    public class MastersService : IMastersService
    {
        private ContextDb _context;
        public MastersService(ContextDb context)
        {
            _context = context;
        }
        public List<MastersFull> GetAll()
        {
            var masters= _context.Masters.Include(X=>X.MastersSkills).Include(x=>x.MastersQualifications).ToList();
            var MastersFull=new List<MastersFull>();
            var typeServices = _context.TypeServices.ToList();
            foreach (Masters master in masters)
            {
                var typeService= typeServices.FirstOrDefault(x=>x.id==master.MastersQualifications.typeServiceId);
                MastersFull.Add(new MastersFull() { master=master,typeServices=typeService});
            }
            return MastersFull;
        }
    }
}
