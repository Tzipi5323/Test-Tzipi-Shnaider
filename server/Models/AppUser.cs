namespace Server.Models
{
    public class AppUser
    {
        public string Id { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.RegularExpression(
            @"^[a-zA-Z0-9]*$",
            ErrorMessage = "UserName must contain only letters and numbers."
        )]
        public string UserName { get; set; } = string.Empty;
    }
}
