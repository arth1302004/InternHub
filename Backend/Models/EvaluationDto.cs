namespace InternAttendenceSystem.Models
{
    public class EvaluationDto
    {
        public string InternName { get; set; }
        public string Quarter { get; set; }
        public string Status { get; set; }
        public string Evaluator { get; set; }
        public string Date { get; set; }
        public double OverallRating { get; set; }
        public PerformanceAreasDto PerformanceAreas { get; set; }
        public string InternInitials { get; set; }
    }

    public class PerformanceAreasDto
    {
        public double TechnicalSkills { get; set; }
        public double Communication { get; set; }
        public double ProblemSolving { get; set; }
    }
}
