using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Data;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeederController : ControllerBase
    {
        private readonly InventoryDbContext _context;
        private readonly ILogger<SeederController> _logger;

        public SeederController(InventoryDbContext context, ILogger<SeederController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("items")]
        public async Task<IActionResult> SeedItems([FromQuery] int count = 25, [FromQuery] bool force = false)
        {
            if (count <= 0 || count > 1000)
            {
                return BadRequest("Count must be between 1 and 1000");
            }

            if (force)
            {
                _context.Items.RemoveRange(_context.Items);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Cleared existing items from database");
            }

            // Check if Items already exist (unless force is used)
            if (!force && await _context.Items.AnyAsync())
            {
                return BadRequest("Items already exist in database. Use force=true to override.");
            }

            try
            {
                Random rnd = new Random();
                string[] Names =
                {
                    "Cucumber", "Melon", "Strawberry", "Kiwi", "Lime", "Coconut",
                    "Avocado", "Lychee", "Plum", "Grape", "Pear", "Apple",
                    "Banana", "Orange", "Mango", "Pineapple", "Watermelon", "Peach"
                };
                Names = Names.OrderBy(x => rnd.Next()).ToArray();
                var items = new List<Item>();

                for (int i = 0; i < Names.Length; i++)
                {
                    items.Add(new Item
                    {
                        Name = Names[i],
                        Quantity = rnd.Next(50, 100),
                        UnitsSold = 0,
                        UnitsLost = rnd.Next(0, 25),
                        ReorderThreshold = rnd.Next(5, 25), // Reorder threshold lower than quantity at seed.
                    });
                }

                await _context.Items.AddRangeAsync(items);
                var savedCount = await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully seeded {savedCount} items to database");

                return Ok(new
                {
                    Message = "Database seeded successfully",
                    ItemsCreated = savedCount,
                    ItemsRequested = count,
                    Timestamp = DateTime.UtcNow,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while seeding database");
                return StatusCode(500, new { Message = "Error occurred while seeding database", Error = ex.Message });
            }
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetSeedStatus()
        {
            var itemCount = await _context.Items.CountAsync();
            var totalQuantity = await _context.Items.SumAsync(i => i.Quantity);
            var totalSold = await _context.Items.SumAsync(i => i.UnitsSold);
            var totalLost = await _context.Items.SumAsync(i => i.UnitsLost);

            return Ok(new
            {
                ItemsInDatabase = itemCount,
                DatabaseSeeded = itemCount > 0,
                TotalQuantity = totalQuantity,
                TotalSold = totalSold,
                TotalLost = totalLost,
                Timestamp = DateTime.UtcNow
            });
        }

        [HttpDelete("items")]
        public async Task<IActionResult> ClearItems()
        {
            try
            {
                var itemCount = await _context.Items.CountAsync();
                _context.Items.RemoveRange(_context.Items);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Cleared {itemCount} items from database");

                return Ok(new
                {
                    Message = "All items cleared from database",
                    ItemsRemoved = itemCount,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while clearing database");
                return StatusCode(500, new { Message = "Error occurred while clearing database", Error = ex.Message });
            }
        }
    }
}

