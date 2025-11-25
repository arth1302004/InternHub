using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternAttendenceSystem.Models.Entities
{
    public class Interview
    {
        [Key]
        public Guid InterviewId { get; set; }

        [ForeignKey("Application")]
        public Guid ApplicationId { get; set; }
        public Application Application { get; set; }

        public string CandidateName { get; set; }
        public string CandidateEmail { get; set; }
        public string Position { get; set; }

        public DateTime Date { get; set; }
        public string Time { get; set; }
        public int Duration { get; set; } // in minutes
        public string Type { get; set; } // Phone, Video, InPerson
        public string Location { get; set; }
        public string MeetingLink { get; set; }

        public string InterviewerName { get; set; }
        public string InterviewerEmail { get; set; }

        public string Status { get; set; } // Scheduled, Completed, Cancelled, NoShow

        public string Notes { get; set; }
        public string Feedback { get; set; }
        public int? Rating { get; set; }
    }
}
