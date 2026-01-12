using System.ComponentModel.DataAnnotations;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for creating a new trip.
/// </summary>
public class CreateTripRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsCompleted { get; set; }

    public string? Description { get; set; }

    public decimal? TotalCost { get; set; }

    [MaxLength(3)]
    public string? Currency { get; set; }

    public List<CreateTripPointRequest> TripPoints { get; set; } = new();
}
