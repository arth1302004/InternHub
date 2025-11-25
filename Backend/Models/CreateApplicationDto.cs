using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;


namespace InternAttendenceSystem.Models
{


    public class CreateApplicationDto
    {
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Date of birth is required")]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Contact number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string ContactNumber { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Nationality is required")]
        public string Nationality { get; set; }

        [Required(ErrorMessage = "Education level is required")]
        public string EducationLevel { get; set; }

        [Required(ErrorMessage = "Department is required")]
        public string department { get; set; }

        [Required(ErrorMessage = "University name is required")]
        public string UniversityName { get; set; }

        [Required(ErrorMessage = "Degree is required")]
        public string Degree { get; set; }

        [Required(ErrorMessage = "Year of study is required")]
        public string YearOfStudy { get; set; }

        [Required(ErrorMessage = "Enrollment number is required")]
        public string EnrollmentNumber { get; set; }

        [Range(0.0, 4.0, ErrorMessage = "CGPA must be between 0.0 and 4.0")]
        public double? CGPA { get; set; }

        [Required(ErrorMessage = "Internship role is required")]
        public string InternshipRole { get; set; }

        [Required(ErrorMessage = "Preferred start date is required")]
        [DataType(DataType.Date)]
        public DateTime PreferredStartDate { get; set; }

        [Required(ErrorMessage = "Preferred end date is required")]
        [DataType(DataType.Date)]
        public DateTime PreferredEndDate { get; set; }

        [Required(ErrorMessage = "Mode of internship is required")]
        public string ModeOfInternship { get; set; }

        [Required(ErrorMessage = "Location preference is required")]
        public string LocationPreference { get; set; }

        public string TechnicalSkills { get; set; }
        public string SoftSkills { get; set; }
        public string PreviousExperience { get; set; }

        public IFormFile ResumeFile { get; set; }

        public IFormFile ProfilePicFile { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string PortfolioUrl { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string LinkedInUrl { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string GitHubUrl { get; set; }

        [Required(ErrorMessage = "Motivation statement is required")]
        public string MotivationStatement { get; set; }

        [Required(ErrorMessage = "Source of application is required")]
        public string SourceOfApplication { get; set; }

        [Required(ErrorMessage = "Availability is required")]
        public string Availability { get; set; }

        [Required(ErrorMessage = "Emergency contact is required")]
        public string EmergencyContact { get; set; }

        [Required(ErrorMessage = "You must accept the agreement")]
        [Range(typeof(bool), "true", "true", ErrorMessage = "You must accept the agreement")]
        public bool AgreementAccepted { get; set; }
    }



    public class ApplicationResponseDto
    {
        public Guid ApplicationId { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Nationality { get; set; }

        public string Status { get; set; } // e.g., Pending, Reviewed, Accepted, Rejected
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
        public string MotivationStatement { get; set; }
        public string SourceOfApplication { get; set; }
        public string Availability { get; set; }
        public string EmergencyContact { get; set; }
        public bool AgreementAccepted { get; set; }
        public DateTime RequestDate { get; set; }

        public DateTime? InterviewDate { get; set; }
        public string InterviewLink { get; set; }
    }

}
