using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class CreateProjectDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public required string Status { get; set; }

        [Required(ErrorMessage = "Priority is required")]
        public required string Priority { get; set; }

        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive number")]
        public decimal Budget { get; set; }

        public string? TeamLead { get; set; }

        public string? Department { get; set; }

        public List<string>? Tags { get; set; }
    }
}
