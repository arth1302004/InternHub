using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace InternAttendenceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IEncryptionService _encryptionService;
        private const int MaxLoginAttempts = 5;
        private static readonly TimeSpan LockoutDuration = TimeSpan.FromSeconds(5);

        public LoginController(ILoginService loginService, ApplicationDbContext context, IEmailService emailService, IEncryptionService encryptionService)
        {
            _loginService = loginService;
            _context = context;
            _emailService = emailService;
            _encryptionService = encryptionService;
        }

        [HttpGet("public-key")]
        public IActionResult GetPublicKey()
        {
            return Ok(_encryptionService.GetPublicKey());
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto credentials)
        {
            if (credentials == null || string.IsNullOrEmpty(credentials.username) || string.IsNullOrEmpty(credentials.password))
            {
                return BadRequest("Username and password are required");
            }

            var username = credentials.username.ToLower();
            var user = await _context.login.FirstOrDefaultAsync(u => u.username == username);

            if (user != null && user.LockoutEndDate.HasValue && user.LockoutEndDate > DateTime.UtcNow)
            {
                return StatusCode(429, $"Too many failed login attempts. Please try again after {user.LockoutEndDate.Value.ToShortTimeString()}.");
            }

            var loginResponse = await _loginService.GenerateToken(credentials);

            Console.WriteLine($"LoginController: loginResponse is null: {loginResponse == null}");
            if (loginResponse != null)
            {
                Console.WriteLine($"LoginController: loginResponse.Token: {loginResponse.Token}");
                Console.WriteLine($"LoginController: loginResponse.userId: {loginResponse.userId}");
                Console.WriteLine($"LoginController: loginResponse.Role: {loginResponse.Role}");
                Console.WriteLine($"LoginController: loginResponse.IsPasswordReset: {loginResponse.IsPasswordReset}");
            }

            if (loginResponse == null)
            {
                if (user != null)
                {
                    user.FailedLoginAttempts++;
                    if (user.FailedLoginAttempts >= MaxLoginAttempts)
                    {
                        user.LockoutEndDate = DateTime.UtcNow.Add(LockoutDuration);
                    }
                    await _context.SaveChangesAsync();
                }
                return Unauthorized("Invalid credentials");
            }

            if (user != null)
            {
                user.FailedLoginAttempts = 0;
                user.LockoutEndDate = null;
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                token = loginResponse.Token,
                username = credentials.username,
                role = loginResponse.Role,
                userId = loginResponse.userId,
                isPasswordReset = loginResponse.IsPasswordReset
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var intern = await _context.intern.FirstOrDefaultAsync(u => u.emailAddress == model.Email);
            if (intern == null)
            {
                return NotFound(new { message = "User with that email not found." });
            }

            // Check if user has security questions set up
            if (string.IsNullOrEmpty(intern.SecurityQuestion1))
            {
                return BadRequest(new { message = "No security questions are set up for this account. Please contact an administrator." });
            }

            return Ok(new { internId = intern.internId });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromQuery] string token, [FromBody] ResetPasswordDto model)
        {
            var user = await _context.login.FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.ResetTokenExpiry > DateTime.UtcNow);
            if (user == null)
            {
                return BadRequest("Invalid or expired token.");
            }

            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            var result = await _loginService.ResetPasswordAsync(token, model.Password);
            if (!result)
            {
                return BadRequest("Invalid or expired token.");
            }

            return Ok("Password has been reset successfully.");
        }

        [HttpPost("{userId:guid}/verify-password")]
        public async Task<IActionResult> VerifyPassword([FromRoute] Guid userId,[FromBody] VerifyPasswordDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Password is required.");
            }

            var result = await _loginService.VerifyPasswordAsync(userId, model.Password);
            if (!result)
            {
                return Unauthorized("Invalid password.");
            }

            return Ok("Password verified successfully.");
        }

        [HttpGet("get-user-id-from-token")]
        public async Task<IActionResult> GetUserIdFromToken([FromQuery] string token)
        {
            var user = await _context.login.FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.ResetTokenExpiry > DateTime.UtcNow);
            if (user == null)
            {
                return NotFound("Invalid or expired token.");
            }

            return Ok(new { userId = user.UserId });
        }
    }
}
