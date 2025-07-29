using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class RedoDrawingCommand
    {
        [Key]
        public int Id { get; set; }
        public int DrawingId { get; set; }
        public string CommandJson { get; set; } = string.Empty;
    }
}
