using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IAdminService
    {
        public Task<Admin> AddAdmin(AdminDto admin);

        public Task<Admin> GetAdminById(Guid adminId);
    }
}
