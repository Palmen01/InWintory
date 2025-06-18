namespace server.Models
{
    public class RestockOrder
{
    public int Id { get; set; }
    public int ItemId { get; set; }           // Foreign key
    public Item Item { get; set; }            // Navigation to parent
    public int QuantityRequested { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; }
}
}

