using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Models.Common;
using Microsoft.AspNetCore.Mvc;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IAttendanceService
    {

        public Task<PagedList<Attendance>> GetAllAttendance(int pageNumber, int pageSize);
        public Task<Attendance> GetAttendanceByid(Guid id,Guid internId);

        public Task<PagedList<Attendance>> GetAttendanceByIntern(Guid internId, int pageNumber, int pageSize);

        public Task<Attendance> AddAttendance(Guid Id,AttendanceDto attendance);

        public Task<Attendance> UpdateAttendance(Guid internid,Guid Id,AttendanceDto attendance);

        public Task<Attendance?> DeleteAttendance(Guid Id, Guid internId);
        public Task<IEnumerable<AttendanceExportDto>> GetAttendanceForExport(DateTime? startDate, DateTime? endDate);

    }
}
