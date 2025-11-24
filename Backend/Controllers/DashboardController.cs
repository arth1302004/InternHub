using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _dashboardService.GetDashboardStats();
            return Ok(stats);
        }

        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivities()
        {
            var activities = await _dashboardService.GetRecentActivities();
            return Ok(activities);
        }

        [HttpGet("upcoming-deadlines")]
        public async Task<IActionResult> GetUpcomingDeadlines()
        {
            var deadlines = await _dashboardService.GetUpcomingDeadlines();
            return Ok(deadlines);
        }
    }
}
