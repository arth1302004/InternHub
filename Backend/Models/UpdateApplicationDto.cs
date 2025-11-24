using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class UpdateApplicationDto
    {
        [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
        public string FullName { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        public string Gender { get; set; }

        [Phone(ErrorMessage = "Invalid phone number format")]
        public string ContactNumber { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }


        public string Status { get; set; } // e.g., Pending, Reviewed, Accepted, Rejected   

        public string Address { get; set; }
        public string Nationality { get; set; }
        public string EducationLevel { get; set; }
        public string UniversityName { get; set; }
        public string Degree { get; set; }
        public string YearOfStudy { get; set; }
        public string EnrollmentNumber { get; set; }

        [Range(0.0, 4.0, ErrorMessage = "CGPA must be between 0.0 and 4.0")]
        public double? CGPA { get; set; }

        public string InternshipRole { get; set; }

        [DataType(DataType.Date)]
        public DateTime? PreferredStartDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? PreferredEndDate { get; set; }

        public string ModeOfInternship { get; set; }
        public string LocationPreference { get; set; }
        public string TechnicalSkills { get; set; }
        public string SoftSkills { get; set; }
        public string PreviousExperience { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string ResumeUrl { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string PortfolioUrl { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string LinkedInUrl { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string GitHubUrl { get; set; }

        public string MotivationStatement { get; set; }
        public string SourceOfApplication { get; set; }
        public string Availability { get; set; }
        public string EmergencyContact { get; set; }

        public bool? AgreementAccepted { get; set; }
    }
}
