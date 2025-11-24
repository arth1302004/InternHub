namespace InternAttendenceSystem.Models
{
    public class UpdateInternRequest
    {
        public string name { get; set; }
        public string emailAddress { get; set; }

        public IFormFile? profilePic { get; set; }
    }
}
