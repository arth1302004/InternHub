using System.ComponentModel.DataAnnotations;

public class OtpValidationDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(4, MinimumLength = 4)]
    public string Otp { get; set; }
}