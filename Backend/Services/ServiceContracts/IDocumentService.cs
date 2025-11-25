using InternAttendenceSystem.Models;
using Microsoft.AspNetCore.Http;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IDocumentService
    {
        Task<DocumentDto> UploadDocument(IFormFile file, UploadDocumentDto metadata, Guid uploadedBy);
        Task<(byte[] fileBytes, string fileName, string contentType)?> DownloadDocument(Guid id);
        Task<List<DocumentDto>> GetAllDocuments();
        Task<DocumentDto?> GetDocumentById(Guid id);
        Task<List<DocumentDto>> GetDocumentsByCategory(string category);
        Task<DocumentDto?> UpdateDocument(Guid id, UpdateDocumentDto updateDto);
        Task<bool> DeleteDocument(Guid id);
        Task<DocumentStatsDto> GetDocumentStats();
        Task<bool> ShareDocument(Guid id, List<Guid> userIds);
    }
}
