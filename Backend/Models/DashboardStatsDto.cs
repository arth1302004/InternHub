
namespace InternAttendenceSystem.Models
{
    public class DashboardStatsDto
    {
        public int ActiveInterns { get; set; }
        public string ActiveInternsChange { get; set; }
        public int PendingApplications { get; set; }
        public string PendingApplicationsChange { get; set; }
        public int CompletedTasks { get; set; }
        public string CompletedTasksChange { get; set; }
        public double AveragePerformance { get; set; }
        public string AveragePerformanceChange { get; set; }
    }
}
