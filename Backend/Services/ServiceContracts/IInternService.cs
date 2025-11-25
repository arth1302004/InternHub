using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Models.Common;
using Microsoft.AspNetCore.Mvc;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IInternService
    {
        public Task<IEnumerable<Intern>> GetAllInterns();
        Task<PagedList<Intern>> GetAllInterns(int pageNumber, int pageSize, string searchString, string sortBy, string sortOrder, string department, string status);
        public Task<Intern> GetInternById(Guid id);

        public Task<Intern> DeleteIntern(Guid Id);

        public Task<Intern> UpdateIntern(Guid id, UpdateInternDto internDto);

        public Task<bool> IsEmailAlreadyRegisteredAsync(string email);

        public Task<bool> ResetPassword(Guid internId, ResetPasswordDto resetPassword);

        public Task<bool> VerifyPassword(Guid internId, VerifyPasswordDto VerifyPassword);

        public Task<bool> SetSecurityQuestions(Guid internId, SetSecurityQuestionsDto questionsDto);
        public Task<List<SecurityQuestionDto>> GetSecurityQuestions(Guid internId);
        public Task<object> VerifySecurityQuestions(VerifySecurityQuestionsDto questionsDto);

        public System.Threading.Tasks.Task AddApplicationToken(ApplicationToken token);
        public IEnumerable<ApplicationToken> GetApplicationTokensByEmail(string email);
        public void RemoveApplicationTokens(IEnumerable<ApplicationToken> tokens);

        public Task<ApplicationToken> GetApplicationToken(string token);
        public List<string> GetAllSecurityQuestions();
        public Task<IEnumerable<Intern>> GetAllInternsForExport();
    }
}
