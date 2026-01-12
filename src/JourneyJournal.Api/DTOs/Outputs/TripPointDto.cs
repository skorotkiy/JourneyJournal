namespace JourneyJournal.Api.DTOs.Outputs;

/// <summary>
/// Data transfer object for TripPoint entity.
/// </summary>
public class TripPointDto
{
    public int TripPointId { get; set; }
    public int TripId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public DateTime? ArrivalDate { get; set; }
    public DateTime? DepartureDate { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<AccommodationDto> Accommodations { get; set; } = new();
    public List<RouteDto> RoutesFrom { get; set; } = new();
    public List<RouteDto> RoutesTo { get; set; } = new();
    public List<PlaceToVisitDto> PlacesToVisit { get; set; } = new();
}
