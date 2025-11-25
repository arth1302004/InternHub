using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class UploadDocumentDto
    {
        [Required(ErrorMessage = "Category is required")]
        public required string Category { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        public List<string>? Tags { get; set; }

        public bool IsPublic { get; set; } = false;
    }
}
