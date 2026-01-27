using System.ComponentModel.DataAnnotations;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for updating a trip point.
/// </summary>
public class UpdateTripPointRequest
{
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

    public List<CreateAccommodationRequest> Accommodations { get; set; } = new();
    public List<CreatePlaceToVisitRequest> PlacesToVisit { get; set; } = new();
}