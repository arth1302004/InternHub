using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;

using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Hosting;

namespace InternAttendenceSystem.Services
{

    public class ApplicationService : IApplicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ApplicationService(ApplicationDbContext context, IEmailService emailService, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _emailService = emailService;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<ApplicationResponseDto> GetApplicationByIdAsync(Guid id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
                return null;

            return MapToResponseDto(application);
        }

        public async Task<IEnumerable<ApplicationResponseDto>> GetAllApplicationsAsync()
        {
            var applications = await _context.Applications.ToListAsync();
            return applications.Select(MapToResponseDto);
        }

        public async Task<ApplicationResponseDto> CreateApplicationAsync(CreateApplicationDto createDto)
        {
            if (await _context.Applications.AnyAsync(a => a.Email == createDto.Email))
            {
                throw new InvalidOperationException("An application with this email already exists.");
            }

           
            if (await _context.Applications.AnyAsync(a => a.EnrollmentNumber == createDto.EnrollmentNumber))
            {
                throw new InvalidOperationException("An application with this enrollment number already exists.");
            }

            
            if (createDto.PreferredStartDate >= createDto.PreferredEndDate)
            {
                throw new InvalidOperationException("Preferred start date must be before end date.");
            }

            var resumeUrl = await SaveFileAsync(createDto.ResumeFile);
            var profilePicUrl = await SaveFileAsync(createDto.ProfilePicFile);

            var application = new Application
            {
                applicationId = Guid.NewGuid(),
                FullName = createDto.FullName,
                DateOfBirth = createDto.DateOfBirth,
                Gender = createDto.Gender,
                ContactNumber = createDto.ContactNumber,
                Email = createDto.Email,
                Address = createDto.Address,
                Nationality = createDto.Nationality,
                EducationLevel = createDto.EducationLevel,
                UniversityName = createDto.UniversityName,
                Degree = createDto.Degree,
                YearOfStudy = createDto.YearOfStudy,
                EnrollmentNumber = createDto.EnrollmentNumber,
                CGPA = createDto.CGPA,
                InternshipRole = createDto.InternshipRole,
                PreferredStartDate = createDto.PreferredStartDate,
                PreferredEndDate = createDto.PreferredEndDate,
                ModeOfInternship = createDto.ModeOfInternship,
                LocationPreference = createDto.LocationPreference,
                TechnicalSkills = createDto.TechnicalSkills,
                SoftSkills = createDto.SoftSkills,
                PreviousExperience = createDto.PreviousExperience,
                ResumeUrl = resumeUrl,
                ProfilePicUrl = profilePicUrl,
                PortfolioUrl = createDto.PortfolioUrl,
                LinkedInUrl = createDto.LinkedInUrl,
                GitHubUrl = createDto.GitHubUrl,
                MotivationStatement = createDto.MotivationStatement,
                SourceOfApplication = createDto.SourceOfApplication,
                Availability = createDto.Availability,
                EmergencyContact = createDto.EmergencyContact,
                AgreementAccepted = createDto.AgreementAccepted,
                RequestDate = DateTime.UtcNow,
                Status = "Submitted",
                department = createDto.department
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return MapToResponseDto(application);
        }

        public async Task<ApplicationResponseDto> UpdateApplicationAsync(Guid id, UpdateApplicationDto updateDto)
        {
            var existingApplication = await _context.Applications.FindAsync(id);
            if (existingApplication == null)
                return null;

            // Validate email uniqueness if email is being updated
            if (!string.IsNullOrEmpty(updateDto.Email) && updateDto.Email != existingApplication.Email)
            {
                if (await _context.Applications.AnyAsync(a => a.Email == updateDto.Email))
                {
                    throw new InvalidOperationException("An application with this email already exists.");
                }
            }
                
            // Validate enrollment number uniqueness if being updated
            if (!string.IsNullOrEmpty(updateDto.EnrollmentNumber) && updateDto.EnrollmentNumber != existingApplication.EnrollmentNumber)
            {
                if (await _context.Applications.AnyAsync(a => a.EnrollmentNumber == updateDto.EnrollmentNumber))
                {
                    throw new InvalidOperationException("An application with this enrollment number already exists.");
                }
            }

            // Validate date range if dates are being updated
            if (updateDto.PreferredStartDate.HasValue && updateDto.PreferredEndDate.HasValue)
            {
                if (updateDto.PreferredStartDate.Value >= updateDto.PreferredEndDate.Value)
                {
                    throw new InvalidOperationException("Preferred start date must be before end date.");
                }
            }

            // Update properties if they are provided in the DTO
            if (!string.IsNullOrEmpty(updateDto.FullName))
                existingApplication.FullName = updateDto.FullName;

            if (updateDto.DateOfBirth.HasValue)
                existingApplication.DateOfBirth = updateDto.DateOfBirth.Value;

            if (!string.IsNullOrEmpty(updateDto.Gender))
                existingApplication.Gender = updateDto.Gender;

            if (!string.IsNullOrEmpty(updateDto.ContactNumber))
                existingApplication.ContactNumber = updateDto.ContactNumber;

            if (!string.IsNullOrEmpty(updateDto.Email))
                existingApplication.Email = updateDto.Email;

            if (!string.IsNullOrEmpty(updateDto.Address))
                existingApplication.Address = updateDto.Address;

            if (!string.IsNullOrEmpty(updateDto.Nationality))
                existingApplication.Nationality = updateDto.Nationality;

            if (!string.IsNullOrEmpty(updateDto.EducationLevel))
                existingApplication.EducationLevel = updateDto.EducationLevel;

            if (!string.IsNullOrEmpty(updateDto.UniversityName))
                existingApplication.UniversityName = updateDto.UniversityName;

            if (!string.IsNullOrEmpty(updateDto.Degree))
                existingApplication.Degree = updateDto.Degree;

            if (!string.IsNullOrEmpty(updateDto.YearOfStudy))
                existingApplication.YearOfStudy = updateDto.YearOfStudy;

            if (!string.IsNullOrEmpty(updateDto.EnrollmentNumber))
                existingApplication.EnrollmentNumber = updateDto.EnrollmentNumber;

            if (updateDto.CGPA.HasValue)
                existingApplication.CGPA = updateDto.CGPA;

            if (!string.IsNullOrEmpty(updateDto.InternshipRole))
                existingApplication.InternshipRole = updateDto.InternshipRole;

            if (updateDto.PreferredStartDate.HasValue)
                existingApplication.PreferredStartDate = updateDto.PreferredStartDate.Value;

            if (updateDto.PreferredEndDate.HasValue)
                existingApplication.PreferredEndDate = updateDto.PreferredEndDate.Value;

            if (!string.IsNullOrEmpty(updateDto.ModeOfInternship))
                existingApplication.ModeOfInternship = updateDto.ModeOfInternship;

            if (!string.IsNullOrEmpty(updateDto.LocationPreference))
                existingApplication.LocationPreference = updateDto.LocationPreference;

            if (updateDto.TechnicalSkills != null)
                existingApplication.TechnicalSkills = updateDto.TechnicalSkills;

            if (updateDto.SoftSkills != null)
                existingApplication.SoftSkills = updateDto.SoftSkills;

            if (updateDto.PreviousExperience != null)
                existingApplication.PreviousExperience = updateDto.PreviousExperience;

            if (updateDto.ResumeUrl != null)
                existingApplication.ResumeUrl = updateDto.ResumeUrl;

            if (updateDto.PortfolioUrl != null)
                existingApplication.PortfolioUrl = updateDto.PortfolioUrl;

            if (updateDto.LinkedInUrl != null)
                existingApplication.LinkedInUrl = updateDto.LinkedInUrl;

            if (updateDto.GitHubUrl != null)
                existingApplication.GitHubUrl = updateDto.GitHubUrl;

            if (updateDto.MotivationStatement != null)
                existingApplication.MotivationStatement = updateDto.MotivationStatement;

            if (updateDto.SourceOfApplication != null)
                existingApplication.SourceOfApplication = updateDto.SourceOfApplication;

            if (updateDto.Availability != null)
                existingApplication.Availability = updateDto.Availability;

            if (updateDto.EmergencyContact != null)
                existingApplication.EmergencyContact = updateDto.EmergencyContact;

            if (updateDto.AgreementAccepted.HasValue)
                existingApplication.AgreementAccepted = updateDto.AgreementAccepted.Value;

            if (updateDto.Status != null)
                existingApplication.Status = updateDto.Status;

            _context.Applications.Update(existingApplication);
            await _context.SaveChangesAsync();

            return MapToResponseDto(existingApplication);
        }

        public async Task<bool> DeleteApplicationAsync(Guid id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
                return false;

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ApplicationResponseDto> UpdateApplicationStatusAsync(Guid id, UpdateApplicationStatusDto statusDto)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
            {
                return null;
            }

            application.Status = statusDto.Status;

            if (statusDto.Status.ToLower() == "interview")
            {
                if (statusDto.InterviewDate.HasValue)
                {
                    application.InterviewDate = statusDto.InterviewDate.Value;
                }
                if (!string.IsNullOrEmpty(statusDto.InterviewLink))
                {
                    application.InterviewLink = statusDto.InterviewLink;
                }

                if (application.InterviewDate.HasValue && !string.IsNullOrEmpty(application.InterviewLink))
                {
                    await _emailService.SendInterviewEmailAsync(application.Email, application.InterviewLink, application.InterviewDate.Value);
                }
            }
            else if (statusDto.Status.ToLower() == "rejected")
            {
                await _emailService.SendRejectionEmailAsync(application.Email, application.FullName);
            }
            else if (statusDto.Status.ToLower() == "hired")
            {
                var internExists = await _context.intern.AnyAsync(i => i.emailAddress == application.Email);
                if (internExists)
                {
                    throw new InvalidOperationException("An intern with this email already exists.");
                }

                var password = Path.GetRandomFileName().Replace(".", "");
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

                var newIntern = new Intern
                {
                    internId = Guid.NewGuid(),
                    name = application.FullName,
                    DateOfBirth = application.DateOfBirth,
                    Gender = application.Gender,
                    ContactNumber = application.ContactNumber,
                    Address = application.Address,
                    Nationality = application.Nationality,
                    EducationLevel = application.EducationLevel,
                    UniversityName = application.UniversityName,
                    Degree = application.Degree,
                    YearOfStudy = application.YearOfStudy,
                    EnrollmentNumber = application.EnrollmentNumber,
                    CGPA = application.CGPA,
                    InternshipRole = application.InternshipRole,
                    PreferredStartDate = application.PreferredStartDate,
                    PreferredEndDate = application.PreferredEndDate,
                    ModeOfInternship = application.ModeOfInternship,
                    LocationPreference = application.LocationPreference,
                    TechnicalSkills = application.TechnicalSkills,
                    SoftSkills = application.SoftSkills,
                    PreviousExperience = application.PreviousExperience,
                    ResumeUrl = application.ResumeUrl,
                    PortfolioUrl = application.PortfolioUrl,
                    LinkedInUrl = application.LinkedInUrl,
                    GitHubUrl = application.GitHubUrl,
                    MotivationStatement = application.MotivationStatement,
                    SourceOfApplication = application.SourceOfApplication,
                    Availability = application.Availability,
                    EmergencyContact = application.EmergencyContact,
                    ProfileImageUrl = application.ProfilePicUrl,
                    emailAddress = application.Email,
                    password = hashedPassword,
                    department = application.department,
                    internshipStatus = "onboarding",
                    mentor = null                  
                };

                await _context.intern.AddAsync(newIntern);

                var login = new Login
                {
                    LoginId = Guid.NewGuid(),
                    UserId = newIntern.internId,
                    username = newIntern.emailAddress,
                    password = hashedPassword,
                    Role = newIntern.InternshipRole,
                    Email = newIntern.emailAddress,
                    LoginDate = DateTime.UtcNow
                };

                await _context.login.AddAsync(login);

                await _emailService.SendNewInternCredentialsEmailAsync(application.Email, password);
            }

            await _context.SaveChangesAsync();

            return MapToResponseDto(application);
        }

        private ApplicationResponseDto MapToResponseDto(Application application)
        {
            return new ApplicationResponseDto
            {
                Status = application.Status,
                ApplicationId = application.applicationId,
                FullName = application.FullName,
                DateOfBirth = application.DateOfBirth,
                Gender = application.Gender,
                ContactNumber = application.ContactNumber,
                Email = application.Email,
                Address = application.Address,
                Nationality = application.Nationality,
                EducationLevel = application.EducationLevel,
                UniversityName = application.UniversityName,
                Degree = application.Degree,
                YearOfStudy = application.YearOfStudy,
                EnrollmentNumber = application.EnrollmentNumber,
                CGPA = application.CGPA,
                InternshipRole = application.InternshipRole,
                PreferredStartDate = application.PreferredStartDate,
                PreferredEndDate = application.PreferredEndDate,
                ModeOfInternship = application.ModeOfInternship,
                LocationPreference = application.LocationPreference,
                TechnicalSkills = application.TechnicalSkills,
                SoftSkills = application.SoftSkills,
                PreviousExperience = application.PreviousExperience,
                ResumeUrl = application.ResumeUrl,
                ProfilePicUrl = application.ProfilePicUrl,
                PortfolioUrl = application.PortfolioUrl,
                LinkedInUrl = application.LinkedInUrl,
                GitHubUrl = application.GitHubUrl,
                MotivationStatement = application.MotivationStatement,
                SourceOfApplication = application.SourceOfApplication,
                Availability = application.Availability,
                EmergencyContact = application.EmergencyContact,
                AgreementAccepted = application.AgreementAccepted,
                RequestDate = application.RequestDate,
                InterviewDate = application.InterviewDate,
                InterviewLink = application.InterviewLink
            };
        }

        private async Task<string> SaveFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return "/uploads/" + uniqueFileName;
        }
    }
}