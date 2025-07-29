using System.Collections.Generic;

namespace Server.Models
{
    public class Drawing
    {
        public int Id { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(
            50,
            MinimumLength = 2,
            ErrorMessage = "Name must be between 2 and 50 characters."
        )]
        public string Name { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        public string UserId { get; set; } = string.Empty;
        public List<DrawingCommand> Commands { get; set; } = new List<DrawingCommand>();
    }
}
