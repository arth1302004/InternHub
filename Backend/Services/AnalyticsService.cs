using InternAttendenceSystem.Data;
using InternAttendenceSystem.Models;
using InternAttendenceSystem.Models.Entities;
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternAttendenceSystem.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AnalyticsStatsDto> GetAnalyticsStats()
        {
            var now = DateTime.UtcNow;
            var firstDayOfCurrentMonth = new DateTime(now.Year, now.Month, 1);
            var firstDayOfLastMonth = firstDayOfCurrentMonth.AddMonths(-1);

            // Current month stats
            var activeInterns = await _context.intern.CountAsync(i => i.internshipStatus == "active");
            var lastMonthActiveInterns = await _context.intern
                .CountAsync(i => i.internshipStatus == "active" && i.joiningDate < firstDayOfCurrentMonth);

            var totalApplications = await _context.Applications.CountAsync();
            var lastMonthApplications = await _context.Applications
                .CountAsync(a => a.applicationDate < firstDayOfCurrentMonth);

            var completedTasks = await _context.tasks.CountAsync(t => t.status == "completed");
            var totalTasks = await _context.tasks.CountAsync();
            var taskCompletionRate = totalTasks > 0 ? (decimal)completedTasks / totalTasks * 100 : 0;

            var lastMonthCompletedTasks = await _context.tasks
                .CountAsync(t => t.status == "completed" && t.lastModifiedDate < firstDayOfCurrentMonth);
            var lastMonthTotalTasks = await _context.tasks
                .CountAsync(t => t.lastModifiedDate < firstDayOfCurrentMonth);
            var lastMonthTaskCompletionRate = lastMonthTotalTasks > 0 
                ? (decimal)lastMonthCompletedTasks / lastMonthTotalTasks * 100 : 0;

            var avgPerformance = await GetAveragePerformance();
            var lastMonthAvgPerformance = await GetLastMonthAveragePerformance();

            return new AnalyticsStatsDto
            {
                ActiveInterns = activeInterns,
                ActiveInternsChange = CalculatePercentageChange(activeInterns, lastMonthActiveInterns),
                AveragePerformance = avgPerformance,
                AveragePerformanceChange = avgPerformance - lastMonthAvgPerformance,
                TaskCompletionRate = taskCompletionRate,
                TaskCompletionRateChange = taskCompletionRate - lastMonthTaskCompletionRate,
                TotalApplications = totalApplications,
                ApplicationsChange = CalculatePercentageChange(totalApplications, lastMonthApplications)
            };
        }

        public async Task<List<PerformanceDataDto>> GetPerformanceTrends(int months = 6)
        {
            var result = new List<PerformanceDataDto>();
            var now = DateTime.UtcNow;

            for (int i = months - 1; i >= 0; i--)
            {
                var monthDate = now.AddMonths(-i);
                var firstDay = new DateTime(monthDate.Year, monthDate.Month, 1);
                var lastDay = firstDay.AddMonths(1).AddDays(-1);

                var monthlyTasks = await _context.tasks
                    .Where(t => t.lastModifiedDate >= firstDay && t.lastModifiedDate <= lastDay)
                    .ToListAsync();

                var monthlyApplications = await _context.Applications
                    .CountAsync(a => a.applicationDate >= firstDay && a.applicationDate <= lastDay);

                var monthlyPerformances = monthlyTasks
                    .Where(t => t.performance.HasValue && t.performance > 0)
                    .Select(t => t.performance.Value)
                    .ToList();

                var avgRating = monthlyPerformances.Any() ? (decimal)monthlyPerformances.Average() : 0;

                result.Add(new PerformanceDataDto
                {
                    Month = monthDate.ToString("MMM"),
                    Rating = Math.Round(avgRating, 1),
                    Tasks = monthlyTasks.Count,
                    Applications = monthlyApplications
                });
            }

            return result;
        }

        public async Task<List<DepartmentDistributionDto>> GetDepartmentDistribution()
        {
            var departments = await _context.intern
                .Where(i => i.internshipStatus == "active")
                .GroupBy(i => i.department)
                .Select(g => new { Department = g.Key, Count = g.Count() })
                .ToListAsync();

            var total = departments.Sum(d => d.Count);
            var colors = new[] { "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899" };

            return departments.Select((d, index) => new DepartmentDistributionDto
            {
                Name = string.IsNullOrEmpty(d.Department) ? "Unassigned" : d.Department,
                Value = total > 0 ? (int)Math.Round((double)d.Count / total * 100) : 0,
                Color = colors[index % colors.Length]
            }).ToList();
        }

        public async Task<List<TaskCompletionDataDto>> GetTaskCompletionData(int weeks = 6)
        {
            var result = new List<TaskCompletionDataDto>();
            var now = DateTime.UtcNow;

            for (int i = weeks - 1; i >= 0; i--)
            {
                var weekStart = now.AddDays(-7 * i - (int)now.DayOfWeek);
                var weekEnd = weekStart.AddDays(7);

                var weeklyTasks = await _context.tasks
                    .Where(t => t.lastModifiedDate >= weekStart && t.lastModifiedDate < weekEnd)
                    .ToListAsync();

                var completed = weeklyTasks.Count(t => t.status == "completed");

                result.Add(new TaskCompletionDataDto
                {
                    Week = $"Week {weeks - i}",
                    Completed = completed,
                    Total = weeklyTasks.Count
                });
            }

            return result;
        }

        public async Task<List<ApplicationTrendDto>> GetApplicationTrends(int months = 6)
        {
            var result = new List<ApplicationTrendDto>();
            var now = DateTime.UtcNow;

            for (int i = months - 1; i >= 0; i--)
            {
                var monthDate = now.AddMonths(-i);
                var firstDay = new DateTime(monthDate.Year, monthDate.Month, 1);
                var lastDay = firstDay.AddMonths(1).AddDays(-1);

                var monthlyApplications = await _context.Applications
                    .Where(a => a.applicationDate >= firstDay && a.applicationDate <= lastDay)
                    .ToListAsync();

                result.Add(new ApplicationTrendDto
                {
                    Month = monthDate.ToString("MMM"),
                    Applications = monthlyApplications.Count,
                    Accepted = monthlyApplications.Count(a => a.Status?.ToLower() == "hired" || a.Status?.ToLower() == "accepted"),
                    Rejected = monthlyApplications.Count(a => a.Status?.ToLower() == "rejected"),
                    Pending = monthlyApplications.Count(a => a.Status?.ToLower() == "submitted" || a.Status?.ToLower() == "pending")
                });
            }

            return result;
        }

        private async Task<decimal> GetAveragePerformance()
        {
            var performances = await _context.tasks
                .Where(t => t.performance.HasValue && t.performance > 0)
                .Select(t => t.performance.Value)
                .ToListAsync();

            return performances.Any() ? (decimal)performances.Average() : 0;
        }

        private async Task<decimal> GetLastMonthAveragePerformance()
        {
            var now = DateTime.UtcNow;
            var firstDayOfCurrentMonth = new DateTime(now.Year, now.Month, 1);
            var firstDayOfLastMonth = firstDayOfCurrentMonth.AddMonths(-1);

            var performances = await _context.tasks
                .Where(t => t.performance.HasValue && t.performance > 0 
                    && t.lastModifiedDate >= firstDayOfLastMonth 
                    && t.lastModifiedDate < firstDayOfCurrentMonth)
                .Select(t => t.performance.Value)
                .ToListAsync();

            return performances.Any() ? (decimal)performances.Average() : 0;
        }

        private decimal CalculatePercentageChange(int current, int previous)
        {
            if (previous == 0) return current > 0 ? 100 : 0;
            return Math.Round((decimal)(current - previous) / previous * 100, 1);
        }
    }
}
