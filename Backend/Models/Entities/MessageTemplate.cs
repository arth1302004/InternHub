using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class MessageTemplate
    {
        [Key]
        public Guid TemplateId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Body { get; set; } = string.Empty;

        public string Type { get; set; } = "Email"; // Email, SMS

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
