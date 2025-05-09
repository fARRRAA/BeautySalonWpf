
using BeautySalonApi.DataBase;
using BeautySalonApi.Services.AppointmentsService;
using BeautySalonApi.Services.CartService;
using BeautySalonApi.Services.ClientsService;
using BeautySalonApi.Services.MastersService;
using BeautySalonApi.Services.OrdersService;
using BeautySalonApi.Services.ProductsService;
using BeautySalonApi.Services.ServicesService;
using Microsoft.EntityFrameworkCore;

namespace BeautySalonApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<ContextDb>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TestDbString")), ServiceLifetime.Scoped);
            builder.Services.AddScoped<IClientsService, ClientService>();
            builder.Services.AddScoped<IProductsService,ProductsService>();
            builder.Services.AddScoped<IMastersService, MastersService>();
            builder.Services.AddScoped<IServicesService, ServicesService>();
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();
            builder.Services.AddScoped<ICartService, CartService>();
            builder.Services.AddScoped<IOrderService,OrderService>();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseCors("AllowAll");

            app.MapControllers();

            app.Run();
        }
    }
}
