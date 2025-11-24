using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class Login
    {
        [Key]
        public Guid LoginId { get; set; }

        [Required]
        public Guid UserId { get; set; } 
        public required string password { get; set; }
        public required string username { get; set; }
        public required string  Role { get; set; } 

        public string? Email { get; set; }

        public string? PasswordResetToken { get; set; }

        public DateTime? ResetTokenExpiry { get; set; }

        public DateTime LoginDate { get; set; } 

        public int FailedLoginAttempts { get; set; }

        public DateTime? LockoutEndDate { get; set; } 
    }
}
