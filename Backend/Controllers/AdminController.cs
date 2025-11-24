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

    }
}
