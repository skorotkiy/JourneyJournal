using System.ComponentModel.DataAnnotations;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for creating a trip point.
/// </summary>
public class CreateTripPointRequest
{
    [Required]
    public int TripId { get; set; }
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int Order { get; set; }

    [Required]
    public DateTime ArrivalDate { get; set; }

    [Required]
    public DateTime DepartureDate { get; set; }

    public string? Notes { get; set; }

}
