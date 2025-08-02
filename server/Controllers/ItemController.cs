using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Interfaces;


namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;
        private readonly ILogger<ItemsController> _logger;

        public ItemsController(IItemService itemService, ILogger<ItemsController> logger)
        {
            _itemService = itemService;
            _logger = logger;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _itemService.GetAllItemsAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var item = await _itemService.GetItemByIdAsync(id);
            if (item == null)
            {
                return NotFound($"Item with ID {id} not found");
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem(ItemDto itemDto)
        {
            var createdItem = await _itemService.CreateItemAsync(itemDto);
            return CreatedAtAction(nameof(GetItemById), new { id = createdItem.Id }, createdItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, ItemDto itemDto)
        {
            var updatedItem = await _itemService.UpdateItemAsync(id, itemDto);
            if (updatedItem == null)
            {
                return NotFound($"Item with ID {id} not found");
            }
            return Ok(updatedItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var deleted = await _itemService.DeleteItemAsync(id);
            if (!deleted)
            {
                return NotFound($"Item with ID {id} not found");
            }
            return NoContent();
        }

        [HttpPut("{id}/sell")]
        public async Task<IActionResult> SellItem(int id, [FromQuery] int quantity)
        {
            if (quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0");
            }

            var success = await _itemService.SellItemAsync(id, quantity);
            if (!success)
            {
                return BadRequest("Unable to sell item. Item not found or insufficient quantity.");
            }

            var updatedItem = await _itemService.GetItemByIdAsync(id);
            return Ok(updatedItem);
        }

        [HttpPatch("{id}/restock")]
        public async Task<IActionResult> RestockItem(int id, [FromQuery] int quantity)
        {
            if (quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0");
            }

            var success = await _itemService.RestockItemAsync(id, quantity);
            if (!success)
            {
                return NotFound($"Item with ID {id} not found");
            }

            var updatedItem = await _itemService.GetItemByIdAsync(id);
            return Ok(updatedItem);
        }
    }
}