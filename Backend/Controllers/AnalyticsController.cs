using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        /// <summary>
        /// Get overall analytics statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<AnalyticsStatsDto>> GetAnalyticsStats()
        {
            try
            {
                var stats = await _analyticsService.GetAnalyticsStats();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving analytics stats", error = ex.Message });
            }
        }

        /// <summary>
        /// Get performance trends over specified months
        /// </summary>
        [HttpGet("performance-trends")]
        public async Task<ActionResult<List<PerformanceDataDto>>> GetPerformanceTrends([FromQuery] int months = 6)
        {
            try
            {
                var trends = await _analyticsService.GetPerformanceTrends(months);
                return Ok(trends);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving performance trends", error = ex.Message });
            }
        }

        /// <summary>
        /// Get department distribution of active interns
        /// </summary>
        [HttpGet("department-distribution")]
        public async Task<ActionResult<List<DepartmentDistributionDto>>> GetDepartmentDistribution()
        {
            try
            {
                var distribution = await _analyticsService.GetDepartmentDistribution();
                return Ok(distribution);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving department distribution", error = ex.Message });
            }
        }

        /// <summary>
        /// Get task completion data over specified weeks
        /// </summary>
        [HttpGet("task-completion")]
        public async Task<ActionResult<List<TaskCompletionDataDto>>> GetTaskCompletionData([FromQuery] int weeks = 6)
        {
            try
            {
                var data = await _analyticsService.GetTaskCompletionData(weeks);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving task completion data", error = ex.Message });
            }
        }

        /// <summary>
        /// Get application trends over specified months
        /// </summary>
        [HttpGet("application-trends")]
        public async Task<ActionResult<List<ApplicationTrendDto>>> GetApplicationTrends([FromQuery] int months = 6)
        {
            try
            {
                var trends = await _analyticsService.GetApplicationTrends(months);
                return Ok(trends);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving application trends", error = ex.Message });
            }
        }
    }
}
