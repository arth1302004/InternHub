using InternAttendenceSystem.Models;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentsController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        /// <summary>
        /// Upload a new document
        /// </summary>
        [HttpPost("upload")]
        public async Task<ActionResult<DocumentDto>> UploadDocument([FromForm] IFormFile file, [FromForm] string category, [FromForm] string? description, [FromForm] bool isPublic = false)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var uploadedBy))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var metadata = new UploadDocumentDto
                {
                    Category = category,
                    Description = description,
                    IsPublic = isPublic
                };

                var document = await _documentService.UploadDocument(file, metadata, uploadedBy);
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error uploading document", error = ex.Message });
            }
        }

        /// <summary>
        /// Download a document
        /// </summary>
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadDocument(Guid id)
        {
            try
            {
                var result = await _documentService.DownloadDocument(id);
                if (result == null)
                {
                    return NotFound(new { message = "Document not found" });
                }

                return File(result.Value.fileBytes, result.Value.contentType, result.Value.fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error downloading document", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all documents
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<DocumentDto>>> GetAllDocuments()
        {
            try
            {
                var documents = await _documentService.GetAllDocuments();
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving documents", error = ex.Message });
            }
        }

        /// <summary>
        /// Get document by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentDto>> GetDocumentById(Guid id)
        {
            try
            {
                var document = await _documentService.GetDocumentById(id);
                if (document == null)
                {
                    return NotFound(new { message = "Document not found" });
                }
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving document", error = ex.Message });
            }
        }

        /// <summary>
        /// Get documents by category
        /// </summary>
        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<DocumentDto>>> GetDocumentsByCategory(string category)
        {
            try
            {
                var documents = await _documentService.GetDocumentsByCategory(category);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving documents", error = ex.Message });
            }
        }

        /// <summary>
        /// Get document statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<DocumentStatsDto>> GetDocumentStats()
        {
            try
            {
                var stats = await _documentService.GetDocumentStats();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving statistics", error = ex.Message });
            }
        }

        /// <summary>
        /// Update document metadata
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<DocumentDto>> UpdateDocument(Guid id, [FromBody] UpdateDocumentDto updateDto)
        {
            try
            {
                var document = await _documentService.UpdateDocument(id, updateDto);
                if (document == null)
                {
                    return NotFound(new { message = "Document not found" });
                }
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating document", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete document
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDocument(Guid id)
        {
            try
            {
                var result = await _documentService.DeleteDocument(id);
                if (!result)
                {
                    return NotFound(new { message = "Document not found" });
                }
                return Ok(new { message = "Document deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting document", error = ex.Message });
            }
        }

        /// <summary>
        /// Share document with users
        /// </summary>
        [HttpPost("{id}/share")]
        public async Task<ActionResult> ShareDocument(Guid id, [FromBody] List<Guid> userIds)
        {
            try
            {
                var result = await _documentService.ShareDocument(id, userIds);
                if (!result)
                {
                    return NotFound(new { message = "Document not found" });
                }
                return Ok(new { message = "Document shared successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sharing document", error = ex.Message });
            }
        }
    }
}
