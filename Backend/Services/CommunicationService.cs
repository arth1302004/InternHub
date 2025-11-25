using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;

namespace InternAttendenceSystem.Services
{
    public class CommunicationService : ICommunicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public CommunicationService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<MessageDto> SendMessageAsync(SendMessageDto sendDto, string senderId)
        {
            var message = new Message
            {
                MessageId = Guid.NewGuid(),
                SenderId = senderId,
                RecipientEmail = sendDto.RecipientEmail,
                RecipientPhone = sendDto.RecipientPhone,
                Subject = sendDto.Subject,
                Body = sendDto.Body,
                Type = sendDto.Type,
                Status = "Sent", // Assume success for now, or update after sending
                SentAt = DateTime.UtcNow
            };

            if (sendDto.Type == "Email")
            {
                try
                {
                    await _emailService.SendEmailAsync(sendDto.RecipientEmail, sendDto.Subject, sendDto.Body);
                }
                catch
                {
                    message.Status = "Failed";
                }
            }
            // SMS logic would go here

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return MapToMessageDto(message);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageHistoryAsync()
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            return messages.Select(MapToMessageDto);
        }

        public async Task<IEnumerable<TemplateDto>> GetAllTemplatesAsync()
        {
            var templates = await _context.MessageTemplates
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return templates.Select(MapToTemplateDto);
        }

        public async Task<TemplateDto> CreateTemplateAsync(CreateTemplateDto createDto)
        {
            var template = new MessageTemplate
            {
                TemplateId = Guid.NewGuid(),
                Name = createDto.Name,
                Subject = createDto.Subject,
                Body = createDto.Body,
                Type = createDto.Type,
                CreatedAt = DateTime.UtcNow
            };

            _context.MessageTemplates.Add(template);
            await _context.SaveChangesAsync();

            return MapToTemplateDto(template);
        }

        public async Task<TemplateDto> UpdateTemplateAsync(Guid id, UpdateTemplateDto updateDto)
        {
            var template = await _context.MessageTemplates.FindAsync(id);
            if (template == null) return null;

            if (updateDto.Name != null) template.Name = updateDto.Name;
            if (updateDto.Subject != null) template.Subject = updateDto.Subject;
            if (updateDto.Body != null) template.Body = updateDto.Body;
            if (updateDto.Type != null) template.Type = updateDto.Type;
            template.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToTemplateDto(template);
        }

        public async Task<bool> DeleteTemplateAsync(Guid id)
        {
            var template = await _context.MessageTemplates.FindAsync(id);
            if (template == null) return false;

            _context.MessageTemplates.Remove(template);
            await _context.SaveChangesAsync();
            return true;
        }

        private static MessageDto MapToMessageDto(Message message)
        {
            return new MessageDto
            {
                MessageId = message.MessageId,
                RecipientEmail = message.RecipientEmail,
                RecipientPhone = message.RecipientPhone,
                Subject = message.Subject,
                Body = message.Body,
                Type = message.Type,
                Status = message.Status,
                SentAt = message.SentAt
            };
        }

        private static TemplateDto MapToTemplateDto(MessageTemplate template)
        {
            return new TemplateDto
            {
                TemplateId = template.TemplateId,
                Name = template.Name,
                Subject = template.Subject,
                Body = template.Body,
                Type = template.Type,
                CreatedAt = template.CreatedAt,
                UpdatedAt = template.UpdatedAt
            };
        }
    }
}
