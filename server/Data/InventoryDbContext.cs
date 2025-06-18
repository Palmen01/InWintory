using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

        public DbSet<Item> Items { get; set; }
        public DbSet<RestockOrder> RestockOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
{
        modelBuilder.Entity<RestockOrder>()
            .HasOne(r => r.Item)
            .WithMany(i => i.RestockOrders)
            .HasForeignKey(r => r.ItemId);
        }
    }
}