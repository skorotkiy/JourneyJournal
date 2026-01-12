using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for creating a route.
/// </summary>
public class CreateRouteRequest
{
    [Required]
    public int FromPointOrder { get; set; }

    [Required]
    public int ToPointOrder { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public TransportationType TransportationType { get; set; }

    [MaxLength(200)]
    public string? Carrier { get; set; }

    public DateTime? DepartureTime { get; set; }

    public DateTime? ArrivalTime { get; set; }

    public int? DurationMinutes { get; set; }

    public decimal? Cost { get; set; }

    public bool IsSelected { get; set; }

    public string? Notes { get; set; }
}
