namespace InternAttendenceSystem.Models
{
    public class InternCreateDto
    {
        public string name { get; set; }
        public string emailAddress { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public string ImageUrl { get; set; }

        public string? confirmPassword { get; set; }
    }
}
