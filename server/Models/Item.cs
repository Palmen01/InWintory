namespace server.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public int Quantity { get; set; }
        public int UnitsSold { get; set; }
        public int UnitsLost { get; set; }
        public int ReorderThreshold { get; set; }

         // Nav prop
        public List<RestockOrder>? RestockOrders { get; set; }
    }
}