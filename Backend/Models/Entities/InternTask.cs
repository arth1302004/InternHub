using System.ComponentModel.DataAnnotations.Schema;

namespace InternAttendenceSystem.Models.Entities
{
    public class InternTask
    {
        [ForeignKey("Intern")]
        public Guid internId { get; set; }

        [ForeignKey("Task")]
        public Guid taskId { get; set; }

        // Navigation properties
        public Intern Intern { get; set; } = null!;
        public Task Task { get; set; } = null!;

        // Additional properties for the join table
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        public string AssignmentStatus { get; set; } = "Assigned";
    }
}
