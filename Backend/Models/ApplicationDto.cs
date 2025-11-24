namespace InternAttendenceSystem.Models
{
    public class ApplicationDto
    {
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Nationality { get; set; }

        public string department { get; set; }
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
        public string PortfolioUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public string GitHubUrl { get; set; }

      
        public string MotivationStatement { get; set; }
        public string SourceOfApplication { get; set; } 
        public string Availability { get; set; } 
        public string EmergencyContact { get; set; }

        
        public bool AgreementAccepted { get; set; } 
        public DateTime RequestDate { get; set; } = DateTime.UtcNow; 
    }
}
