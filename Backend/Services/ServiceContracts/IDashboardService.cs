using InternAttendenceSystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStats();
        Task<int> GetActiveInternsCount();
        Task<int> GetPendingApplicationsCount();
        Task<int> GetCompletedTasksCount();
        Task<List<ActivityDto>> GetRecentActivities();
        Task<List<UpcomingDeadlineItemDto>> GetUpcomingDeadlines();
        Task<string> GetActiveInternsChange();
        Task<string> GetPendingApplicationsChange();
        Task<string> GetCompletedTasksChange();
        Task<string> GetAvgPerformanceChange();
    }
}
