using System;
using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models.Entities
{
    public class SecurityQuestion
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string QuestionText { get; set; }
    }
}
