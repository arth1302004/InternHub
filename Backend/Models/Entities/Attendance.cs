using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class Attendance
    {
        [Required]
        public Guid AttendanceId { get; set; }   

        public DateTime Date {  get; set; }
        public DateTime clockInTime { get; set; } = DateTime.UtcNow; // Added for recent activities

        public required Guid InternId {  get; set; }

        public Intern intern { get; set; }
        public required  string status { get; set; }
    }
}
