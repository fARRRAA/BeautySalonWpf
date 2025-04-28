using BeautySalonApi.Models;

namespace BeautySalonApi.Services.MastersService
{
    public interface IMastersService
    {
        public List<MastersFull> GetAll();
        public Masters GetMaster(int id);
    }
}
