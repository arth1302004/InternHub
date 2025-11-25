using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Mvc;

namespace InternAttendenceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public InterviewController(IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InterviewDto>>> GetAllInterviews()
        {
            var interviews = await _interviewService.GetAllInterviewsAsync();
            return Ok(interviews);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InterviewDto>> GetInterviewById(Guid id)
        {
            var interview = await _interviewService.GetInterviewByIdAsync(id);
            if (interview == null)
            {
                return NotFound();
            }
            return Ok(interview);
        }

        [HttpGet("application/{applicationId}")]
        public async Task<ActionResult<IEnumerable<InterviewDto>>> GetInterviewsByApplicationId(Guid applicationId)
        {
            var interviews = await _interviewService.GetInterviewsByApplicationIdAsync(applicationId);
            return Ok(interviews);
        }

        [HttpPost]
        public async Task<ActionResult<InterviewDto>> CreateInterview([FromBody] CreateInterviewDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var interview = await _interviewService.CreateInterviewAsync(createDto);
            return CreatedAtAction(nameof(GetInterviewById), new { id = interview.InterviewId }, interview);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<InterviewDto>> UpdateInterview(Guid id, [FromBody] UpdateInterviewDto updateDto)
        {
            var interview = await _interviewService.UpdateInterviewAsync(id, updateDto);
            if (interview == null)
            {
                return NotFound();
            }
            return Ok(interview);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInterview(Guid id)
        {
            var result = await _interviewService.DeleteInterviewAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
