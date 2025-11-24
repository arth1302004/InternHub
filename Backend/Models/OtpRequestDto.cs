using System.ComponentModel.DataAnnotations;

public class OtpRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}

