public class ItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int Quantity { get; set; }
    public int UnitsSold { get; set; }
    public int UnitsLost { get; set; }
    public int ReorderThreshold { get; set; }
    public decimal Cost { get; set; }
}