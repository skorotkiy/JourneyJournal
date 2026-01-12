using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Outputs;

/// <summary>
/// Data transfer object for PlaceToVisit entity.
/// </summary>
public class PlaceToVisitDto
{
    public int PlaceToVisitId { get; set; }
    public int? TripPointId { get; set; }
    public string Name { get; set; } = string.Empty;
    public PlaceToVisitCategory Category { get; set; }
    public string? Address { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? UsefulLinks { get; set; }
    public short Order { get; set; }
    public short? Rating { get; set; }
    public DateTime? VisitDate { get; set; }
    public VisitStatus VisitStatus { get; set; }
    public string? AfterVisitNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
