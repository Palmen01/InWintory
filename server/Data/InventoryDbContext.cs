using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

        public DbSet<Item> Items { get; set; }
        // public DbSet<RestockOrder> RestockOrders { get; set; }
    }
}