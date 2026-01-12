using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Data.Entities;

/// <summary>
/// Represents places of interest, tourist attractions, and points to visit.
/// </summary>
public class PlaceToVisit
{
    /// <summary>
    /// Primary key.
    /// </summary>
    public int PlaceToVisitId { get; set; }

    /// <summary>
    /// Optional link to TripPoint (location).
    /// </summary>
    public int? TripPointId { get; set; }

    /// <summary>
    /// Place or attraction name.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Category of place (Museum, Park, Restaurant, etc.).
    /// </summary>
    [Required]
    public PlaceToVisitCategory Category { get; set; }

    /// <summary>
    /// Full address.
    /// </summary>
    [MaxLength(500)]
    public string? Address { get; set; }

    /// <summary>
    /// Detailed description of the place.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Entrance fee or cost.
    /// </summary>
    public decimal? Price { get; set; }

    /// <summary>
    /// Official website URL.
    /// </summary>
    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    /// <summary>
    /// Additional useful links (JSON array or comma-separated).
    /// </summary>
    [MaxLength(2000)]
    public string? UsefulLinks { get; set; }

    /// <summary>
    /// Sequential order of this place in the trip point (0-based).
    /// </summary>
    [Required]
    public short Order { get; set; }

    /// <summary>
    /// Personal rating (1-5 stars).
    /// </summary>
    public short? Rating { get; set; }

    /// <summary>
    /// Planned or actual visit date and time.
    /// </summary>
    public DateTime? VisitDate { get; set; }

    /// <summary>
    /// Visit status (Planned, Visited, Skipped).
    /// </summary>
    [Required]
    public VisitStatus VisitStatus { get; set; }

    /// <summary>
    /// Personal notes or review after visit.
    /// </summary>
    public string? AfterVisitNotes { get; set; }

    /// <summary>
    /// Record creation timestamp (UTC).
    /// </summary>
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Record last update timestamp (UTC).
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties

    /// <summary>
    /// Parent trip point (optional).
    /// </summary>
    public TripPoint? TripPoint { get; set; }
}
