using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.DTOs;
using server.Interfaces;

namespace server.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly InventoryDbContext _context;

        public ItemRepository(InventoryDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ItemDto>> GetAllItemsAsync()
        {
            return await _context.Items
                .Select(item => new ItemDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Quantity = item.Quantity,
                    UnitsSold = item.UnitsSold,
                    UnitsLost = item.UnitsLost,
                    ReorderThreshold = item.ReorderThreshold,
                    Cost = item.Cost
                })
                .ToListAsync();
        }

        public async Task<ItemDto?> GetItemByIdAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return null;

            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Quantity = item.Quantity,
                UnitsSold = item.UnitsSold,
                UnitsLost = item.UnitsLost,
                ReorderThreshold = item.ReorderThreshold,
                Cost = item.Cost
            };
        }

        public async Task<ItemDto> CreateItemAsync(ItemDto itemDto)
        {
            var item = new Item
            {
                Name = itemDto.Name,
                Quantity = itemDto.Quantity,
                UnitsSold = itemDto.UnitsSold,
                UnitsLost = itemDto.UnitsLost,
                ReorderThreshold = itemDto.ReorderThreshold,
                Cost = itemDto.Cost
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Quantity = item.Quantity,
                UnitsSold = item.UnitsSold,
                UnitsLost = item.UnitsLost,
                ReorderThreshold = item.ReorderThreshold,
                Cost = item.Cost
            };
        }

        public async Task<ItemDto?> UpdateItemAsync(int id, ItemDto itemDto)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return null;

            item.Name = itemDto.Name;
            item.Quantity = itemDto.Quantity;
            item.UnitsSold = itemDto.UnitsSold;
            item.UnitsLost = itemDto.UnitsLost;
            item.ReorderThreshold = itemDto.ReorderThreshold;
            item.Cost = itemDto.Cost;

            await _context.SaveChangesAsync();

            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Quantity = item.Quantity,
                UnitsSold = item.UnitsSold,
                UnitsLost = item.UnitsLost,
                ReorderThreshold = item.ReorderThreshold,
                Cost = item.Cost
            };
        }

        public async Task<bool> DeleteItemAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return false;

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ItemExistsAsync(int id)
        {
            return await _context.Items.AnyAsync(i => i.Id == id);
        }

        public async Task<IEnumerable<ItemDto>> GetLowStockItemsAsync()
        {
            return await _context.Items
                .Where(item => item.Quantity <= item.ReorderThreshold)
                .Select(item => new ItemDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Quantity = item.Quantity,
                    UnitsSold = item.UnitsSold,
                    UnitsLost = item.UnitsLost,
                    ReorderThreshold = item.ReorderThreshold,
                    Cost = item.Cost
                })
                .ToListAsync();
        }
    }
}

