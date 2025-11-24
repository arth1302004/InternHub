using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternAttendenceSystem.Models.Entities
{
    public class Task
    {
        [Key]
        public Guid taskId { get; set; }

        public required string taskName { get; set; }

        public required string description { get; set; }

        public required string status { get; set; }

        public DateTime dueDate { get; set; }
        public DateTime lastModifiedDate { get; set; } = DateTime.UtcNow; // Added for recent activities

        public required string priority { get; set; }

        public double? performance { get; set; }

        public List<string>? tags { get; set; }

        // Many-to-many navigation property (remove the one-to-many properties)
        public ICollection<InternTask> InternTasks { get; set; } = new List<InternTask>();
    }
}