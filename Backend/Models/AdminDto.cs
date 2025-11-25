namespace InternAttendenceSystem.Models
{
    public class AdminDto
    {
        public required string password { get; set; }
        public required string username { get; set; }
    }

    public class UpdateAdminRequest
    {
        public string? username { get; set; }
        public string? email { get; set; }
        public string? fullName { get; set; }
        public IFormFile? profilePic { get; set; }
    }

    public class UpdateAdminDto
    {
        public string? username { get; set; }
        public string? email { get; set; }
        public string? fullName { get; set; }
        public string? ImageUrl { get; set; }
    }
}
