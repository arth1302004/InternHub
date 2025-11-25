using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class UpdateDocumentDto
    {
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        public string? Category { get; set; }

        public List<string>? Tags { get; set; }

        public bool? IsPublic { get; set; }
    }
}
