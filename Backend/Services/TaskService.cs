using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;
using Task = InternAttendenceSystem.Models.Entities.Task;

namespace InternAttendenceSystem.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;
        private readonly IInternService _internService;

        public TaskService(ApplicationDbContext context, IInternService internService)
        {
            _context = context;
            _internService = internService;
        }

        public async Task<IEnumerable<TaskResponseDto>> GetAllTasksAsync()
        {
            var tasks = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern)
                .ToListAsync();

            return tasks.Select(t => MapToTaskResponseDto(t));
        }

        public async Task<TaskDetailResponseDto?> GetTaskByIdAsync(Guid id)
        {
            var task = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern)
                .FirstOrDefaultAsync(t => t.taskId == id);

            if (task == null) return null;

            return MapToTaskDetailResponseDto(task);
        }

        public async Task<IEnumerable<TaskResponseDto>> GetTasksByInternIdAsync(Guid internId)
        {
            var tasks = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern)
                .Where(t => t.InternTasks.Any(it => it.internId == internId))
                .ToListAsync();

            return tasks.Select(t => MapToTaskResponseDto(t));
        }

        public async Task<TaskResponseDto> CreateTaskAsync(TaskDto taskDto)
        {
            var task = new Task
            {
                taskId = Guid.NewGuid(),
                taskName = taskDto.taskName,
                description = taskDto.description,
                status = taskDto.status,
                dueDate = taskDto.dueDate,
                priority = taskDto.priority,
                tags = taskDto.tags,
                InternTasks = new List<InternTask>()
            };

            // Add interns to the task through join entity
            foreach (var internId in taskDto.InternIds)
            {
                var intern = await _internService.GetInternById(internId);
                if (intern == null)
                {
                    throw new ArgumentException($"Intern with ID {internId} not found");
                }

                task.InternTasks.Add(new InternTask
                {
                    internId = internId,
                    taskId = task.taskId,
                    AssignedDate = DateTime.UtcNow,
                    AssignmentStatus = "Assigned"
                });
            }

            _context.tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToTaskResponseDto(task);
        }

        public async Task<TaskResponseDto?> UpdateTaskAsync(Guid id, TaskDto taskDto)
        {
            var existingTask = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern)
                .FirstOrDefaultAsync(t => t.taskId == id);

            if (existingTask == null)
            {
                return null;
            }

            // Update basic properties
            existingTask.taskName = taskDto.taskName;
            existingTask.description = taskDto.description;
            existingTask.status = taskDto.status;
            existingTask.dueDate = taskDto.dueDate;
            existingTask.priority = taskDto.priority;
            existingTask.tags = taskDto.tags;

            // Update many-to-many relationship
            var currentInternIds = existingTask.InternTasks.Select(it => it.internId).ToList();
            var newInternIds = taskDto.InternIds;

            // Remove interns that are no longer assigned
            var internsToRemove = existingTask.InternTasks
                .Where(it => !newInternIds.Contains(it.internId))
                .ToList();

            foreach (var internTask in internsToRemove)
            {
                existingTask.InternTasks.Remove(internTask);
                _context.InternTasks.Remove(internTask);
            }

            // Add new interns
            foreach (var internId in newInternIds.Where(id => !currentInternIds.Contains(id)))
            {
                var intern = await _internService.GetInternById(internId);
                if (intern == null)
                {
                    throw new ArgumentException($"Intern with ID {internId} not found");
                }

                existingTask.InternTasks.Add(new InternTask
                {
                    internId = internId,
                    taskId = existingTask.taskId,
                    AssignedDate = DateTime.UtcNow,
                    AssignmentStatus = "Assigned"
                });
            }

            _context.tasks.Update(existingTask);
            await _context.SaveChangesAsync();

            return MapToTaskResponseDto(existingTask);
        }

        public async Task<bool> DeleteTaskAsync(Guid id)
        {
            var task = await _context.tasks
                .Include(t => t.InternTasks)
                .FirstOrDefaultAsync(t => t.taskId == id);

            if (task == null)
            {
                return false;
            }

            // Remove all join entities first
            _context.InternTasks.RemoveRange(task.InternTasks);
            _context.tasks.Remove(task);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TaskResponseDto>> GetTasksByStatusAsync(string status)
        {
            var tasks = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern)
                .Where(t => t.status == status)
                .ToListAsync();

            return tasks.Select(t => MapToTaskResponseDto(t));
        }

        public async Task<IEnumerable<TaskResponseDto>> GetTasksByPriorityAsync(string priority)
        {
            var tasks = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern)
                .Where(t => t.priority == priority)
                .ToListAsync();

            return tasks.Select(t => MapToTaskResponseDto(t));
        }

        public async Task<IEnumerable<TaskResponseDto>> GetOverdueTasksAsync()
        {
            var tasks = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern)
                .Where(t => t.dueDate < DateTime.UtcNow && t.status != "Completed")
                .ToListAsync();

            return tasks.Select(t => MapToTaskResponseDto(t));
        }

        public async Task<IEnumerable<InternInfoDto>> GetInternsForTaskAsync(Guid taskId)
        {
            var internTasks = await _context.InternTasks
                .Where(it => it.taskId == taskId)
                .Include(it => it.Intern)
                .ToListAsync();

            return internTasks.Select(it => new InternInfoDto
            {
                InternId = it.Intern.internId,
                Name = it.Intern.name,
                Email = it.Intern.emailAddress,
                ProfileImageUrl = it.Intern.ProfileImageUrl,
                AssignedDate = it.AssignedDate,
                AssignmentStatus = it.AssignmentStatus
            });
        }

        public async Task<TaskResponseDto?> UpdateTaskStatusAsync(Guid taskId, Guid internId, string newStatus)
        {
            var existingTask = await _context.tasks
                .Include(t => t.InternTasks)
                .ThenInclude(it => it.Intern) // Add this line
                .FirstOrDefaultAsync(t => t.taskId == taskId);

            if (existingTask == null)
            {
                return null; // Task not found
            }

            // Verify if the intern is assigned to this task
            var isInternAssigned = existingTask.InternTasks.Any(it => it.internId == internId);
            if (!isInternAssigned)
            {
                return null; // Intern not assigned to this task
            }

            // Update status and last modified date
            existingTask.status = newStatus;
            existingTask.lastModifiedDate = DateTime.UtcNow;

            _context.tasks.Update(existingTask);
            await _context.SaveChangesAsync();

            return MapToTaskResponseDto(existingTask);
        }

        // Helper methods for mapping
        private TaskResponseDto MapToTaskResponseDto(Task task)
        {
            return new TaskResponseDto
            {
                TaskId = task.taskId,
                TaskName = task.taskName,
                Description = task.description,
                Status = task.status,
                DueDate = task.dueDate,
                Priority = task.priority,
                Tags = task.tags,
                AssignedInterns = task.InternTasks.Select(it => new InternInfoDto
                {
                    InternId = it.Intern.internId,
                    Name = it.Intern.name,
                    Email = it.Intern.emailAddress,
                    ProfileImageUrl = it.Intern.ProfileImageUrl,
                    AssignedDate = it.AssignedDate,
                    AssignmentStatus = it.AssignmentStatus
                }).ToList()
            };
        }

        private TaskDetailResponseDto MapToTaskDetailResponseDto(Task task)
        {
            return new TaskDetailResponseDto
            {
                TaskId = task.taskId,
                TaskName = task.taskName,
                Description = task.description,
                Status = task.status,
                DueDate = task.dueDate,
                Priority = task.priority,
                Tags = task.tags,
                AssignedInterns = task.InternTasks.Select(it => new InternInfoDto
                {
                    InternId = it.Intern.internId,
                    Name = it.Intern.name,
                    Email = it.Intern.emailAddress,
                    ProfileImageUrl = it.Intern.ProfileImageUrl,
                    AssignedDate = it.AssignedDate,
                    AssignmentStatus = it.AssignmentStatus
                }).ToList()
            };
        }
    }
}