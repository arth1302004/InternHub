using InternAttendenceSystem.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternAttendenceSystem.Models
{
    public class TaskDto
    {
        public required string taskName { get; set; }
        public required string description { get; set; }
        public required string status { get; set; }
        public DateTime dueDate { get; set; }
        public required string priority { get; set; }
        public List<string>? tags { get; set; }

        // List of intern IDs for many-to-many relationship
        public List<Guid> InternIds { get; set; } = new List<Guid>();
    }
}