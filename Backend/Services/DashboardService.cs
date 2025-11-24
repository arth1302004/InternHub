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
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStats()
        {
            var stats = new DashboardStatsDto
            {
                ActiveInterns = await GetActiveInternsCount(),
                ActiveInternsChange = await GetActiveInternsChange(),
                PendingApplications = await GetPendingApplicationsCount(),
                PendingApplicationsChange = await GetPendingApplicationsChange(),
                CompletedTasks = await GetCompletedTasksCount(),
                CompletedTasksChange = await GetCompletedTasksChange(),
                AveragePerformance = await GetAveragePerformance(),
                AveragePerformanceChange = await GetAvgPerformanceChange()
            };
            return stats;
        }

        public async Task<int> GetActiveInternsCount()
        {
            return await _context.intern.CountAsync(i => i.internshipStatus == "active");
        }

        public async Task<int> GetPendingApplicationsCount()
        {
            return await _context.Applications.CountAsync(a => a.Status == "submitted");
        }

        public async Task<int> GetCompletedTasksCount()
        {
            return await _context.tasks.CountAsync(t => t.status == "completed");
        }

        public async Task<List<ActivityDto>> GetRecentActivities()
        {
            var activities = new List<ActivityItem>();

            // Task status changes
            var taskActivities = await _context.tasks
                .Include(t => t.InternTasks)
                    .ThenInclude(it => it.Intern)
                .OrderByDescending(t => t.lastModifiedDate)
                .Take(5) // Get recent tasks
                .ToListAsync();

            foreach (var task in taskActivities)
            {
                foreach (var internTask in task.InternTasks)
                {
                    activities.Add(new ActivityItem
                    {
                        Description = $"{internTask.Intern.name} changed task {task.taskName}'s status to {task.status}",
                        Timestamp = task.lastModifiedDate.ToUniversalTime()
                    });
                }
            }

            // New applications and hiring updates
            var applicationActivities = await _context.Applications
                .OrderByDescending(a => a.applicationDate)
                .Take(5) // Get recent applications
                .ToListAsync();

            foreach (var app in applicationActivities)
            {
                if (app.Status == "submitted")
                {
                    activities.Add(new ActivityItem
                    {
                        Description = $"{app.FullName} applied for {app.InternshipRole}",
                        Timestamp = app.applicationDate.ToUniversalTime()
                    });
                }
                else if (app.Status == "hired")
                {
                    activities.Add(new ActivityItem
                    {
                        Description = $"{app.FullName} is hired",
                        Timestamp = app.applicationDate.ToUniversalTime()
                    });
                }
            }

            // Attendance clock-ins
            var attendanceActivities = await _context.attendances
                .Include(a => a.intern)
                .OrderByDescending(a => a.clockInTime)
                .Take(5) // Get recent attendances
                .ToListAsync();

            foreach (var attendance in attendanceActivities)
            {
                activities.Add(new ActivityItem
                {
                    Description = $"{attendance.intern.name} has clocked in",
                    Timestamp = attendance.clockInTime.ToUniversalTime()
                });
            }

            // Order all activities by date (most recent first) and take the top 5
            return activities.OrderByDescending(a => a.Timestamp)
                             .Take(5)
                             .Select(a => new ActivityDto { Description = a.Description, Timestamp = a.Timestamp.ToString("o") })
                             .ToList();
        }

        public async Task<List<UpcomingDeadlineItemDto>> GetUpcomingDeadlines()
        {
            var upcomingTasks = await _context.tasks
                .Include(t => t.InternTasks)
                    .ThenInclude(it => it.Intern)
                .Where(t => t.status != "Completed" && t.dueDate >= DateTime.UtcNow)
                .OrderBy(t => t.dueDate)
                .Take(5)
                .ToListAsync();

            var deadlineItems = new List<UpcomingDeadlineItemDto>();
            foreach (var task in upcomingTasks)
            {
                var internName = task.InternTasks.Any() ? task.InternTasks.First().Intern.name : "Unassigned";

                deadlineItems.Add(new UpcomingDeadlineItemDto
                {
                    TaskName = task.taskName,
                    InternName = internName,
                    DueDate = task.dueDate.ToUniversalTime(),
                    Priority = task.priority
                });
            }
            return deadlineItems;
        }

        private class ActivityItem
        {
            public string Description { get; set; }
            public DateTime Timestamp { get; set; }
        }

        public async Task<string> GetActiveInternsChange()
        {
            var now = DateTime.UtcNow;
            var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

            var newInternsThisMonth = await _context.intern
                .CountAsync(i => i.internshipStatus == "active" && i.joiningDate >= firstDayOfMonth);

            return $"+{newInternsThisMonth} this month";
        }

        public async Task<string> GetPendingApplicationsChange()
        {
            var today = DateTime.UtcNow.Date;

            var newApplicationsToday = await _context.Applications
                .CountAsync(a => a.Status == "submitted" && a.applicationDate.Date == today);

            return $"+{newApplicationsToday} new today";
        }

        public async Task<string> GetCompletedTasksChange()
        {
            var now = DateTime.UtcNow;
            var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);

            var completedTasksThisWeek = await _context.tasks
                .CountAsync(t => t.status == "completed" && t.lastModifiedDate >= startOfWeek && t.lastModifiedDate < endOfWeek);

            return $"+{completedTasksThisWeek} this week";
        }
        
        private async Task<double> GetAveragePerformance()
        {
            var performances = await _context.tasks
                .Where(t => t.performance > 0)
                .Select(t => t.performance)
                .ToListAsync();

            return performances.Any() ? performances.Average() ?? 0 : 0;
        }


        public async Task<string> GetAvgPerformanceChange()
        {
            var now = DateTime.UtcNow;
            var firstDayOfCurrentMonth = new DateTime(now.Year, now.Month, 1);
            var firstDayOfLastMonth = firstDayOfCurrentMonth.AddMonths(-1);
            var lastDayOfLastMonth = firstDayOfCurrentMonth.AddDays(-1);

            var currentMonthPerformance = await _context.tasks
                .Where(t => t.lastModifiedDate >= firstDayOfCurrentMonth && t.performance > 0)
                .Select(t => t.performance)
                .ToListAsync();

            var lastMonthPerformance = await _context.tasks
                .Where(t => t.lastModifiedDate >= firstDayOfLastMonth && t.lastModifiedDate <= lastDayOfLastMonth && t.performance > 0)
                .Select(t => t.performance)
                .ToListAsync();

            var currentAvg = currentMonthPerformance.Any() ? currentMonthPerformance.Average() : 0;
            var lastAvg = lastMonthPerformance.Any() ? lastMonthPerformance.Average() : 0;

            var change = currentAvg - lastAvg;

            return $"{change:+#.##;-#.##;+0.0} from last month";
        }
    }
}
