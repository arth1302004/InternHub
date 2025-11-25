namespace InternAttendenceSystem.Models
{
    public class AnalyticsStatsDto
    {
        public int ActiveInterns { get; set; }
        public decimal ActiveInternsChange { get; set; }
        public decimal AveragePerformance { get; set; }
        public decimal AveragePerformanceChange { get; set; }
        public decimal TaskCompletionRate { get; set; }
        public decimal TaskCompletionRateChange { get; set; }
        public int TotalApplications { get; set; }
        public decimal ApplicationsChange { get; set; }
    }
}
