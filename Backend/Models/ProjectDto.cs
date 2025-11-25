namespace InternAttendenceSystem.Models
{
    public class ProjectDto
    {
        public Guid ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Progress { get; set; }
        public decimal Budget { get; set; }
        public decimal Spent { get; set; }
        public string? TeamLead { get; set; }
        public string? Department { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<Guid> AssignedInternIds { get; set; } = new List<Guid>();
        public TaskStats Tasks { get; set; } = new TaskStats();
    }

    public class TaskStats
    {
        public int Total { get; set; }
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Pending { get; set; }
    }
}
