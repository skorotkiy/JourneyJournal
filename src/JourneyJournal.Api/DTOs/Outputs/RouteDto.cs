using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Outputs;

/// <summary>
/// Data transfer object for Route entity.
/// </summary>
public class RouteDto
{
    public int RouteId { get; set; }
    public int FromPointId { get; set; }
    public int ToPointId { get; set; }
    public string Name { get; set; } = string.Empty;
    public TransportationType TransportationType { get; set; }
    public string? Carrier { get; set; }
    public DateTime? DepartureTime { get; set; }
    public DateTime? ArrivalTime { get; set; }
    public int? DurationMinutes { get; set; }
    public decimal? Cost { get; set; }
    public bool IsSelected { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
