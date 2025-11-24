using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Models.Common;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;
using BCrypt.Net;
using System.Linq.Dynamic.Core;
using System.Linq;
using System.Collections.Generic;

namespace InternAttendenceSystem.Services
{
    public class InternService:IInternService
    {

        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IEncryptionService encryptionService;

        public InternService(ApplicationDbContext dbcontext, IWebHostEnvironment environment, IEncryptionService _encryptionService)
        {
            
            _context = dbcontext;
            _environment = environment;
            encryptionService = _encryptionService;
        }

        public async Task<IEnumerable<Intern>> GetAllInterns()
        {
            var interns = await _context.intern.ToListAsync();

            return interns;

        }
        public async Task<bool> IsEmailAlreadyRegisteredAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentNullException(nameof(email));

            return await _context.intern
                .AnyAsync(i => i.emailAddress == email);
        }

        public async Task<PagedList<Intern>> GetAllInterns(int pageNumber, int pageSize, string searchString, string sortBy, string sortOrder, string department, string status)
        {
            var source = _context.intern.AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                source = source.Where(i => i.name.ToLower().Contains(searchString.ToLower()) || i.InternshipRole.ToLower().Contains(searchString.ToLower()));
            }

            if (!string.IsNullOrEmpty(department))
            {
                source = source.Where(i => i.department == department);
            }
    
            if (!string.IsNullOrEmpty(status))
            {
                source = source.Where(i => i.internshipStatus == status);
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                var sortExpression = $"{sortBy} {sortOrder ?? "asc"}";
                source = source.OrderBy(sortExpression);
            }

            return await System.Threading.Tasks.Task.FromResult(PagedList<Intern>.ToPagedList(source, pageNumber, pageSize));
        }

        public async Task<Intern>  GetInternById(Guid id)
        {
            var intern = await _context.intern.FirstOrDefaultAsync(e => e.internId == id);
            return intern;
        }

       
        public async Task<Intern> DeleteIntern(Guid Id)
        {
            Intern intern = await _context.intern.FirstOrDefaultAsync(e=> e.internId == Id);
            if (intern == null)
            {
                return null;
            }

            // Delete profile picture if it exists
            if (!string.IsNullOrEmpty(intern.ProfileImageUrl))
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                var fileName = Path.GetFileName(intern.ProfileImageUrl);
                var filePath = Path.Combine(uploadsFolder, fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.intern.Remove(intern);
            await _context.SaveChangesAsync();
            return intern;
        }
        public async Task<Intern> UpdateIntern(Guid id, UpdateInternDto internDto)
        {
            Intern intern = await _context.intern.FirstOrDefaultAsync(e => e.internId == id);

            intern.emailAddress = internDto.emailAddress;
            intern.name = internDto.name;
            intern.ProfileImageUrl =internDto.ImageUrl;
            await _context.SaveChangesAsync();
            return intern;
        }

        public async Task<bool> ResetPassword(Guid internId,ResetPasswordDto resetPassword)
        {
            if (resetPassword == null) { throw new ArgumentNullException(nameof(resetPassword)); }

            if (internId.Equals(null)) { throw new ArgumentNullException(nameof(internId)); }

            var decryptedPassword = encryptionService.Decrypt(resetPassword.Password).Trim();
            var decryptedConfirmPassword = encryptionService.Decrypt(resetPassword.ConfirmPassword).Trim();

            if (decryptedPassword != decryptedConfirmPassword)
            {
                throw new ArgumentException("the password and reset password should be same.");
            }

            Intern intern = await _context.intern.SingleOrDefaultAsync(value => value.internId == internId);

            if (intern == null) { return false; }

            intern.password = BCrypt.Net.BCrypt.HashPassword(decryptedPassword);

            await _context.SaveChangesAsync();

            var login = await _context.login.FirstOrDefaultAsync(l => l.UserId == internId);
            if (login != null)
            {
                login.password = BCrypt.Net.BCrypt.HashPassword(decryptedPassword);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> VerifyPassword(Guid internId, VerifyPasswordDto VerifyPassword)
        {
            if (VerifyPassword == null) { 
            return false;}
            if (internId.Equals(null)) { return false; }

            Intern intern = await _context.intern.SingleOrDefaultAsync(value => value.internId == internId);

            if(intern == null) { return false; }

            var decryptedPassword = encryptionService.Decrypt(VerifyPassword.Password).Trim();
            return BCrypt.Net.BCrypt.Verify(decryptedPassword, intern.password);
        }

        public async Task<bool> SetSecurityQuestions(Guid internId, SetSecurityQuestionsDto questionsDto)
        {
            var intern = await _context.intern.FindAsync(internId);
            if (intern == null)
            {
                return false;
            }

            if (questionsDto.Questions.Count != 3)
            {
                return false;
            }

            intern.SecurityQuestion1 = questionsDto.Questions[0].Question;
            intern.SecurityAnswer1 = BCrypt.Net.BCrypt.HashPassword(questionsDto.Questions[0].Answer);
            intern.SecurityQuestion2 = questionsDto.Questions[1].Question;
            intern.SecurityAnswer2 = BCrypt.Net.BCrypt.HashPassword(questionsDto.Questions[1].Answer);
            intern.SecurityQuestion3 = questionsDto.Questions[2].Question;
            intern.SecurityAnswer3 = BCrypt.Net.BCrypt.HashPassword(questionsDto.Questions[2].Answer);

            _context.Entry(intern).State = EntityState.Modified; // Explicitly mark as modified
            await _context.SaveChangesAsync();

            Console.WriteLine($"InternService: SetSecurityQuestions - Returning true (success).");
            return true;
        }

        public async Task<List<SecurityQuestionDto>> GetSecurityQuestions(Guid internId)
        {
            var intern = await _context.intern.FindAsync(internId);
            if (intern == null || string.IsNullOrEmpty(intern.SecurityQuestion1))
            {
                return null;
            }

            var allQuestions = new List<SecurityQuestionDto>
            {
                new SecurityQuestionDto { Question = intern.SecurityQuestion1 },
                new SecurityQuestionDto { Question = intern.SecurityQuestion2 },
                new SecurityQuestionDto { Question = intern.SecurityQuestion3 }
            };

            var random = new Random();
            return allQuestions.OrderBy(q => random.Next()).Take(2).ToList();
        }

        public async Task<object> VerifySecurityQuestions(VerifySecurityQuestionsDto questionsDto)
        {
            if (questionsDto.Questions.Count != 3)
            {
                return new { success = false, message = "Exactly 3 security questions and answers are required." };
            }

            // Iterate through all interns to find a match based on security questions
            // WARNING: This is a significant security and performance risk.
            // It is highly recommended to identify the user (e.g., by email) first.
            var allInterns = await _context.intern.ToListAsync();

            Intern? matchingIntern = null;

            foreach (var intern in allInterns)
            {
                bool allAnswersMatch = true;
                // Check if the provided questions match the intern's stored questions and answers
                // This assumes the order of questions in questionsDto matches the order in Intern entity
                // For a robust solution, questions should be matched by content, not just index.
                // However, given the current structure, we'll assume ordered matching.

                // Question 1
                if (questionsDto.Questions[0].Question != intern.SecurityQuestion1 ||
                    !BCrypt.Net.BCrypt.Verify(questionsDto.Questions[0].Answer, intern.SecurityAnswer1))
                {
                    allAnswersMatch = false;
                }

                // Question 2
                if (allAnswersMatch && (questionsDto.Questions[1].Question != intern.SecurityQuestion2 ||
                    !BCrypt.Net.BCrypt.Verify(questionsDto.Questions[1].Answer, intern.SecurityAnswer2))) 
                {
                    allAnswersMatch = false;
                }

                // Question 3
                if (allAnswersMatch && (questionsDto.Questions[2].Question != intern.SecurityQuestion3 ||
                    !BCrypt.Net.BCrypt.Verify(questionsDto.Questions[2].Answer, intern.SecurityAnswer3))) 
                {
                    allAnswersMatch = false;
                }

                if (allAnswersMatch)
                {
                    matchingIntern = intern;
                    break; // Found a match
                }
            }

            if (matchingIntern == null)
            {
                return new { success = false, message = "No user found with the provided security questions and answers." };
            }

            // If a matching intern is found, generate a reset token
            var loginUser = await _context.login.FirstOrDefaultAsync(l => l.UserId == matchingIntern.internId);
            if (loginUser == null)
            {
                return new { success = false, message = "Login record not found for the identified user." };
            }

            var token = Guid.NewGuid().ToString();
            loginUser.PasswordResetToken = token;
            loginUser.ResetTokenExpiry = DateTime.UtcNow.AddHours(1); // Token valid for 1 hour

            await _context.SaveChangesAsync();

            return new { success = true, resetToken = token };
        }

        public async System.Threading.Tasks.Task AddApplicationToken(ApplicationToken token)
        {
            await _context.ApplicationTokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public IEnumerable<ApplicationToken> GetApplicationTokensByEmail(string email)
        {
            return _context.ApplicationTokens.Where(t => t.Email == email).ToList();
        }

        public void RemoveApplicationTokens(IEnumerable<ApplicationToken> tokens)
        {
            _context.ApplicationTokens.RemoveRange(tokens);
            _context.SaveChanges();
        }

        public async Task<ApplicationToken> GetApplicationToken(string token)
        {
            return await _context.ApplicationTokens.FirstOrDefaultAsync(t => t.Token == token && t.ExpiryDate > DateTime.UtcNow);
        }

        public List<string> GetAllSecurityQuestions()
        {
            return _context.SecurityQuestions.Select(q => q.QuestionText).ToList();
        }

    }
}
