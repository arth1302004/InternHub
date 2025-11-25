using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace InternAttendenceSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportController : ControllerBase
    {
        private readonly IInternService _internService;
        private readonly IAttendanceService _attendanceService;
        private readonly IEvaluationService _evaluationService;
        private readonly ICsvExportService _csvExportService;

        public ExportController(
            IInternService internService,
            IAttendanceService attendanceService,
            IEvaluationService evaluationService,
            ICsvExportService csvExportService)
        {
            _internService = internService;
            _attendanceService = attendanceService;
            _evaluationService = evaluationService;
            _csvExportService = csvExportService;
        }

        [HttpGet("interns/csv")]
        public async Task<IActionResult> ExportInternsToCsv()
        {
            var interns = await _internService.GetAllInternsForExport();
            
            var headers = new[] { "ID", "Name", "Email", "Department", "Status", "Join Date" };
            var csvData = _csvExportService.ExportToCsv(
                interns,
                headers,
                intern => new[]
                {
                    intern.internId.ToString(),
                    intern.name ?? "",
                    intern.emailAddress ?? "",
                    intern.department ?? "",
                    intern.internshipStatus ?? "",
                    DateTime.Now.ToString("yyyy-MM-dd")
                }
            );

            return File(csvData, "text/csv", $"interns_{DateTime.Now:yyyyMMdd}.csv");
        }

        [HttpGet("attendance/csv")]
        public async Task<IActionResult> ExportAttendanceToCsv([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var attendances = await _attendanceService.GetAttendanceForExport(startDate, endDate);
            
            var headers = new[] { "Date", "Intern Name", "Status", "Check In", "Check Out", "Hours Worked" };
            var csvData = _csvExportService.ExportToCsv(
                attendances,
                headers,
                attendance => new[]
                {
                    attendance.Date.ToString("yyyy-MM-dd"),
                    attendance.InternName ?? "",
                    attendance.Status ?? "",
                    attendance.CheckInTime?.ToString("HH:mm") ?? "",
                    attendance.CheckOutTime?.ToString("HH:mm") ?? "",
                    attendance.HoursWorked?.ToString("F2") ?? "0"
                }
            );

            return File(csvData, "text/csv", $"attendance_{DateTime.Now:yyyyMMdd}.csv");
        }

        [HttpGet("evaluations/csv")]
        public async Task<IActionResult> ExportEvaluationsToCsv()
        {
            var evaluations = await _evaluationService.GetAllEvaluationsForExport();
            
            var headers = new[] { "Intern Name", "Evaluator", "Score", "Comments", "Date" };
            var csvData = _csvExportService.ExportToCsv(
                evaluations,
                headers,
                eval => new[]
                {
                    eval.InternName ?? "",
                    eval.EvaluatorName ?? "",
                    eval.Score.ToString(),
                    eval.Comments ?? "",
                    eval.EvaluationDate.ToString("yyyy-MM-dd")
                }
            );

            return File(csvData, "text/csv", $"evaluations_{DateTime.Now:yyyyMMdd}.csv");
        }
    }
}
