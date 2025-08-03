namespace Server.Models
{
    public class DrawingCommand
    {
        public int Id { get; set; }
        public int DrawingId { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        public string CommandJson { get; set; } = string.Empty;
    }
}
