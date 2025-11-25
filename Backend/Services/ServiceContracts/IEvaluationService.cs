using InternAttendenceSystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IEvaluationService
    {
        Task<EvaluationStatsDto> GetEvaluationStats();
        Task<IEnumerable<EvaluationDto>> GetEvaluations(string status);
        Task<IEnumerable<EvaluationExportDto>> GetAllEvaluationsForExport();
    }
}
