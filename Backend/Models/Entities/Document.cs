using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternAttendenceSystem.Models.Entities
{
    public class Document
    {
        [Key]
        public Guid DocumentId { get; set; }

        [Required]
        public required string FileName { get; set; }

        [Required]
        public required string StoredFileName { get; set; }

        public long FileSize { get; set; }

        [Required]
        public required string FileType { get; set; }

        [Required]
        public required string Category { get; set; }

        public string? Description { get; set; }

        [Required]
        public Guid UploadedBy { get; set; }

        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;

        public int Version { get; set; } = 1;

        public Guid? ParentDocumentId { get; set; }

        public bool IsLatestVersion { get; set; } = true;

        public List<string>? Tags { get; set; }

        public List<Guid>? SharedWith { get; set; }

        public bool IsPublic { get; set; } = false;

        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
    }
}
