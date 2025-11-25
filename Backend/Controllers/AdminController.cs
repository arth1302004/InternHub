using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace InternAttendenceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminservice) {

            _adminService = adminservice;
        }

        [HttpPost]

        public async Task<ActionResult<Admin>> AddAdmin([FromBody] AdminDto adminToAdd)
        {
            if (adminToAdd == null) { return BadRequest(); }

            Admin addedAddmin = await _adminService.AddAdmin(adminToAdd);

            return Ok(addedAddmin);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Admin>> GetAdminById([FromRoute] Guid id)
        {
            Admin admin = await _adminService.GetAdminById(id);

            if (admin == null)
            {
                return BadRequest("admin not found.");
            }
            return Ok(admin);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Admin>> UpdateAdmin([FromRoute] Guid id, [FromForm] UpdateAdminRequest request, [FromServices] IWebHostEnvironment environment)
        {
            var existingAdmin = await _adminService.GetAdminById(id);
            if (existingAdmin == null)
            {
                return NotFound("Admin not found");
            }

            string imageUrl = existingAdmin.ProfileImageUrl;

            if (request.profilePic != null && request.profilePic.Length > 0)
            {
                var uploadsFolder = Path.Combine(environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                if (!string.IsNullOrEmpty(existingAdmin.ProfileImageUrl))
                {
                    var oldFilePath = Path.Combine(uploadsFolder, Path.GetFileName(existingAdmin.ProfileImageUrl));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(request.profilePic.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.profilePic.CopyToAsync(stream);
                }

                imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}";
            }

            var updateDto = new UpdateAdminDto
            {
                username = request.username,
                email = request.email,
                fullName = request.fullName,
                ImageUrl = imageUrl
            };

            var updatedAdmin = await _adminService.UpdateAdmin(id, updateDto);
            return Ok(updatedAdmin);
        }

    }
}
