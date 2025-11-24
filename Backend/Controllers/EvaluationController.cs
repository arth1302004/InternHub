
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly IEvaluationService _evaluationService;

        public EvaluationController(IEvaluationService evaluationService)
        {
            _evaluationService = evaluationService;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<EvaluationStatsDto>> GetEvaluationStats()
        {
            var stats = await _evaluationService.GetEvaluationStats();
            return Ok(stats);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EvaluationDto>>> GetEvaluations([FromQuery] string status)
        {
            var evaluations = await _evaluationService.GetEvaluations(status);
            return Ok(evaluations);
        }
    }
}
