using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;

namespace InternAttendenceSystem.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly ApplicationDbContext _context;

        public InterviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InterviewDto>> GetAllInterviewsAsync()
        {
            var interviews = await _context.Interviews
                .OrderByDescending(i => i.Date)
                .ThenByDescending(i => i.Time)
                .ToListAsync();

            return interviews.Select(MapToDto);
        }

        public async Task<InterviewDto> GetInterviewByIdAsync(Guid id)
        {
            var interview = await _context.Interviews.FindAsync(id);
            return interview == null ? null : MapToDto(interview);
        }

        public async Task<IEnumerable<InterviewDto>> GetInterviewsByApplicationIdAsync(Guid applicationId)
        {
            var interviews = await _context.Interviews
                .Where(i => i.ApplicationId == applicationId)
                .OrderByDescending(i => i.Date)
                .ToListAsync();

            return interviews.Select(MapToDto);
        }

        public async Task<InterviewDto> CreateInterviewAsync(CreateInterviewDto createDto)
        {
            var interview = new Interview
            {
                InterviewId = Guid.NewGuid(),
                ApplicationId = createDto.ApplicationId,
                CandidateName = createDto.CandidateName,
                CandidateEmail = createDto.CandidateEmail,
                Position = createDto.Position,
                Date = createDto.Date,
                Time = createDto.Time,
                Duration = createDto.Duration,
                Type = createDto.Type,
                Location = createDto.Location,
                MeetingLink = createDto.MeetingLink,
                InterviewerName = createDto.InterviewerName,
                InterviewerEmail = createDto.InterviewerEmail,
                Status = "Scheduled",
                Notes = createDto.Notes
            };

            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();

            return MapToDto(interview);
        }

        public async Task<InterviewDto> UpdateInterviewAsync(Guid id, UpdateInterviewDto updateDto)
        {
            var interview = await _context.Interviews.FindAsync(id);
            if (interview == null) return null;

            if (updateDto.Date.HasValue) interview.Date = updateDto.Date.Value;
            if (!string.IsNullOrEmpty(updateDto.Time)) interview.Time = updateDto.Time;
            if (updateDto.Duration.HasValue) interview.Duration = updateDto.Duration.Value;
            if (!string.IsNullOrEmpty(updateDto.Type)) interview.Type = updateDto.Type;
            if (updateDto.Location != null) interview.Location = updateDto.Location;
            if (updateDto.MeetingLink != null) interview.MeetingLink = updateDto.MeetingLink;
            if (!string.IsNullOrEmpty(updateDto.Status)) interview.Status = updateDto.Status;
            if (updateDto.Notes != null) interview.Notes = updateDto.Notes;
            if (updateDto.Feedback != null) interview.Feedback = updateDto.Feedback;
            if (updateDto.Rating.HasValue) interview.Rating = updateDto.Rating.Value;

            await _context.SaveChangesAsync();

            return MapToDto(interview);
        }

        public async Task<bool> DeleteInterviewAsync(Guid id)
        {
            var interview = await _context.Interviews.FindAsync(id);
            if (interview == null) return false;

            _context.Interviews.Remove(interview);
            await _context.SaveChangesAsync();
            return true;
        }

        private static InterviewDto MapToDto(Interview interview)
        {
            return new InterviewDto
            {
                InterviewId = interview.InterviewId,
                ApplicationId = interview.ApplicationId,
                CandidateName = interview.CandidateName,
                CandidateEmail = interview.CandidateEmail,
                Position = interview.Position,
                Date = interview.Date,
                Time = interview.Time,
                Duration = interview.Duration,
                Type = interview.Type,
                Location = interview.Location,
                MeetingLink = interview.MeetingLink,
                InterviewerName = interview.InterviewerName,
                InterviewerEmail = interview.InterviewerEmail,
                Status = interview.Status,
                Notes = interview.Notes,
                Feedback = interview.Feedback,
                Rating = interview.Rating
            };
        }
    }
}
