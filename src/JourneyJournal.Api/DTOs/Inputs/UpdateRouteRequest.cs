using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for updating a route.
/// </summary>
public class UpdateRouteRequest
{
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