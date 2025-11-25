using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Common;
using Microsoft.EntityFrameworkCore;
using InternAttendenceSystem.Services.ServiceContracts;

namespace InternAttendenceSystem.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly ApplicationDbContext _context;

        public AttendanceService(ApplicationDbContext dbContext)
        {
            _context = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<IEnumerable<Attendance>> GetAllAttendance()
        {
            return await _context.attendances.ToListAsync();
        }

        public async Task<PagedList<Attendance>> GetAllAttendance(int pageNumber, int pageSize)
        {
            var source = _context.attendances.AsQueryable();
            return await System.Threading.Tasks.Task.FromResult(PagedList<Attendance>.ToPagedList(source, pageNumber, pageSize));
        }

        public async Task<Attendance?> GetAttendanceByid(Guid attendanceId, Guid internId)
        {
            return await _context.attendances
                .FirstOrDefaultAsync(e => e.AttendanceId == attendanceId && e.InternId == internId);
        }


        public async Task<PagedList<Attendance>> GetAttendanceByIntern(Guid internId, int pageNumber, int pageSize)
        {
            var source = _context.attendances.Where(e => e.InternId == internId).AsQueryable();
            return await System.Threading.Tasks.Task.FromResult(PagedList<Attendance>.ToPagedList(source, pageNumber, pageSize));
        }
        
        public async Task<Attendance> AddAttendance(Guid internId, AttendanceDto attendanceDto)
        {
            if (attendanceDto == null || string.IsNullOrEmpty(attendanceDto.status))
                throw new ArgumentException("Invalid attendance data.", nameof(attendanceDto));

            var attendanceToAdd = new Attendance
            {
                AttendanceId = Guid.NewGuid(),
                InternId = internId,
                status = attendanceDto.status,
                Date = DateTime.Today // Use DateTime.Today for date-only
            };

            try
            {
                await _context.attendances.AddAsync(attendanceToAdd);
                await _context.SaveChangesAsync();
                return attendanceToAdd;
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Failed to add attendance record.", ex);
            }
        }

        public async Task<Attendance?> UpdateAttendance(Guid internId, Guid attendanceId, AttendanceDto attendanceDto)
        {
            var attendanceToUpdate = await _context.attendances
                .FirstOrDefaultAsync(e => e.AttendanceId == attendanceId && e.InternId == internId);

            if (attendanceToUpdate == null)
                return null;

            if (string.IsNullOrEmpty(attendanceDto.status))
                throw new ArgumentException("Invalid status.", nameof(attendanceDto));

             attendanceToUpdate.status = attendanceDto.status;

            try
            {
                await _context.SaveChangesAsync();
                return attendanceToUpdate;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new InvalidOperationException("Failed to update attendance due to concurrency issue.", ex);
            }
        }

        public async Task<Attendance?> DeleteAttendance(Guid attendanceId, Guid internId)
        {
            var attendanceToDelete = await _context.attendances
                .FirstOrDefaultAsync(e => e.AttendanceId == attendanceId && e.InternId == internId);

            if (attendanceToDelete == null)
                return null;

            try
            {
                _context.attendances.Remove(attendanceToDelete);
                await _context.SaveChangesAsync();
                return attendanceToDelete;
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Failed to delete attendance record.", ex);
            }
        }

        public async Task<IEnumerable<AttendanceExportDto>> GetAttendanceForExport(DateTime? startDate, DateTime? endDate)
        {
            var query = _context.attendances.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(a => a.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(a => a.Date <= endDate.Value);

            var attendances = await query.ToListAsync();

            return attendances.Select(a => new AttendanceExportDto
            {
                Date = a.Date,
                InternName = a.InternId.ToString(),
                Status = a.status ?? "",
                CheckInTime = null,
                CheckOutTime = null,
                HoursWorked = null
            });
        }
    }
}