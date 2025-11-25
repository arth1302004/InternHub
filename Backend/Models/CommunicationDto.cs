namespace InternAttendenceSystem.Models
{
    public class SendMessageDto
    {
        public string RecipientEmail { get; set; } = string.Empty;
        public string? RecipientPhone { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Type { get; set; } = "Email";
    }

    public class MessageDto
    {
        public Guid MessageId { get; set; }
        public string RecipientEmail { get; set; } = string.Empty;
        public string? RecipientPhone { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }

    public class CreateTemplateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Type { get; set; } = "Email";
    }

    public class UpdateTemplateDto
    {
        public string? Name { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public string? Type { get; set; }
    }

    public class TemplateDto
    {
        public Guid TemplateId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
