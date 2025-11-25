using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using InternAttendenceSystem.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace InternAttendenceSystem.Services
{
    public class AdminService:IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
          this._context = context;
        }
        public async Task<Admin> AddAdmin(AdminDto admin)
        {
          if (admin == null) throw new ArgumentNullException("admin");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(admin.password);

            Admin admintoAdd = new Admin() {
                Role = "admin",
                adminId = Guid.NewGuid(),
                password = hashedPassword,
                username = admin.username,
            };
            await _context.AddAsync(admintoAdd);
            await _context.SaveChangesAsync();  

            return admintoAdd;
        }
        public async Task<Admin> GetAdminById(Guid adminId)
        {
            if (adminId == null) throw new ArgumentNullException();

            Admin admin = await _context.admins.SingleOrDefaultAsync(ValueTask => ValueTask.adminId == adminId);

            if (admin == null) throw new ArgumentException();

            return admin;

        }

        public async Task<Admin> UpdateAdmin(Guid adminId, UpdateAdminDto updateDto)
        {
            var admin = await _context.admins.FindAsync(adminId);
            if (admin == null)
            {
                throw new ArgumentException("Admin not found");
            }

            if (!string.IsNullOrEmpty(updateDto.username))
                admin.username = updateDto.username;
            
            if (!string.IsNullOrEmpty(updateDto.email))
                admin.Email = updateDto.email;
            
            if (!string.IsNullOrEmpty(updateDto.fullName))
                admin.FullName = updateDto.fullName;
            
            if (!string.IsNullOrEmpty(updateDto.ImageUrl))
                admin.ProfileImageUrl = updateDto.ImageUrl;

            await _context.SaveChangesAsync();
            return admin;
        }

    }
}
