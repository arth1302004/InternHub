namespace InternAttendenceSystem.Models
{
    public class UpcomingDeadlineItemDto
    {
        public string TaskName { get; set; }
        public string InternName { get; set; }
        public DateTime DueDate { get; set; }
        public string Priority { get; set; }
    }
}
