using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Mvc;

namespace InternAttendenceSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetAllTasks()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDetailResponseDto>> GetTaskById(Guid id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpGet("intern/{internId}")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasksByInternId(Guid internId)
        {
            var tasks = await _taskService.GetTasksByInternIdAsync(internId);
            return Ok(tasks);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasksByStatus(string status)
        {
            var tasks = await _taskService.GetTasksByStatusAsync(status);
            return Ok(tasks);
        }

        [HttpGet("priority/{priority}")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasksByPriority(string priority)
        {
            var tasks = await _taskService.GetTasksByPriorityAsync(priority);
            return Ok(tasks);
        }

        [HttpGet("overdue")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetOverdueTasks()
        {
            var tasks = await _taskService.GetOverdueTasksAsync();
            return Ok(tasks);
        }

                [HttpGet("{taskId}/interns")]
        public async Task<ActionResult<IEnumerable<InternInfoDto>>> GetInternsForTask(Guid taskId)
        {
            var interns = await _taskService.GetInternsForTaskAsync(taskId);
            return Ok(interns);
        }

        [HttpPatch("{taskId}/intern/{internId}/status")]
        public async Task<ActionResult<TaskResponseDto>> UpdateTaskStatus(Guid taskId, Guid internId, [FromBody] string newStatus)
        {
            try
            {
                var updatedTask = await _taskService.UpdateTaskStatusAsync(taskId, internId, newStatus);
                if (updatedTask == null)
                {
                    return NotFound(); // Task not found or intern not assigned
                }
                return Ok(updatedTask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<TaskResponseDto>> CreateTask(TaskDto taskDto)
        {
            try
            {
                var createdTask = await _taskService.CreateTaskAsync(taskDto);
                return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.TaskId }, createdTask);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskResponseDto>> UpdateTask(Guid id, TaskDto taskDto)
        {
            try
            {
                var updatedTask = await _taskService.UpdateTaskAsync(id, taskDto);
                if (updatedTask == null)
                {
                    return NotFound();
                }
                return Ok(updatedTask);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            try
            {
                var result = await _taskService.DeleteTaskAsync(id);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}