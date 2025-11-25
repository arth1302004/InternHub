using System.Text;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface ICsvExportService
    {
        byte[] ExportToCsv<T>(IEnumerable<T> data, string[] headers, Func<T, string[]> rowMapper);
    }
}
