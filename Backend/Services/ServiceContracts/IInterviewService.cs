using InternAttendenceSystem.Models;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IInterviewService
    {
        Task<IEnumerable<InterviewDto>> GetAllInterviewsAsync();
        Task<InterviewDto> GetInterviewByIdAsync(Guid id);
        Task<IEnumerable<InterviewDto>> GetInterviewsByApplicationIdAsync(Guid applicationId);
        Task<InterviewDto> CreateInterviewAsync(CreateInterviewDto createDto);
        Task<InterviewDto> UpdateInterviewAsync(Guid id, UpdateInterviewDto updateDto);
        Task<bool> DeleteInterviewAsync(Guid id);
    }
}
