using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Data;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly InventoryDbContext _context;
        private readonly ILogger<SeedController> _logger;

        private static readonly string[] Names =
        {
            "Cucumber", "Melon", "Strawberry", "Kiwi", "Lime", "Coconut",
            "Avocado", "Lychee", "Plum", "Grape", "Pear", "Apple",
            "Banana", "Orange", "Mango", "Pineapple", "Watermelon", "Peach"
        };

        private static readonly Random rnd = new Random();

        public SeedController(InventoryDbContext context, ILogger<SeedController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("items")]
        public async Task<IActionResult> SeedItems([FromQuery] int count = 25, [FromQuery] bool force = false)
        {
            // Validate count parameter
            if (count <= 0 || count > 1000)
            {
                return BadRequest("Count must be between 1 and 1000");
            }

            try
            {
                // If force is true, clear existing data
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

                // Create all items in a single list - much more efficient
                var items = new List<Item>();

                for (int i = 0; i < count; i++)
                {
                    items.Add(new Item
                    {
                        Name = $"{Names[rnd.Next(Names.Length)]} #{i + 1}", // Add number to avoid duplicates
                        Quantity = rnd.Next(1, 100),
                        UnitsSold = rnd.Next(1, 100),
                        UnitsLost = rnd.Next(0, 25), // 0 makes more sense as minimum
                        ReorderThreshold = rnd.Next(5, 25), // Higher minimum threshold makes more sense
                    });
                }

                // Single database operation instead of multiple
                await _context.Items.AddRangeAsync(items);
                var savedCount = await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully seeded {savedCount} items to database");

                return Ok(new
                {
                    Message = "Database seeded successfully",
                    ItemsCreated = savedCount,
                    ItemsRequested = count,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while seeding database");
                return StatusCode(500, new { Message = "Error occurred while seeding database", Error = ex.Message });
            }
        }

        [HttpPost("items/realistic")]
        public async Task<IActionResult> SeedRealisticItems([FromQuery] int count = 25, [FromQuery] bool force = false)
        {
            if (count <= 0 || count > 1000)
            {
                return BadRequest("Count must be between 1 and 1000");
            }

            try
            {
                if (force)
                {
                    _context.Items.RemoveRange(_context.Items);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Cleared existing items from database");
                }

                if (!force && await _context.Items.AnyAsync())
                {
                    return BadRequest("Items already exist in database. Use force=true to override.");
                }

                var items = new List<Item>();

                for (int i = 0; i < count; i++)
                {
                    var quantity = rnd.Next(1, 100);
                    var unitsSold = rnd.Next(0, Math.Min(quantity, 50)); // Can't sell more than you have
                    var unitsLost = rnd.Next(0, Math.Min(quantity - unitsSold, 10)); // Can't lose more than remaining
                    var reorderThreshold = rnd.Next(5, 25);

                    items.Add(new Item
                    {
                        Name = $"{Names[rnd.Next(Names.Length)]} - Batch {i + 1}",
                        Quantity = quantity,
                        UnitsSold = unitsSold,
                        UnitsLost = unitsLost,
                        ReorderThreshold = reorderThreshold,
                    });
                }

                await _context.Items.AddRangeAsync(items);
                var savedCount = await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully seeded {savedCount} realistic items to database");

                return Ok(new
                {
                    Message = "Database seeded with realistic data successfully",
                    ItemsCreated = savedCount,
                    ItemsRequested = count,
                    Timestamp = DateTime.UtcNow
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

