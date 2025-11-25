namespace InternAttendenceSystem.Models
{
    public class PerformanceDataDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int Tasks { get; set; }
        public int Applications { get; set; }
    }
}
