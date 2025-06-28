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
            return Ok();
        }

        // Add more items to the Database for a cost
        [HttpPost("Order-Item")]
        public async Task<IActionResult> OrderItem(int id, int quantity)
        {
            var item = await _context.Items.FindAsync(id);
            item.Quantity += quantity;
            await _context.SaveChangesAsync();
            return Ok(item);
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
    }
}