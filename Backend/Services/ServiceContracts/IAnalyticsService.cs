using InternAttendenceSystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IAnalyticsService
    {
        Task<AnalyticsStatsDto> GetAnalyticsStats();
        Task<List<PerformanceDataDto>> GetPerformanceTrends(int months = 6);
        Task<List<DepartmentDistributionDto>> GetDepartmentDistribution();
        Task<List<TaskCompletionDataDto>> GetTaskCompletionData(int weeks = 6);
        Task<List<ApplicationTrendDto>> GetApplicationTrends(int months = 6);
    }
}
