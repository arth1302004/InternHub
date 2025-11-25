using InternAttendenceSystem.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Text.Json;
using Task = InternAttendenceSystem.Models.Entities.Task;

namespace InternAttendenceSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Login> login { get; set; }
        public DbSet<Intern> intern { get; set; }
        public DbSet<Attendance> attendances { get; set; }
        public DbSet<Admin> admins { get; set; }
        public DbSet<Task> tasks { get; set; }
        public DbSet<InternTask> InternTasks { get; set; }
        public DbSet<Application> Applications { get; set; }    
        public DbSet<ApplicationToken> ApplicationTokens { get; set; }    
        public DbSet<SecurityQuestion> SecurityQuestions { get; set; }        
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectIntern> ProjectInterns { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Interview> Interviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure many-to-many relationship with InternTask join entity
            modelBuilder.Entity<InternTask>(entity =>
            {
                entity.HasKey(it => new { it.internId, it.taskId });

                entity.HasOne(it => it.Intern)
                      .WithMany(i => i.InternTasks)
                      .HasForeignKey(it => it.internId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(it => it.Task)
                      .WithMany(t => t.InternTasks)
                      .HasForeignKey(it => it.taskId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure many-to-many relationship with ProjectIntern join entity
            modelBuilder.Entity<ProjectIntern>(entity =>
            {
                entity.HasKey(pi => pi.Id);

                entity.HasOne(pi => pi.Project)
                      .WithMany(p => p.ProjectInterns)
                      .HasForeignKey(pi => pi.ProjectId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pi => pi.Intern)
                      .WithMany()
                      .HasForeignKey(pi => pi.InternId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Application>(entity =>
            {
                entity.HasKey(a => a.applicationId);

                entity.Property(a => a.FullName).IsRequired().HasMaxLength(100);
                entity.Property(a => a.Email).IsRequired();
                entity.Property(a => a.ContactNumber).IsRequired();
                entity.Property(a => a.EnrollmentNumber).IsRequired();
                entity.Property(a => a.AgreementAccepted).IsRequired();
                entity.Property(a => a.RequestDate).IsRequired();

                // Add indexes for better performance
                entity.HasIndex(a => a.Email).IsUnique();
                entity.HasIndex(a => a.EnrollmentNumber).IsUnique();
                entity.HasIndex(a => a.RequestDate);
            });

            // Configure Task entity
            modelBuilder.Entity<Task>(entity =>
            {
                entity.HasKey(t => t.taskId);
                entity.Property(t => t.taskName).IsRequired();
                entity.Property(t => t.description).IsRequired();
                entity.Property(t => t.status).IsRequired();
                entity.Property(t => t.priority).IsRequired();

                // Configure tags as JSON conversion with value comparer
                entity.Property(t => t.tags)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                          v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null),
                          new ValueComparer<List<string>>(
                              (c1, c2) => c1.SequenceEqual(c2),
                              c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                              c => c.ToList()))
                      .HasColumnType("nvarchar(max)");
            });

            // Configure Project entity
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(p => p.ProjectId);
                entity.Property(p => p.Title).IsRequired().HasMaxLength(200);
                entity.Property(p => p.Description).IsRequired().HasMaxLength(2000);
                entity.Property(p => p.Status).IsRequired();
                entity.Property(p => p.Priority).IsRequired();

                // Configure tags as JSON conversion
                entity.Property(p => p.Tags)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                          v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null),
                          new ValueComparer<List<string>>(
                              (c1, c2) => c1.SequenceEqual(c2),
                              c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                              c => c.ToList()))
                      .HasColumnType("nvarchar(max)");
            });

            // Configure Document entity
            modelBuilder.Entity<Document>(entity =>
            {
                entity.HasKey(d => d.DocumentId);
                entity.Property(d => d.FileName).IsRequired().HasMaxLength(255);
                entity.Property(d => d.StoredFileName).IsRequired().HasMaxLength(255);
                entity.Property(d => d.FileType).IsRequired();
                entity.Property(d => d.Category).IsRequired();

                // Configure Tags as JSON conversion
                entity.Property(d => d.Tags)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                          v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null),
                          new ValueComparer<List<string>>(
                              (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                              c => c != null ? c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())) : 0,
                              c => c != null ? c.ToList() : new List<string>()))
                      .HasColumnType("nvarchar(max)");

                // Configure SharedWith as JSON conversion
                entity.Property(d => d.SharedWith)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                          v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions)null),
                          new ValueComparer<List<Guid>>(
                              (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                              c => c != null ? c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())) : 0,
                              c => c != null ? c.ToList() : new List<Guid>()))
                      .HasColumnType("nvarchar(max)");
            });

            // Configure Intern entity
            modelBuilder.Entity<Intern>(entity =>
            {
                entity.HasKey(i => i.internId);
            });
        }
    }
}