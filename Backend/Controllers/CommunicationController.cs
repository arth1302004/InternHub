using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternAttendenceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication
    public class CommunicationController : ControllerBase
    {
        private readonly ICommunicationService _communicationService;

        public CommunicationController(ICommunicationService communicationService)
        {
            _communicationService = communicationService;
        }

        [HttpPost("send")]
        public async Task<ActionResult<MessageDto>> SendMessage([FromBody] SendMessageDto sendDto)
        {
            var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var message = await _communicationService.SendMessageAsync(sendDto, senderId);
            return Ok(message);
        }

        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetHistory()
        {
            var history = await _communicationService.GetMessageHistoryAsync();
            return Ok(history);
        }

        [HttpGet("templates")]
        public async Task<ActionResult<IEnumerable<TemplateDto>>> GetTemplates()
        {
            var templates = await _communicationService.GetAllTemplatesAsync();
            return Ok(templates);
        }

        [HttpPost("templates")]
        public async Task<ActionResult<TemplateDto>> CreateTemplate([FromBody] CreateTemplateDto createDto)
        {
            var template = await _communicationService.CreateTemplateAsync(createDto);
            return CreatedAtAction(nameof(GetTemplates), new { id = template.TemplateId }, template);
        }

        [HttpPut("templates/{id}")]
        public async Task<ActionResult<TemplateDto>> UpdateTemplate(Guid id, [FromBody] UpdateTemplateDto updateDto)
        {
            var template = await _communicationService.UpdateTemplateAsync(id, updateDto);
            if (template == null) return NotFound();
            return Ok(template);
        }

        [HttpDelete("templates/{id}")]
        public async Task<IActionResult> DeleteTemplate(Guid id)
        {
            var result = await _communicationService.DeleteTemplateAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
