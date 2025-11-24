namespace InternAttendenceSystem.Models.Entities
{
    public class Application
    {


        public Guid applicationId { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Nationality { get; set; }

        public string  department { get; set; } 
        public string EducationLevel { get; set; }
        public string UniversityName { get; set; }
        public string Degree { get; set; }
        public string YearOfStudy { get; set; }
        public string EnrollmentNumber { get; set; }
        public double? CGPA { get; set; }


        public string InternshipRole { get; set; }
        public DateTime PreferredStartDate { get; set; }
        public DateTime PreferredEndDate { get; set; }
        public string ModeOfInternship { get; set; }
        public string LocationPreference { get; set; }


        public string TechnicalSkills { get; set; }
        public string SoftSkills { get; set; }
        public string PreviousExperience { get; set; }
        public string ResumeUrl { get; set; }
        public string ProfilePicUrl { get; set; }
        public string PortfolioUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public string GitHubUrl { get; set; }

        // 🔹 Additional Information
        public string MotivationStatement { get; set; }
        public string SourceOfApplication { get; set; } // Referral, Website, etc.
        public string Availability { get; set; } // Full-time / Part-time
        public string EmergencyContact { get; set; }

        // 🔹 Compliance
        public bool AgreementAccepted { get; set; } // Terms and Conditions
        public DateTime RequestDate { get; set; } = DateTime.UtcNow; // Auto set
        public DateTime applicationDate { get; set; } // Added for recent activities

        public string Status { get; set; } 

    }
}
