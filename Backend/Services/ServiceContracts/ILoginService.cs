using InternAttendenceSystem.Models;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface ILoginService
    {
        Task<LoginResponse?> GenerateToken(LoginDto loginCreds);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<bool> VerifyPasswordAsync(Guid userId, string password);
    }
}