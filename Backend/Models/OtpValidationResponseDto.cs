namespace InternAttendenceSystem.Models
{
    public class OtpValidationResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public DateTime? BlockedUntil { get; set; }
        public int RemainingAttempts { get; set; }
    }
}
