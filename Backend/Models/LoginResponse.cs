namespace InternAttendenceSystem.Models
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string Role { get; set; }
        public Guid userId { get; set; }
        public bool IsPasswordReset { get; set; }
    }
}
