using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        /// <summary>
        /// Get all projects
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<ProjectDto>>> GetAllProjects()
        {
            try
            {
                var projects = await _projectService.GetAllProjects();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving projects", error = ex.Message });
            }
        }

        /// <summary>
        /// Get project by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProjectById(Guid id)
        {
            try
            {
                var project = await _projectService.GetProjectById(id);
                if (project == null)
                {
                    return NotFound(new { message = "Project not found" });
                }
                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving project", error = ex.Message });
            }
        }

        /// <summary>
        /// Get project statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<ProjectStatsDto>> GetProjectStats()
        {
            try
            {
                var stats = await _projectService.GetProjectStats();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving project statistics", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new project
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var project = await _projectService.CreateProject(createProjectDto);
                return CreatedAtAction(nameof(GetProjectById), new { id = project.ProjectId }, project);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating project", error = ex.Message });
            }
        }

        /// <summary>
        /// Update project
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ProjectDto>> UpdateProject(Guid id, [FromBody] UpdateProjectDto updateProjectDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var project = await _projectService.UpdateProject(id, updateProjectDto);
                if (project == null)
                {
                    return NotFound(new { message = "Project not found" });
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating project", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete project
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(Guid id)
        {
            try
            {
                var result = await _projectService.DeleteProject(id);
                if (!result)
                {
                    return NotFound(new { message = "Project not found" });
                }

                return Ok(new { message = "Project deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting project", error = ex.Message });
            }
        }

        /// <summary>
        /// Assign intern to project
        /// </summary>
        [HttpPost("{id}/interns/{internId}")]
        public async Task<ActionResult> AssignInternToProject(Guid id, Guid internId)
        {
            try
            {
                var result = await _projectService.AssignInternToProject(id, internId);
                if (!result)
                {
                    return BadRequest(new { message = "Failed to assign intern. Project or intern not found, or intern already assigned." });
                }

                return Ok(new { message = "Intern assigned successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error assigning intern", error = ex.Message });
            }
        }

        /// <summary>
        /// Remove intern from project
        /// </summary>
        [HttpDelete("{id}/interns/{internId}")]
        public async Task<ActionResult> RemoveInternFromProject(Guid id, Guid internId)
        {
            try
            {
                var result = await _projectService.RemoveInternFromProject(id, internId);
                if (!result)
                {
                    return NotFound(new { message = "Project-Intern assignment not found" });
                }

                return Ok(new { message = "Intern removed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error removing intern", error = ex.Message });
            }
        }

        /// <summary>
        /// Update project progress
        /// </summary>
        [HttpPatch("{id}/progress")]
        public async Task<ActionResult> UpdateProjectProgress(Guid id, [FromBody] int progress)
        {
            try
            {
                var result = await _projectService.UpdateProjectProgress(id, progress);
                if (!result)
                {
                    return NotFound(new { message = "Project not found" });
                }

                return Ok(new { message = "Project progress updated successfully", progress });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating progress", error = ex.Message });
            }
        }
    }
}
