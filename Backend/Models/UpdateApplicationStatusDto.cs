
using System.ComponentModel.DataAnnotations;

namespace InternAttendenceSystem.Models
{
    public class UpdateApplicationStatusDto
    {
        [Required]
        public string Status { get; set; }
    }
}
