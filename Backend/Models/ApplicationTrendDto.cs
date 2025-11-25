namespace InternAttendenceSystem.Models
{
    public class ApplicationTrendDto
    {
        public string Month { get; set; } = string.Empty;
        public int Applications { get; set; }
        public int Accepted { get; set; }
        public int Rejected { get; set; }
        public int Pending { get; set; }
    }
}
