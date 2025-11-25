using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternAttendenceSystem.Models.Entities
{
    public class Project
    {
        [Key]
        public Guid ProjectId { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string Status { get; set; } // planning, active, on-hold, completed, cancelled

        [Required]
        public required string Priority { get; set; } // low, medium, high, critical

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int Progress { get; set; } // 0-100

        [Column(TypeName = "decimal(18,2)")]
        public decimal Budget { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Spent { get; set; }

        public string? TeamLead { get; set; }

        public string? Department { get; set; }

        public List<string>? Tags { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Many-to-many navigation property
        public ICollection<ProjectIntern> ProjectInterns { get; set; } = new List<ProjectIntern>();
    }
}
