namespace server.Interfaces
{
    using server.DTOs;

    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetAllItemsAsync();
        Task<ItemDto?> GetItemByIdAsync(int id);
        Task<ItemDto> CreateItemAsync(ItemDto itemDto);
        Task<ItemDto?> UpdateItemAsync(int id, ItemDto itemDto);
        Task<bool> DeleteItemAsync(int id);
        Task<bool> SellItemAsync(int id, int quantity);
        Task<bool> RestockItemAsync(int id, int quantity);
        Task<IEnumerable<ItemDto>> GetLowStockItemsAsync();
    }
}