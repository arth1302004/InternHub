namespace InternAttendenceSystem.Models
{
    public class AttendanceRecordDto
    {
        public Guid AttendanceId { get; set; }
        public Guid InternId { get; set; }
        public string InternName { get; set; }
        public string InternProfileImageUrl { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }
}
