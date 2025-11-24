namespace InternAttendenceSystem.Models
{
    public class TaskResponseDto
    {
        public Guid TaskId { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public string Priority { get; set; } = string.Empty;
        public List<string>? Tags { get; set; }
        public List<InternInfoDto> AssignedInterns { get; set; } = new List<InternInfoDto>();

    }
}
