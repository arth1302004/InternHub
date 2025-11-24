using System;
using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class Evaluation
    {
        [Key]
        public int Id { get; set; }
        public string InternName { get; set; }
        public string Quarter { get; set; }
        public string Status { get; set; } // "Completed", "In Progress", "Scheduled"
        public string Evaluator { get; set; }
        public DateTime Date { get; set; }
        public double OverallRating { get; set; }
        public double TechnicalSkills { get; set; }
        public double Communication { get; set; }
        public double ProblemSolving { get; set; }
        public string InternInitials { get; set; }
    }
}
