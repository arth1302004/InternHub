using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class SendRegistrationEmailDto
    {
        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
    }
}
