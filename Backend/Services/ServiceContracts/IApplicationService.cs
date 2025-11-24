using InternAttendenceSystem.Models;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IApplicationService
    {
        Task<ApplicationResponseDto> GetApplicationByIdAsync(Guid id);
        Task<IEnumerable<ApplicationResponseDto>> GetAllApplicationsAsync();
        Task<ApplicationResponseDto> CreateApplicationAsync(CreateApplicationDto createDto);
        Task<ApplicationResponseDto> UpdateApplicationAsync(Guid id, UpdateApplicationDto updateDto);
        Task<bool> DeleteApplicationAsync(Guid id);
        Task<ApplicationResponseDto> UpdateApplicationStatusAsync(Guid id, UpdateApplicationStatusDto statusDto);
    }
}
