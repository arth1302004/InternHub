using InternAttendenceSystem.Data;
using InternAttendenceSystem.Services.ServiceContracts;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Caching.Memory;

namespace InternAttendenceSystem.Services
{
    public class EmailService : IEmailService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public EmailService(ApplicationDbContext context, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _context = context;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public async Task<string?> SendEmailAsync(string email)
        {
            try
            {
                // Generate OTP
                var otp = new Random().Next(1000, 9999).ToString();

                // Store OTP in memory cache with 2-minute expiration
                var cacheKey = $"OTP_{email}";
                _memoryCache.Set(cacheKey, otp, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
                });

                // Send OTP email
                var errorMessage = await SendOtpEmailAsync(email, otp);
                if (!string.IsNullOrEmpty(errorMessage))
                {
                    _memoryCache.Remove(cacheKey); // Clean up cache on failure
                    return errorMessage; // Return SMTP-related error
                }

                return null; // Success
            }
            catch (Exception ex)
            {
                return $"Failed to send email: {ex.Message}";
            }
        }

        public async Task<string?> SendOtpEmailAsync(string email, string otp)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"]);
                var smtpUsername = emailSettings["SmtpUsername"];
                var smtpPassword = emailSettings["SmtpPassword"];
                var fromAddress = emailSettings["FromAddress"];
                var fromName = emailSettings["FromName"];

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromAddress));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Your OTP Code";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #333;'>OTP Verification</h2>
                            <p>Dear User,</p>
                            <p>Your One-Time Password (OTP) for verification is:</p>
                            <div style='background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;'>
                                <h1 style='color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;'>{otp}</h1>
                            </div>
                            <p>This OTP is valid for 2 minutes. Please do not share it with anyone.</p>
                            <p>If you didn't request this OTP, please ignore this email.</p>
                            <br/>
                            <p>Best regards,<br/>Intern Attendance System Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return null; // Success - return null for no error
            }
            catch (Exception ex)
            {
                return $"Failed to send OTP email: {ex.Message}";
            }
        }

        public async Task<bool> ValidateOtpAsync(string email, string otp)
        {
            try
            {
                var cacheKey = $"OTP_{email}";
                if (!_memoryCache.TryGetValue(cacheKey, out string storedOtp))
                {
                    return false; // OTP not found or expired
                }

                if (storedOtp != otp)
                {
                    return false; // Invalid OTP
                }

                // OTP is valid, remove it from cache to prevent reuse
                _memoryCache.Remove(cacheKey);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<string?> SendPasswordResetEmailAsync(string email, string resetLink)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"]);
                var smtpUsername = emailSettings["SmtpUsername"];
                var smtpPassword = emailSettings["SmtpPassword"];
                var fromAddress = emailSettings["FromAddress"];
                var fromName = emailSettings["FromName"];

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromAddress));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Reset Your Password";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #333;'>Password Reset Request</h2>
                            <p>Dear User,</p>
                            <p>We received a request to reset your password. Click the link below to reset it:</p>
                            <div style='background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;'>
                                <a href='{resetLink}' style='color: #fff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a>
                            </div>
                            <p>This link is valid for 15 minutes. If you didn't request a password reset, please ignore this email.</p>
                            <br/>
                            <p>Best regards,<br/>Intern Attendance System Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return null; // Success
            }
            catch (Exception ex)
            {
                return $"Failed to send password reset email: {ex.Message}";
            }
        }

        public async Task<string?> SendNewInternCredentialsEmailAsync(string email, string password)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"]);
                var smtpUsername = emailSettings["SmtpUsername"];
                var smtpPassword = emailSettings["SmtpPassword"];
                var fromAddress = emailSettings["FromAddress"];
                var fromName = emailSettings["FromName"];

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromAddress));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Welcome to the Intern Attendance System!";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #333;'>Welcome!</h2>
                            <p>Dear Intern,</p>
                            <p>Your application has been approved. Welcome to the team!</p>
                            <p>Your login credentials are:</p>
                            <div style='background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;'>
                                <p><strong>Email:</strong> {email}</p>
                                <p><strong>Password:</strong> {password}</p>
                            </div>
                            <p>Please login to the system and change your password.</p>
                            <br/>
                            <p>Best regards,<br/>Intern Attendance System Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return null; // Success
            }
            catch (Exception ex)
            {
                return $"Failed to send new intern credentials email: {ex.Message}";
            }
        }

        public async Task<string?> SendApplicationFormLinkEmailAsync(string email, string applicationLink)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"]);
                var smtpUsername = emailSettings["SmtpUsername"];
                var smtpPassword = emailSettings["SmtpPassword"];
                var fromAddress = emailSettings["FromAddress"];
                var fromName = emailSettings["FromName"];

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromAddress));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Complete Your Intern Application";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #333;'>Complete Your Application</h2>
                            <p>Dear Applicant,</p>
                            <p>Thank you for verifying your email address. Please click the link below to complete your intern application:</p>
                            <div style='background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;'>
                                <a href='{applicationLink}' style='color: #fff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Complete Application</a>
                            </div>
                            <p>This link is valid for 24 hours. If you did not request this, please ignore this email.</p>
                            <br/>
                            <p>Best regards,<br/>Intern Attendance System Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return null; // Success
            }
            catch (Exception ex)
            {
                return $"Failed to send application link email: {ex.Message}";
            }
        }
        public async Task<string?> SendInterviewEmailAsync(string email, string interviewLink, DateTime interviewDate)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"]);
                var smtpUsername = emailSettings["SmtpUsername"];
                var smtpPassword = emailSettings["SmtpPassword"];
                var fromAddress = emailSettings["FromAddress"];
                var fromName = emailSettings["FromName"];

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromAddress));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Internship Interview Invitation";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #333;'>Interview Invitation</h2>
                            <p>Dear Applicant,</p>
                            <p>We are pleased to invite you for an interview for the internship position.</p>
                            <div style='background-color: #f8f9fa; padding: 20px; margin: 20px 0;'>
                                <p><strong>Date & Time:</strong> {interviewDate:f}</p>
                                <p><strong>Meeting Link:</strong> <a href='{interviewLink}'>{interviewLink}</a></p>
                            </div>
                            <p>Please make sure to join on time.</p>
                            <br/>
                            <p>Best regards,<br/>Intern Attendance System Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return null; // Success
            }
            catch (Exception ex)
            {
                return $"Failed to send interview email: {ex.Message}";
            }
        }

        public async Task<string?> SendRejectionEmailAsync(string email, string fullName)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"]);
                var smtpUsername = emailSettings["SmtpUsername"];
                var smtpPassword = emailSettings["SmtpPassword"];
                var fromAddress = emailSettings["FromAddress"];
                var fromName = emailSettings["FromName"];

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromAddress));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Update on Your Internship Application";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #333;'>Application Update</h2>
                            <p>Dear {fullName},</p>
                            <p>Thank you for your interest in the internship position and for taking the time to apply.</p>
                            <p>After careful consideration, we regret to inform you that we have decided not to proceed with your application at this time.</p>
                            <p>We appreciate your interest in our company and wish you the best in your future endeavors.</p>
                            <br/>
                            <p>Best regards,<br/>Intern Attendance System Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return null; // Success
            }
            catch (Exception ex)
            {
                return $"Failed to send rejection email: {ex.Message}";
            }
        }
    }
}