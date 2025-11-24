namespace InternAttendenceSystem.Models
{
    public class InternInfoDto
    {
        public Guid InternId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public DateTime AssignedDate { get; set; }
        public string AssignmentStatus { get; set; } = string.Empty;
    }
}
