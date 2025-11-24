namespace InternAttendenceSystem.Models
{
    public class EvaluationStatsDto
    {
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Scheduled { get; set; }
        public double AvgRating { get; set; }
    }
}
