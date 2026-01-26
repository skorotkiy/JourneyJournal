using JourneyJournal.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace JourneyJournal.Api.DTOs.Inputs;

public class UpdateAccommodationRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required]
    public AccommodationType AccommodationType { get; set; }
    public string? Address { get; set; }
    [Required]
    public string CheckInDate { get; set; } = string.Empty;
    [Required]
    public string CheckOutDate { get; set; } = string.Empty;
    public string? WebsiteUrl { get; set; }
    [Required]
    public decimal Cost { get; set; }
    [Required]
    public AccommodationStatus Status { get; set; }
    public string? Notes { get; set; }
}
