using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class Admin
    {
        [Required]
        [Key]
        public Guid adminId { get; set; }
        public required string password { get; set; }
        public required string username { get; set; }
        public required string Role { get; set; }
    }
}
