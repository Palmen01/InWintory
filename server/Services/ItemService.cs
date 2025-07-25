namespace server.Services
{
    using server.DTOs;
    using server.Interfaces;

    public class ItemService : IItemService
    {
        private readonly IItemRepository _repository;

        public ItemService(IItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ItemDto>> GetAllItemsAsync()
        {
            return await _repository.GetAllItemsAsync();
        }

        public async Task<ItemDto?> GetItemByIdAsync(int id)
        {
            return await _repository.GetItemByIdAsync(id);
        }

        public async Task<ItemDto> CreateItemAsync(ItemDto itemDto)
        {
            // Add business logic here if needed (validation, etc.)
            return await _repository.CreateItemAsync(itemDto);
        }

        public async Task<ItemDto?> UpdateItemAsync(int id, ItemDto itemDto)
        {
            // Add business logic here if needed
            return await _repository.UpdateItemAsync(id, itemDto);
        }

        public async Task<bool> DeleteItemAsync(int id)
        {
            return await _repository.DeleteItemAsync(id);
        }

        public async Task<IEnumerable<ItemDto>> GetLowStockItemsAsync()
        {
            return await _repository.GetLowStockItemsAsync();
        }

        // Business logic methods
        public async Task<bool> SellItemAsync(int id, int quantity)
        {
            var item = await _repository.GetItemByIdAsync(id);
            if (item == null || item.Quantity < quantity)
                return false;

            item.Quantity -= quantity;
            item.UnitsSold += quantity;
            
            await _repository.UpdateItemAsync(id, item);
            return true;
        }

        public async Task<bool> RestockItemAsync(int id, int quantity)
        {
            var item = await _repository.GetItemByIdAsync(id);
            if (item == null) return false;

            item.Quantity += quantity;
            await _repository.UpdateItemAsync(id, item);
            return true;
        }
    }
}