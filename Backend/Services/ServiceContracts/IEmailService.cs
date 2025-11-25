using InternAttendenceSystem.Models.Entities;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IEmailService
    {
        Task<string?> SendEmailAsync(string email);
        Task<string?> SendOtpEmailAsync(string email, string otp);

        Task<bool> ValidateOtpAsync(string email, string otp);
        Task<string?> SendPasswordResetEmailAsync(string email, string resetLink);
        Task<string?> SendNewInternCredentialsEmailAsync(string email, string password);
        Task<string?> SendApplicationFormLinkEmailAsync(string email, string applicationLink);
        Task<string?> SendInterviewEmailAsync(string email, string interviewLink, DateTime interviewDate);
        Task<string?> SendRejectionEmailAsync(string email, string fullName);
        Task<string?> SendGenericEmailAsync(string email, string subject, string body);
    }
}