using BeautySalonApi.Models;
using BeautySalonApi.Requests;

namespace BeautySalonApi.Services.ClientsService
{
    public interface IClientsService
    {
        public List<Clients> All();
        public Task CreateClient(CreateClient client);
        public Clients GetClientById(int id);
        public Clients GetClientByEmail(string email);
        public Clients GetClientByPhone(string phone);
        public bool isExists(string email);
        public  Task ConfirmEmail(Clients _client);
    }
}
