namespace InternAttendenceSystem.Models
{
    public class DocumentDto
    {
        public Guid DocumentId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid UploadedBy { get; set; }
        public string UploadedByName { get; set; } = string.Empty;
        public DateTime UploadedDate { get; set; }
        public int Version { get; set; }
        public Guid? ParentDocumentId { get; set; }
        public bool IsLatestVersion { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public List<Guid> SharedWith { get; set; } = new List<Guid>();
        public bool IsPublic { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public string DownloadUrl { get; set; } = string.Empty;
    }
}
