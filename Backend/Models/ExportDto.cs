namespace InternAttendenceSystem.Models
{
    public class AttendanceExportDto
    {
        public DateTime Date { get; set; }
        public string InternName { get; set; }
        public string Status { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public double? HoursWorked { get; set; }
    }

    public class EvaluationExportDto
    {
        public string InternName { get; set; }
        public string EvaluatorName { get; set; }
        public int Score { get; set; }
        public string Comments { get; set; }
        public DateTime EvaluationDate { get; set; }
    }
}
