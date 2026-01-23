using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Outputs;

/// <summary>
/// Data transfer object for Accommodation entity.
/// </summary>
public class AccommodationDto
{
    public int AccommodationId { get; set; }
    public int TripPointId { get; set; }
    public string Name { get; set; } = string.Empty;
    public AccommodationType AccommodationType { get; set; }
    public string? Address { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public string? WebsiteUrl { get; set; }
    public decimal Cost { get; set; }
    public AccommodationStatus Status { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
