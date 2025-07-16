using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly InventoryDbContext _context;
        private readonly ILogger<ItemsController> _logger;

        public ItemsController(InventoryDbContext context, ILogger<ItemsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _context.Items.ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var item = await _context.Items.FindAsync(id);
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetItemById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, Item updatedItem)
        {
            var existingItem = await _context.Items.FindAsync(id);

            existingItem.Name = updatedItem.Name;
            existingItem.Quantity = updatedItem.Quantity;
            existingItem.ReorderThreshold = updatedItem.ReorderThreshold;
            existingItem.Cost = updatedItem.Cost;

            await _context.SaveChangesAsync();
            return Ok(existingItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut("{id}/sell")]
        public async Task<IActionResult> SellItem(int id, [FromQuery] int quantity)
        {
            var item = await _context.Items.FindAsync(id);
            item.Quantity -= quantity;
            item.UnitsSold += quantity;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPatch("{id}/restock")]
        public async Task<IActionResult> RestockItem(int id, [FromQuery] int quantity)
        {
            var item = await _context.Items.FindAsync(id);
            item.Quantity += quantity;
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }
}
