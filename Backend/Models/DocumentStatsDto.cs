namespace InternAttendenceSystem.Models
{
    public class DocumentStatsDto
    {
        public int TotalDocuments { get; set; }
        public int SharedDocuments { get; set; }
        public int PublicDocuments { get; set; }
        public int RecentDocuments { get; set; }
        public long TotalStorageUsed { get; set; }
        public Dictionary<string, int> DocumentsByCategory { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> DocumentsByType { get; set; } = new Dictionary<string, int>();
    }
}
