using System.Text.Json.Serialization;

namespace InternAttendenceSystem.Models
{
    public class LoginDto
    {
        public required string password { get; set; }
        public required string username { get; set; }

        [JsonIgnore]
        public  string role { get; set; }  = string.Empty;

    }
}
