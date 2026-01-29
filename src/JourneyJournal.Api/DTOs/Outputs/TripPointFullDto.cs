namespace JourneyJournal.Api.DTOs.Outputs;

/// <summary>
/// Data transfer object for TripPoint entity (full, with relations).
/// </summary>
public class TripPointFullDto : TripPointDto
{
    public List<AccommodationDto> Accommodations { get; set; } = new();
    public List<RouteDto> RoutesFrom { get; set; } = new();
    public List<RouteDto> RoutesTo { get; set; } = new();
    public List<PlaceToVisitDto> PlacesToVisit { get; set; } = new();
}
