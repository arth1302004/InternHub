using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskResponseDto>> GetAllTasksAsync();
        Task<TaskDetailResponseDto?> GetTaskByIdAsync(Guid id);
        Task<IEnumerable<TaskResponseDto>> GetTasksByInternIdAsync(Guid internId);
        Task<TaskResponseDto> CreateTaskAsync(TaskDto taskDto);
        Task<TaskResponseDto?> UpdateTaskAsync(Guid id, TaskDto taskDto);
        Task<bool> DeleteTaskAsync(Guid id);
        Task<IEnumerable<TaskResponseDto>> GetTasksByStatusAsync(string status);
        Task<IEnumerable<TaskResponseDto>> GetTasksByPriorityAsync(string priority);
        Task<IEnumerable<TaskResponseDto>> GetOverdueTasksAsync();
        Task<IEnumerable<InternInfoDto>> GetInternsForTaskAsync(Guid taskId);
        Task<TaskResponseDto?> UpdateTaskStatusAsync(Guid taskId, Guid internId, string newStatus);
    }
}