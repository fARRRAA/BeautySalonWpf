using BeautySalonApi.Models;
using Microsoft.EntityFrameworkCore;
namespace BeautySalonApi.DataBase
{
    public class ContextDb : DbContext
    {
        public ContextDb(DbContextOptions options) : base(options)
        {

        }
        public DbSet<OrderProducts> OrderProducts { get; set; }
        public DbSet<OrderStatus> OrderStatus { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<TypeProducts> TypeProducts { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<Models.Services> Services { get; set; }
        public DbSet<TypeServices> TypeServices { get; set; }
        public DbSet<MastersSkills> MastersSkills { get; set; }
        public DbSet<MastersQualifications> MastersQualifications { get; set; }
        public DbSet<Masters> Masters { get; set; }
        public DbSet<AppointmentsServices> AppointmentsServices { get; set; }
        public DbSet<AppointmentStatus> AppointmentStatus { get; set; }
        public DbSet<Appointments> Appointments { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Clients> Clients { get; set; }

    }
}
