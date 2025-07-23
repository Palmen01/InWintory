namespace server.Interfaces
{
    using server.Models;
    using server.DTOs;

    public interface IItemRepository
    {
        Task<IEnumerable<ItemDto>> GetAllItemsAsync();
        Task<ItemDto?> GetItemByIdAsync(int id);
        Task<ItemDto> CreateItemAsync(ItemDto itemDto);
        Task<ItemDto?> UpdateItemAsync(int id, ItemDto itemDto);
        Task<bool> DeleteItemAsync(int id);
        Task<bool> ItemExistsAsync(int id);
        Task<IEnumerable<ItemDto>> GetLowStockItemsAsync(); // Items below reorder threshold
    }
}