using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class Intern
    {
        [Required]
        public Guid internId { get; set; }

        public Guid attendanceId { get; set; }

        public required string name { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string Gender { get; set; } // or enum Gender

        public string ContactNumber { get; set; }

        public string Address { get; set; }

        public string Nationality { get; set; }

        public string EducationLevel { get; set; }

        public string UniversityName { get; set; }

        public string Degree { get; set; } // e.g., B.Tech CSE
        public string YearOfStudy { get; set; } // e.g., 2nd Year, Final Year
        public string EnrollmentNumber { get; set; }
        public double? CGPA { get; set; } // Nullable in case not provided

        public string InternshipRole { get; set; }
        public DateTime PreferredStartDate { get; set; }
        public DateTime PreferredEndDate { get; set; }
        public string ModeOfInternship { get; set; } // Remote / Onsite / Hybrid
        public string LocationPreference { get; set; }

        // 🔹 Professional / Skills
        public string TechnicalSkills { get; set; } // Comma separated or JSON
        public string SoftSkills { get; set; }
        public string PreviousExperience { get; set; }
        public string ResumeUrl { get; set; }
        public string PortfolioUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public string GitHubUrl { get; set; }

        public string internshipStatus { get; set; } 
        public string MotivationStatement { get; set; }
        public string SourceOfApplication { get; set; } // Referral, Website, etc.
        public string Availability { get; set; } // Full-time / Part-time
        public string EmergencyContact { get; set; }

        public required string emailAddress { get; set; }

        public string? ProfileImageUrl { get; set; } 

        public required string password { get; set; }

        public string? confirmPassword { get; set; }

        public required string department { get; set; }

        public DateTime? joiningDate { get; set; }

                  public string? mentor { get; set; }

        public bool IsPasswordReset { get; set; } = false;
        public string? SecurityQuestion1 { get; set; }
        public string? SecurityAnswer1 { get; set; }
        public string? SecurityQuestion2 { get; set; }
        public string? SecurityAnswer2 { get; set; }
        public string? SecurityQuestion3 { get; set; }
        public string? SecurityAnswer3 { get; set; }

        public ICollection<Attendance> attendances { get; set; }

        public ICollection<InternTask> InternTasks { get; set; } = new List<InternTask>();

        // Constructor to initialize collections
        public Intern()
        {
            attendances = new HashSet<Attendance>();
        }
    }
}