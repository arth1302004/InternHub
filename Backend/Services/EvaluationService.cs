using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services
{
    public class EvaluationService : IEvaluationService
    {
        private readonly ApplicationDbContext _context;

        public EvaluationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<EvaluationStatsDto> GetEvaluationStats()
        {
            var stats = new EvaluationStatsDto
            {
                Completed = await _context.Evaluations.CountAsync(e => e.Status == "Completed"),
                InProgress = await _context.Evaluations.CountAsync(e => e.Status == "In Progress"),
                Scheduled = await _context.Evaluations.CountAsync(e => e.Status == "Scheduled"),
                AvgRating = await _context.Evaluations.Where(e => e.Status == "Completed").AverageAsync(e => (double?)e.OverallRating) ?? 0
            };
            return stats;
        }

        public async Task<IEnumerable<EvaluationDto>> GetEvaluations(string status)
        {
            var query = _context.Evaluations.AsQueryable();

            if (!string.IsNullOrEmpty(status) && status != "All Statuses")
            {                query = query.Where(e => e.Status == status);
            }

            return await query.Select(e => new EvaluationDto
            {
                InternName = e.InternName,
                Quarter = e.Quarter,
                Status = e.Status,
                Evaluator = e.Evaluator,
                Date = e.Date.ToString("M/d/yyyy"),
                OverallRating = e.OverallRating,
                PerformanceAreas = new PerformanceAreasDto
                {
                    TechnicalSkills = e.TechnicalSkills,
                    Communication = e.Communication,
                    ProblemSolving = e.ProblemSolving
                },
                InternInitials = e.InternInitials
            }).ToListAsync();
        }
    }
}
