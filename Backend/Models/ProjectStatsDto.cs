namespace InternAttendenceSystem.Models
{
    public class ProjectStatsDto
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int Completed { get; set; }
        public int OnHold { get; set; }
        public int Planning { get; set; }
        public int Cancelled { get; set; }
        public decimal TotalBudget { get; set; }
        public decimal TotalSpent { get; set; }
    }
}
