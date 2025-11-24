using InternAttendenceSystem.Models.Entities;

namespace InternAttendenceSystem.Models
{
    public class InternDto
    {
        public required string name { get; set; }

        public required string emailAddress { get; set; }
        
        public required string password { get; set; }

        public string? confirmPassword { get; set; }

        public IFormFile profilePic { get; set; }

    }
}
