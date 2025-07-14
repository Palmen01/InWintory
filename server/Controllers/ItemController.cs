using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Data;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ItemController : ControllerBase
    {
        private readonly InventoryDbContext _context;
        private readonly ILogger<ItemController> _logger;

        public ItemController(InventoryDbContext context, ILogger<ItemController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("All-Items")]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _context.Items.ToListAsync();
            return Ok(items);
        }

        // Sell quantity of an item for a cost
        [HttpPut("Sell-Item")]
        public async Task<IActionResult> SellItem(int id, int quantity)
        {
            var item = await _context.Items.FindAsync(id);
            item.Quantity -= quantity;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        // add more of an item to the Database
        [HttpPost("Order-Item")]
        public async Task<IActionResult> OrderItem(int id, int quantity)
        {
            var item = await _context.Items.FindAsync(id);
            item.Quantity += quantity;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        // Add new items to the database
        [HttpPost("Add-Item")]
        public async Task<IActionResult> AddItem(Item item)
        {
            var newItem = new Item()
            {
                Id = item.Id,
                Name = item.Name,
                Quantity = item.Quantity,
                UnitsSold = item.UnitsSold,
                UnitsLost = item.UnitsLost,
                ReorderThreshold = item.ReorderThreshold,
                Cost = item.Cost
            };
            _context.Items.Add(newItem);
            await _context.SaveChangesAsync();
            return Ok(newItem);
        }

        // Delete an item from the database
        [HttpDelete("Delete-Item")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpPut("Edit-Item/{id}")]
        public async Task<IActionResult> EditItem(int id, Item updatedItem)
        {
            var existingItem = await _context.Items.FindAsync(id);
            
            // Update the properties
            existingItem.Name = updatedItem.Name;
            existingItem.Quantity = updatedItem.Quantity;
            existingItem.ReorderThreshold = updatedItem.ReorderThreshold;
            existingItem.Cost = updatedItem.Cost;

            await _context.SaveChangesAsync();
            return Ok(existingItem);
        }
    }
}