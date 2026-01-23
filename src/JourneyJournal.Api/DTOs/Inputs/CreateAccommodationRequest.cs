using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for creating an accommodation.
/// </summary>
public class CreateAccommodationRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public AccommodationType AccommodationType { get; set; }

    [MaxLength(500)]
    public string? Address { get; set; }

    [Required]
    public DateTime CheckInDate { get; set; }

    [Required]
    public DateTime CheckOutDate { get; set; }

    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    [Required]
    public decimal Cost { get; set; }

    [Required]
    public AccommodationStatus Status { get; set; }

    public string? Notes { get; set; }
}
