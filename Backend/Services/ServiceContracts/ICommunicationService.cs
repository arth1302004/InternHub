using InternAttendenceSystem.Models;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface ICommunicationService
    {
        Task<MessageDto> SendMessageAsync(SendMessageDto sendDto, string senderId);
        Task<IEnumerable<MessageDto>> GetMessageHistoryAsync();
        Task<IEnumerable<TemplateDto>> GetAllTemplatesAsync();
        Task<TemplateDto> CreateTemplateAsync(CreateTemplateDto createDto);
        Task<TemplateDto> UpdateTemplateAsync(Guid id, UpdateTemplateDto updateDto);
        Task<bool> DeleteTemplateAsync(Guid id);
    }
}
