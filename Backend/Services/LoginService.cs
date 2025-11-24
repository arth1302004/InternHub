using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace InternAttendenceSystem.Services
{
    public class LoginService : ILoginService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IEncryptionService _encryptionService;

        public LoginService(IConfiguration configuration, ApplicationDbContext context, IEncryptionService encryptionService)
        {
            _configuration = configuration;
            _context = context;
            _encryptionService = encryptionService;
        }

        public async Task<LoginResponse?> GenerateToken(LoginDto loginCreds)
        {
            string role = null;
            Guid userId;
            string? email;
            bool isPasswordReset = true; // Default to true for admins

            var trimmedUsername = loginCreds.username.Trim().ToLower();
            var decryptedPassword = _encryptionService.Decrypt(loginCreds.password).Trim();

            var Intern = await _context.intern.FirstOrDefaultAsync(value =>
                value.name.ToLower() == trimmedUsername || value.emailAddress.ToLower() == trimmedUsername);

            var Admin = await _context.admins.FirstOrDefaultAsync(value =>
                value.username.ToLower() == trimmedUsername);

            if (Admin == null && Intern == null)
            {
                return null;
            }
            else if (Admin != null)
            {
                            Console.WriteLine($"LoginService: Verifying password for Admin: {trimmedUsername}");
                if (!BCrypt.Net.BCrypt.Verify(decryptedPassword, Admin.password))
                {
                    Console.WriteLine("LoginService: Admin password verification failed.");
                    return null;
                }
                Console.WriteLine("LoginService: Admin password verification successful.");
                role = "admin";
                userId = Admin.adminId;
                email = null; 
            }
            else
            {
                Console.WriteLine($"LoginService: Verifying password for Intern: {trimmedUsername}");
                if (!BCrypt.Net.BCrypt.Verify(decryptedPassword, Intern.password))
                {
                    Console.WriteLine("LoginService: Intern password verification failed.");
                    return null;
                }
                Console.WriteLine("LoginService: Intern password verification successful.");
                role = "intern";
                userId = Intern.internId;
                email = Intern.emailAddress;
                isPasswordReset = Intern.IsPasswordReset;
            }

         
            var jwtSettings = _configuration.GetSection("Jwt");
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, loginCreds.username),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.Role, role)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            Console.WriteLine($"LoginService: IsPasswordReset for user {trimmedUsername}: {isPasswordReset}");

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["DurationInMinutes"])),
                signingCredentials: creds
            );

            Login userlogin = new Login()
            {
                LoginId = Guid.NewGuid(),
                password = loginCreds.password,
                Role = role,
                UserId = userId,
                username = loginCreds.username,
                LoginDate = DateTime.UtcNow,
                Email = email
            };

            await _context.login.AddAsync(userlogin);
            await _context.SaveChangesAsync();

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            Console.WriteLine($"LoginService: Token generated: {tokenString != null}");

            return new LoginResponse
            {
                Token = tokenString,
                Role = role,
                userId = userId,
                IsPasswordReset = isPasswordReset // Use the determined value
            };
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _context.login.FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.ResetTokenExpiry > DateTime.UtcNow);
            if (user == null)
            {
                return false; // Invalid or expired token
            }

            var decryptedPassword = _encryptionService.Decrypt(newPassword).Trim();
            user.password = BCrypt.Net.BCrypt.HashPassword(decryptedPassword);
            user.PasswordResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            // Optionally, update the intern table password as well
            var intern = await _context.intern.FirstOrDefaultAsync(i => i.emailAddress == user.Email);
            if (intern != null)
            {
                intern.password = BCrypt.Net.BCrypt.HashPassword(decryptedPassword);
                intern.confirmPassword = BCrypt.Net.BCrypt.HashPassword(decryptedPassword);
                intern.IsPasswordReset = true;
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> VerifyPasswordAsync(Guid userId, string password)
        {
            var user = await _context.login.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return false; // User not found
            }

            var decryptedPassword = _encryptionService.Decrypt(password).Trim();
            return BCrypt.Net.BCrypt.Verify(decryptedPassword, user.password);
        }
    }
}