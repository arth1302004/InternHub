using InternAttendenceSystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IProjectService
    {
        Task<List<ProjectDto>> GetAllProjects();
        Task<ProjectDto?> GetProjectById(Guid id);
        Task<ProjectDto> CreateProject(CreateProjectDto createProjectDto);
        Task<ProjectDto?> UpdateProject(Guid id, UpdateProjectDto updateProjectDto);
        Task<bool> DeleteProject(Guid id);
        Task<bool> AssignInternToProject(Guid projectId, Guid internId);
        Task<bool> RemoveInternFromProject(Guid projectId, Guid internId);
        Task<ProjectStatsDto> GetProjectStats();
        Task<bool> UpdateProjectProgress(Guid id, int progress);
    }
}
