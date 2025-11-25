using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternAttendenceSystem.Models.Entities
{
    public class ProjectIntern
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ProjectId { get; set; }

        [Required]
        public Guid InternId { get; set; }

        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;

        [ForeignKey("InternId")]
        public Intern Intern { get; set; } = null!;
    }
}
