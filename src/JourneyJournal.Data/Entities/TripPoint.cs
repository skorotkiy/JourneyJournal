using System.ComponentModel.DataAnnotations;

namespace JourneyJournal.Data.Entities;

/// <summary>
/// Represents a location in the trip (start, intermediate stops, or destination).
/// </summary>
public class TripPoint
{
    /// <summary>
    /// Primary key.
    /// </summary>
    public int TripPointId { get; set; }

    /// <summary>
    /// Foreign key to Trip.
    /// </summary>
    [Required]
    public int TripId { get; set; }

    /// <summary>
    /// Location or city name.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Sequential order of this point in the trip (0-based).
    /// </summary>
    [Required]
    public int Order { get; set; }

    /// <summary>
    /// Arrival date to this point.
    /// </summary>
    [Required]
    public DateTime ArrivalDate { get; set; }

    /// <summary>
    /// Departure date from this point.
    /// </summary>
    [Required]
    public DateTime DepartureDate { get; set; }

    /// <summary>
    /// Additional notes about this point.
    /// </summary>
    public string? Notes { get; set; }

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
    /// Parent trip.
    /// </summary>
    public Trip Trip { get; set; } = null!;

    /// <summary>
    /// Collection of accommodations at this point.
    /// </summary>
    public ICollection<Accommodation> Accommodations { get; set; } = new List<Accommodation>();

    /// <summary>
    /// Collection of routes starting from this point.
    /// </summary>
    public ICollection<Route> RoutesFrom { get; set; } = new List<Route>();

    /// <summary>
    /// Collection of routes ending at this point.
    /// </summary>
    public ICollection<Route> RoutesTo { get; set; } = new List<Route>();

    /// <summary>
    /// Collection of places to visit at this point.
    /// </summary>
    public ICollection<PlaceToVisit> PlacesToVisit { get; set; } = new List<PlaceToVisit>();
}
