using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class InterviewDto
    {
        public Guid InterviewId { get; set; }
        public Guid ApplicationId { get; set; }
        public string CandidateName { get; set; }
        public string CandidateEmail { get; set; }
        public string Position { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public int Duration { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public string MeetingLink { get; set; }
        public string InterviewerName { get; set; }
        public string InterviewerEmail { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public string Feedback { get; set; }
        public int? Rating { get; set; }
    }

    public class CreateInterviewDto
    {
        [Required]
        public Guid ApplicationId { get; set; }
        [Required]
        public string CandidateName { get; set; }
        [Required]
        public string CandidateEmail { get; set; }
        [Required]
        public string Position { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Time { get; set; }
        public int Duration { get; set; }
        [Required]
        public string Type { get; set; }
        public string Location { get; set; }
        public string MeetingLink { get; set; }
        [Required]
        public string InterviewerName { get; set; }
        [Required]
        public string InterviewerEmail { get; set; }
        public string Notes { get; set; }
    }

    public class UpdateInterviewDto
    {
        public DateTime? Date { get; set; }
        public string Time { get; set; }
        public int? Duration { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public string MeetingLink { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public string Feedback { get; set; }
        public int? Rating { get; set; }
    }
}
