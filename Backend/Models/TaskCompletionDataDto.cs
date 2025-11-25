namespace InternAttendenceSystem.Models
{
    public class TaskCompletionDataDto
    {
        public string Week { get; set; } = string.Empty;
        public int Completed { get; set; }
        public int Total { get; set; }
    }
}
