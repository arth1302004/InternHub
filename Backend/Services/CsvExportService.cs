using InternAttendenceSystem.Services.ServiceContracts;
using System.Text;

namespace InternAttendenceSystem.Services
{
    public class CsvExportService : ICsvExportService
    {
        public byte[] ExportToCsv<T>(IEnumerable<T> data, string[] headers, Func<T, string[]> rowMapper)
        {
            var csv = new StringBuilder();
            
            // Add headers
            csv.AppendLine(string.Join(",", headers.Select(EscapeCsvField)));
            
            // Add data rows
            foreach (var item in data)
            {
                var row = rowMapper(item);
                csv.AppendLine(string.Join(",", row.Select(EscapeCsvField)));
            }
            
            return Encoding.UTF8.GetBytes(csv.ToString());
        }
        
        private string EscapeCsvField(string field)
        {
            if (string.IsNullOrEmpty(field))
                return "\"\"";
            
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (field.Contains(",") || field.Contains("\"") || field.Contains("\n"))
            {
                return $"\"{field.Replace("\"", "\"\"")}\"";
            }
            
            return field;
        }
    }
}
