namespace InternAttendenceSystem.Models
{
    public class TaskDetailResponseDto : TaskResponseDto
    {
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
