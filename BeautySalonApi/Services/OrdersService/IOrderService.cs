using BeautySalonApi.Models;

namespace BeautySalonApi.Services.OrdersService
{
    public interface IOrderService
    {
        public Task CreateOrder(OrderReq orderReq);
        public List<FullOrder> GetUserOrders(int userId);
        //public Task CancelOrder(int orderId);
    }
}
