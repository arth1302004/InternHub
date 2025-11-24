using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Models.Common;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using InternAttendenceSystem.Services;
using InternAttendenceSystem.Data;

namespace InternAttendenceSystem.Controllers
{

    /*[Authorize(Roles = "admin")]*/
    [ApiController]
    [Route("api/intern")]

    public class InternsController : ControllerBase
    {
        private readonly IInternService _internService;
        private readonly IWebHostEnvironment _environment;
        private readonly IEmailService emailService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        public InternsController(IInternService _internService, IWebHostEnvironment environment, IEmailService EmailService, IConfiguration configuration, ApplicationDbContext context)
        {
            this._internService = _internService;
            _environment = environment;
            this.emailService = EmailService;
            _configuration = configuration;
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllInterns([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string searchString = null, [FromQuery] string sortBy = null, [FromQuery] string sortOrder = null, [FromQuery] string department = null, [FromQuery] string status = null)
        {
            var pagedInterns = await _internService.GetAllInterns(pageNumber, pageSize, searchString, sortBy, sortOrder, department, status);
            
            // Explicitly return an anonymous object with PagedList properties
            return Ok(new {
                currentPage = pagedInterns.CurrentPage,
                totalPages = pagedInterns.TotalPages,
                pageSize = pagedInterns.PageSize,
                totalCount = pagedInterns.TotalCount,
                hasPrevious = pagedInterns.HasPrevious,
                hasNext = pagedInterns.HasNext,
                items = pagedInterns.Items
            });
        }

        

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] OtpRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email is already registered
            var isEmailRegistered = await _internService.IsEmailAlreadyRegisteredAsync(model.Email);
            if (isEmailRegistered)
            {
                return BadRequest(new { message = "Email is already registered. Please move to sign in." });
            }

            // Send OTP since email is not registered
            var errorMessage = await emailService.SendEmailAsync(model.Email);
            if (!string.IsNullOrEmpty(errorMessage))
            {
                return StatusCode(500, new { message = "Failed to send OTP", error = errorMessage });
            }

            return Ok(new { message = "OTP sent successfully" });
        }

        [HttpPost("validate-otp")]
        public async Task<IActionResult> ValidateOtp([FromBody] OtpValidationDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isValid = await emailService.ValidateOtpAsync(model.Email, model.Otp);
            if (!isValid)
            {
                return BadRequest(new OtpValidationResponseDto
                {
                    Success = false,
                    Message = "Invalid or expired OTP"
                });
            }

            return Ok(new OtpValidationResponseDto
            {
                Success = true,
                Message = "OTP verified successfully"
            });
        }

        [HttpPost("send-application-link")]
        public async Task<IActionResult> SendApplicationLink([FromBody] OtpRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email is already registered as an intern
            var isEmailRegisteredAsIntern = await _internService.IsEmailAlreadyRegisteredAsync(model.Email);
            if (isEmailRegisteredAsIntern)
            {
                return BadRequest(new { message = "Email is already registered as an intern. Please sign in." });
            }

            // Generate a unique token
            var token = Guid.NewGuid().ToString();
            var expiryDate = DateTime.UtcNow.AddHours(24); // Token valid for 24 hours

            // Save the token to the database
            var applicationToken = new ApplicationToken
            {
                Id = Guid.NewGuid(),
                Email = model.Email,
                Token = token,
                ExpiryDate = expiryDate
            };

            // Remove any existing tokens for this email to ensure only one active link
            var existingTokens = _internService.GetApplicationTokensByEmail(model.Email);
            _internService.RemoveApplicationTokens(existingTokens);


            _internService.AddApplicationToken(applicationToken);


            // Construct the application form URL
            var frontendUrl = _configuration["FrontendUrl"]; // Get frontend URL from appsettings.json
            if (string.IsNullOrEmpty(frontendUrl))
            {
                return StatusCode(500, new { message = "Frontend URL is not configured." });
            }
            var applicationLink = $"{frontendUrl}/application-form?token={token}";

            // Send the email
            var errorMessage = await emailService.SendApplicationFormLinkEmailAsync(model.Email, applicationLink);
            if (!string.IsNullOrEmpty(errorMessage))
            {
                return StatusCode(500, new { message = "Failed to send application link email", error = errorMessage });
            }

            return Ok(new { message = "Application link sent successfully" });
        }
        


        [AllowAnonymous]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetInternById([FromRoute] Guid id)
        {
            Intern intern = await _internService.GetInternById(id);

            if (intern == null) {
                return NotFound("there is no intern with this id please try again");
            }

            return Ok(intern);
        }


/*        [AllowAnonymous]
        [HttpPost("AddIntern")]
        public async Task<IActionResult> AddIntern([FromForm] InternDto internToAdd)
        {
            if (internToAdd.profilePic == null || internToAdd.profilePic.Length == 0)
            {
                return BadRequest("Profile image is required");
            }


            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(internToAdd.profilePic.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await internToAdd.profilePic.CopyToAsync(stream);
            }


            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}";

            var intern = new InternCreateDto
            {

                name = internToAdd.name,
                emailAddress = internToAdd.emailAddress,
                password = internToAdd.password,
                ImageUrl = imageUrl,
                confirmPassword = internToAdd.confirmPassword
            };

            Intern internAdded = await _internService.AddIntern(intern);

            return Ok(internAdded);
        }*/

        [AllowAnonymous]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateIntern([FromRoute] Guid id)
        {
            var name = Request.Form["name"];
            var emailAddress = Request.Form["emailAddress"];
            var profilePic = Request.Form.Files.GetFile("profilePic");

            var internToUpdate = new UpdateInternRequest
            {
                name = name,
                emailAddress = emailAddress,
                profilePic = profilePic
            };
            var existingIntern = await _internService.GetInternById(id);
            if (existingIntern == null)
            {
                return NotFound("Intern not found");
            }

            string imageUrl = existingIntern.ProfileImageUrl;


            if (internToUpdate.profilePic != null && internToUpdate.profilePic.Length > 0)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                if (!string.IsNullOrEmpty(existingIntern.ProfileImageUrl))
                {
                    var oldFilePath = Path.Combine(uploadsFolder, Path.GetFileName(existingIntern.ProfileImageUrl));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

         
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(internToUpdate.profilePic.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await internToUpdate.profilePic.CopyToAsync(stream);
                }

                imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}";
            }


            var updatedIntern = new UpdateInternDto
            {
                name = internToUpdate.name ?? existingIntern.name,
                emailAddress = internToUpdate.emailAddress ?? existingIntern.emailAddress,
                ImageUrl = imageUrl
            };

            var intern = await _internService.UpdateIntern(id,updatedIntern);

            return Ok(intern);
        }


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> deleteIntern([FromRoute]Guid Id)
        {
            
         Intern intern = await  _internService.DeleteIntern(Id);
         if (intern == null) {
                return NotFound();      
         }
         return Ok(intern); 
        }


        [HttpPost("reset-password/{id:guid}")]
        public async Task<IActionResult> ResetPassword([FromRoute] Guid id,[FromBody] ResetPasswordDto resetPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Boolean isPasswordReset = await _internService.ResetPassword(id, resetPassword);

                if (!isPasswordReset)
                {
                    return BadRequest("failed to reset password, try again");
                }
                else
                {
                    return Ok("successfully reseted the password.");
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("verify-password/{id:guid}")]
        public async Task<IActionResult> VerifyPassword(Guid id, [FromBody] VerifyPasswordDto verifyPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool isPasswordVerified = await _internService.VerifyPassword(id, verifyPassword);

            if (!isPasswordVerified)
            {
                return Unauthorized("Invalid password");
            }

            return Ok("Password has been verified");
        }

        [HttpPost("{internId:guid}/security-questions")]
        public async Task<IActionResult> SetSecurityQuestions([FromRoute] Guid internId, [FromBody] SetSecurityQuestionsDto questionsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _internService.SetSecurityQuestions(internId, questionsDto);

            if (!result)
            {
                return BadRequest("Failed to set security questions.");
            }

            return Ok("Security questions set successfully.");
        }

        [HttpGet("{internId:guid}/security-questions")]
        public async Task<IActionResult> GetSecurityQuestions([FromRoute] Guid internId)
        {
            var questions = await _internService.GetSecurityQuestions(internId);

            if (questions == null)
            {
                return NotFound("Intern not found or has no security questions.");
            }

            return Ok(questions);
        }

        [HttpPost("verify-security-questions")]
        public async Task<IActionResult> VerifySecurityQuestions([FromBody] VerifySecurityQuestionsDto questionsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var serviceResult = await _internService.VerifySecurityQuestions(questionsDto);

            // Assuming serviceResult is an anonymous object with 'success' and 'message'/'resetToken'
            dynamic result = serviceResult; // Use dynamic to access properties

            if (!result.success)
            {
                return BadRequest(result.message);
            }

            return Ok(new { resetToken = result.resetToken });
        }

        [HttpGet("all-security-questions")]
        public IActionResult GetAllSecurityQuestions()
        {
            var questions = _internService.GetAllSecurityQuestions();
            return Ok(questions);
        }
    }
}
