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

        [HttpGet("Items")]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _context.Items.ToListAsync();
            return Ok(items);
        }
    }
}