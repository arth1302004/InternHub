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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Remove the one-to-many configuration
            // modelBuilder.Entity<Task>()
            //     .HasOne(t => t.Intern)
            //     .WithMany(i => i.Tasks)
            //     .HasForeignKey(t => t.internId)
            //     .OnDelete(DeleteBehavior.Cascade);

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

                // Configure tags as JSON conversion
                entity.Property(t => t.tags)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                          v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null))
                      .HasColumnType("nvarchar(max)");
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
            // Configure Intern entity
            modelBuilder.Entity<Intern>(entity =>
            {
                entity.HasKey(i => i.internId);
            });
        }
    }
}