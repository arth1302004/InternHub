using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Models.Common;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InternAttendenceSystem.Controllers
{

    [AllowAnonymous]
    [ApiController]
    [Route("api/attendance")]
    public class AttendancesController : ControllerBase
    {
        private readonly IAttendanceService attendanceService;
        public AttendancesController(IAttendanceService attendanceService)
        {
            this.attendanceService = attendanceService;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllAttendance([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var pagedAttendances = await attendanceService.GetAllAttendance(pageNumber, pageSize);
            
            // Explicitly return an anonymous object with PagedList properties
            return Ok(new {
                currentPage = pagedAttendances.CurrentPage,
                totalPages = pagedAttendances.TotalPages,
                pageSize = pagedAttendances.PageSize,
                totalCount = pagedAttendances.TotalCount,
                hasPrevious = pagedAttendances.HasPrevious,
                hasNext = pagedAttendances.HasNext,
                items = pagedAttendances.Items
            });
        }

        [HttpGet("{internId:guid}/{id:guid}")]

        public async Task<IActionResult> GetAttendanceById([FromRoute] Guid internId, [FromRoute] Guid id)
        {
            Attendance attendance = await attendanceService.GetAttendanceByid(internId, id);
            if (attendance == null)
            {
                return NotFound();
            }
            return Ok(attendance);
        }
        [Authorize(Roles = "intern")]
        [HttpPost("{internId:guid}")]
        public async Task<IActionResult> AddAttendance([FromRoute] Guid internId, [FromBody] AttendanceDto attendanceDto)
        {
   /*         if (ModelState.IsValid)
            {
                return BadRequest();
            }
            if (attendanceDto == null)
            {
                return BadRequest("data is either invalid or not entered, please try again.");
            }*/

            Attendance attendance = await attendanceService.AddAttendance(internId, attendanceDto);
            return Ok(attendance);

        }

        [HttpGet("{internId:guid}")]
        public async Task<IActionResult> GetAttendanceByIntern([FromRoute] Guid internId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var pagedAttendances = await attendanceService.GetAttendanceByIntern(internId, pageNumber, pageSize);

            if (pagedAttendances == null) // Check if the PagedList itself is null
            {
                return NotFound();
            }

            // Explicitly return an anonymous object with PagedList properties
            return Ok(new {
                currentPage = pagedAttendances.CurrentPage,
                totalPages = pagedAttendances.TotalPages,
                pageSize = pagedAttendances.PageSize,
                totalCount = pagedAttendances.TotalCount,
                hasPrevious = pagedAttendances.HasPrevious,
                hasNext = pagedAttendances.HasNext,
                items = pagedAttendances.Items
            });
        }
        [Authorize(Roles ="admin")]
        [HttpPut("{internId:guid}/{id:guid}")]
        public async Task<IActionResult> UpdateAttendance([FromRoute] Guid internId, [FromRoute] Guid id, [FromBody] AttendanceDto updateAttendanceDto)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest();

            }

            if(updateAttendanceDto == null || updateAttendanceDto.status == null || updateAttendanceDto.status == "")
            {
                return BadRequest("invalid status , please try again");
            }

            Attendance updatedAttendance = await attendanceService.UpdateAttendance(internId,id,updateAttendanceDto);

            if(updatedAttendance == null) { 
            
                return NotFound();
            }

            return Ok(updatedAttendance);

        }
        [Authorize(Roles = "admin")]
        [HttpDelete("{internId:guid}/{id:guid}")]
        public async Task<IActionResult> DeleteAttendance([FromRoute] Guid internId, [FromRoute] Guid id)
        {
            var deletedAttendance = await attendanceService.DeleteAttendance(id, internId);

            if (deletedAttendance == null)
            {
                return NotFound($"No attendance found for intern {internId} with ID {id}.");
            }

            return Ok(deletedAttendance);
        }


    }
}
