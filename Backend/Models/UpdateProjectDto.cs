using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class UpdateProjectDto
    {
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string? Title { get; set; }

        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }

        public string? Status { get; set; }

        public string? Priority { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Range(0, 100, ErrorMessage = "Progress must be between 0 and 100")]
        public int? Progress { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive number")]
        public decimal? Budget { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Spent must be a positive number")]
        public decimal? Spent { get; set; }

        public string? TeamLead { get; set; }

        public string? Department { get; set; }

        public List<string>? Tags { get; set; }
    }
}
