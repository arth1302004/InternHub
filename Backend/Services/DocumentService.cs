using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly ApplicationDbContext _context;
        private readonly string _uploadPath;

        public DocumentService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _uploadPath = Path.Combine(environment.WebRootPath, "uploads");
            
            // Ensure upload directory exists
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<DocumentDto> UploadDocument(IFormFile file, UploadDocumentDto metadata, Guid uploadedBy)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required");

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName);
            var storedFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(_uploadPath, storedFileName);

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create document entity
            var document = new Document
            {
                DocumentId = Guid.NewGuid(),
                FileName = file.FileName,
                StoredFileName = storedFileName,
                FileSize = file.Length,
                FileType = file.ContentType,
                Category = metadata.Category,
                Description = metadata.Description,
                UploadedBy = uploadedBy,
                UploadedDate = DateTime.UtcNow,
                Tags = metadata.Tags ?? new List<string>(),
                SharedWith = new List<Guid>(),
                IsPublic = metadata.IsPublic,
                LastModifiedDate = DateTime.UtcNow
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return await MapToDto(document);
        }

        public async Task<(byte[] fileBytes, string fileName, string contentType)?> DownloadDocument(Guid id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null) return null;

            var filePath = Path.Combine(_uploadPath, document.StoredFileName);
            if (!File.Exists(filePath)) return null;

            var fileBytes = await File.ReadAllBytesAsync(filePath);
            return (fileBytes, document.FileName, document.FileType);
        }

        public async Task<List<DocumentDto>> GetAllDocuments()
        {
            var documents = await _context.Documents
                .OrderByDescending(d => d.UploadedDate)
                .ToListAsync();

            var documentDtos = new List<DocumentDto>();
            foreach (var doc in documents)
            {
                documentDtos.Add(await MapToDto(doc));
            }
            return documentDtos;
        }

        public async Task<DocumentDto?> GetDocumentById(Guid id)
        {
            var document = await _context.Documents.FindAsync(id);
            return document == null ? null : await MapToDto(document);
        }

        public async Task<List<DocumentDto>> GetDocumentsByCategory(string category)
        {
            var documents = await _context.Documents
                .Where(d => d.Category == category)
                .OrderByDescending(d => d.UploadedDate)
                .ToListAsync();

            var documentDtos = new List<DocumentDto>();
            foreach (var doc in documents)
            {
                documentDtos.Add(await MapToDto(doc));
            }
            return documentDtos;
        }

        public async Task<DocumentDto?> UpdateDocument(Guid id, UpdateDocumentDto updateDto)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null) return null;

            if (updateDto.Description != null) document.Description = updateDto.Description;
            if (updateDto.Category != null) document.Category = updateDto.Category;
            if (updateDto.Tags != null) document.Tags = updateDto.Tags;
            if (updateDto.IsPublic.HasValue) document.IsPublic = updateDto.IsPublic.Value;

            document.LastModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await MapToDto(document);
        }

        public async Task<bool> DeleteDocument(Guid id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null) return false;

            // Delete file from disk
            var filePath = Path.Combine(_uploadPath, document.StoredFileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<DocumentStatsDto> GetDocumentStats()
        {
            var documents = await _context.Documents.ToListAsync();
            var oneWeekAgo = DateTime.UtcNow.AddDays(-7);

            var stats = new DocumentStatsDto
            {
                TotalDocuments = documents.Count,
                SharedDocuments = documents.Count(d => d.SharedWith != null && d.SharedWith.Any()),
                PublicDocuments = documents.Count(d => d.IsPublic),
                RecentDocuments = documents.Count(d => d.UploadedDate >= oneWeekAgo),
                TotalStorageUsed = documents.Sum(d => d.FileSize),
                DocumentsByCategory = documents.GroupBy(d => d.Category)
                    .ToDictionary(g => g.Key, g => g.Count()),
                DocumentsByType = documents.GroupBy(d => GetFileTypeCategory(d.FileType))
                    .ToDictionary(g => g.Key, g => g.Count())
            };

            return stats;
        }

        public async Task<bool> ShareDocument(Guid id, List<Guid> userIds)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null) return false;

            document.SharedWith = userIds;
            document.LastModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<DocumentDto> MapToDto(Document document)
        {
            var uploaderName = "Unknown";
            var uploader = await _context.intern.FindAsync(document.UploadedBy);
            if (uploader != null)
            {
                uploaderName = uploader.name;
            }
            else
            {
                var admin = await _context.admins.FindAsync(document.UploadedBy);
                if (admin != null)
                {
                    uploaderName = admin.username;
                }
            }

            return new DocumentDto
            {
                DocumentId = document.DocumentId,
                FileName = document.FileName,
                StoredFileName = document.StoredFileName,
                FileSize = document.FileSize,
                FileType = document.FileType,
                Category = document.Category,
                Description = document.Description,
                UploadedBy = document.UploadedBy,
                UploadedByName = uploaderName,
                UploadedDate = document.UploadedDate,
                Version = document.Version,
                ParentDocumentId = document.ParentDocumentId,
                IsLatestVersion = document.IsLatestVersion,
                Tags = document.Tags ?? new List<string>(),
                SharedWith = document.SharedWith ?? new List<Guid>(),
                IsPublic = document.IsPublic,
                LastModifiedDate = document.LastModifiedDate,
                DownloadUrl = $"/api/documents/download/{document.DocumentId}"
            };
        }

        private string GetFileTypeCategory(string mimeType)
        {
            if (mimeType.Contains("pdf")) return "pdf";
            if (mimeType.Contains("word") || mimeType.Contains("document")) return "doc";
            if (mimeType.Contains("image")) return "image";
            if (mimeType.Contains("spreadsheet") || mimeType.Contains("excel")) return "spreadsheet";
            if (mimeType.Contains("text")) return "text";
            return "other";
        }
    }
}
