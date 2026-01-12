using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for creating a place to visit.
/// </summary>
public class CreatePlaceToVisitRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public PlaceToVisitCategory Category { get; set; }

    [MaxLength(500)]
    public string? Address { get; set; }

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    [MaxLength(2000)]
    public string? UsefulLinks { get; set; }

    [Required]
    public short Order { get; set; }

    public short? Rating { get; set; }

    public DateTime? VisitDate { get; set; }

    [Required]
    public VisitStatus VisitStatus { get; set; }

    public string? AfterVisitNotes { get; set; }
}
