using BeautySalonApi.DataBase;
using BeautySalonApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BeautySalonApi.Services.OrdersService
{
    public class OrderService : IOrderService
    {
        private ContextDb _context;
        public OrderService(ContextDb context)
        {
            _context = context;
        }
        public async Task CreateOrder(OrderReq orderReq)
        {
            var discount = 0;
            var order = new Orders()
            {
                date = DateTime.Now,
                clientId = orderReq.clientId,
                sum = orderReq.sum,
                count = orderReq.count,
                statusId = 1,
                discount = 0,
                discountSum = orderReq.sum - (orderReq.sum * (discount / 100))
            };
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            foreach (var item in orderReq.items)
            {
                var orderProduct = new OrderProducts()
                {
                    orderId = order.id,
                    productId = item.productId,
                    count = item.count,
                };
                await _context.OrderProducts.AddAsync(orderProduct);
            }
            await _context.SaveChangesAsync();
        }

        public List<FullOrder> GetUserOrders(int userId)
        {
            List<FullOrder> fullOrders = new List<FullOrder>();
            List<Orders> orders = _context.Orders.Where(x => x.clientId == userId).Include(x => x.OrderStatus).ToList();
            foreach (var order in orders)
            {
                var orderProducts = _context.OrderProducts.Include(x => x.Products).Include(x => x.Products.TypeProducts).Where(x => x.orderId == order.id).ToList();
                var fullOrder = new FullOrder()
                {
                    order = order,
                    products = orderProducts
                };
                fullOrders.Add(fullOrder);
            }
            return fullOrders;
        }
    }
}
