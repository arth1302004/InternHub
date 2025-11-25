using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class Message
    {
        [Key]
        public Guid MessageId { get; set; }

        public string? SenderId { get; set; } // Could be Admin ID

        [Required]
        public string RecipientEmail { get; set; } = string.Empty;

        public string? RecipientPhone { get; set; }

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Body { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = "Email"; // Email, SMS

        public string Status { get; set; } = "Sent"; // Sent, Failed, Draft

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
