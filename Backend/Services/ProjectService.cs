using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProjectDto>> GetAllProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.ProjectInterns)
                .ToListAsync();

            return projects.Select(p => MapToDto(p)).ToList();
        }

        public async Task<ProjectDto?> GetProjectById(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.ProjectInterns)
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            return project == null ? null : MapToDto(project);
        }

        public async Task<ProjectDto> CreateProject(CreateProjectDto createProjectDto)
        {
            var project = new Project
            {
                ProjectId = Guid.NewGuid(),
                Title = createProjectDto.Title,
                Description = createProjectDto.Description,
                Status = createProjectDto.Status,
                Priority = createProjectDto.Priority,
                StartDate = createProjectDto.StartDate,
                EndDate = createProjectDto.EndDate,
                Progress = 0,
                Budget = createProjectDto.Budget,
                Spent = 0,
                TeamLead = createProjectDto.TeamLead,
                Department = createProjectDto.Department,
                Tags = createProjectDto.Tags ?? new List<string>(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return MapToDto(project);
        }

        public async Task<ProjectDto?> UpdateProject(Guid id, UpdateProjectDto updateProjectDto)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return null;

            // Update only provided fields
            if (updateProjectDto.Title != null) project.Title = updateProjectDto.Title;
            if (updateProjectDto.Description != null) project.Description = updateProjectDto.Description;
            if (updateProjectDto.Status != null) project.Status = updateProjectDto.Status;
            if (updateProjectDto.Priority != null) project.Priority = updateProjectDto.Priority;
            if (updateProjectDto.StartDate.HasValue) project.StartDate = updateProjectDto.StartDate.Value;
            if (updateProjectDto.EndDate.HasValue) project.EndDate = updateProjectDto.EndDate.Value;
            if (updateProjectDto.Progress.HasValue) project.Progress = updateProjectDto.Progress.Value;
            if (updateProjectDto.Budget.HasValue) project.Budget = updateProjectDto.Budget.Value;
            if (updateProjectDto.Spent.HasValue) project.Spent = updateProjectDto.Spent.Value;
            if (updateProjectDto.TeamLead != null) project.TeamLead = updateProjectDto.TeamLead;
            if (updateProjectDto.Department != null) project.Department = updateProjectDto.Department;
            if (updateProjectDto.Tags != null) project.Tags = updateProjectDto.Tags;

            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetProjectById(id);
        }

        public async Task<bool> DeleteProject(Guid id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AssignInternToProject(Guid projectId, Guid internId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            var intern = await _context.intern.FindAsync(internId);

            if (project == null || intern == null) return false;

            // Check if already assigned
            var existing = await _context.ProjectInterns
                .FirstOrDefaultAsync(pi => pi.ProjectId == projectId && pi.InternId == internId);

            if (existing != null) return false; // Already assigned

            var projectIntern = new ProjectIntern
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                InternId = internId,
                AssignedDate = DateTime.UtcNow
            };

            _context.ProjectInterns.Add(projectIntern);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RemoveInternFromProject(Guid projectId, Guid internId)
        {
            var projectIntern = await _context.ProjectInterns
                .FirstOrDefaultAsync(pi => pi.ProjectId == projectId && pi.InternId == internId);

            if (projectIntern == null) return false;

            _context.ProjectInterns.Remove(projectIntern);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ProjectStatsDto> GetProjectStats()
        {
            var projects = await _context.Projects.ToListAsync();

            return new ProjectStatsDto
            {
                Total = projects.Count,
                Active = projects.Count(p => p.Status == "active"),
                Completed = projects.Count(p => p.Status == "completed"),
                OnHold = projects.Count(p => p.Status == "on-hold"),
                Planning = projects.Count(p => p.Status == "planning"),
                Cancelled = projects.Count(p => p.Status == "cancelled"),
                TotalBudget = projects.Sum(p => p.Budget),
                TotalSpent = projects.Sum(p => p.Spent)
            };
        }

        public async Task<bool> UpdateProjectProgress(Guid id, int progress)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            project.Progress = Math.Clamp(progress, 0, 100);
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        private ProjectDto MapToDto(Project project)
        {
            // Get task statistics for this project
            var projectTasks = _context.tasks
                .Include(t => t.InternTasks)
                .Where(t => t.InternTasks.Any(it => 
                    project.ProjectInterns.Select(pi => pi.InternId).Contains(it.internId)))
                .ToList();

            return new ProjectDto
            {
                ProjectId = project.ProjectId,
                Title = project.Title,
                Description = project.Description,
                Status = project.Status,
                Priority = project.Priority,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Progress = project.Progress,
                Budget = project.Budget,
                Spent = project.Spent,
                TeamLead = project.TeamLead,
                Department = project.Department,
                Tags = project.Tags ?? new List<string>(),
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt,
                AssignedInternIds = project.ProjectInterns.Select(pi => pi.InternId).ToList(),
                Tasks = new TaskStats
                {
                    Total = projectTasks.Count,
                    Completed = projectTasks.Count(t => t.status == "completed"),
                    InProgress = projectTasks.Count(t => t.status == "in-progress" || t.status == "in progress"),
                    Pending = projectTasks.Count(t => t.status == "pending" || t.status == "todo")
                }
            };
        }
    }
}
