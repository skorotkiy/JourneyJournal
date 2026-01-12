using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Data.Entities;

/// <summary>
/// Represents transportation route between two trip points.
/// Supports multiple route options with selection capability.
/// </summary>
public class Route
{
    /// <summary>
    /// Primary key.
    /// </summary>
    public int RouteId { get; set; }

    /// <summary>
    /// Starting point foreign key.
    /// </summary>
    [Required]
    public int FromPointId { get; set; }

    /// <summary>
    /// Destination point foreign key.
    /// </summary>
    [Required]
    public int ToPointId { get; set; }

    /// <summary>
    /// Route name or description.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Type of transportation (Flight, Train, Car, etc.).
    /// </summary>
    [Required]
    public TransportationType TransportationType { get; set; }

    /// <summary>
    /// Carrier or company name.
    /// </summary>
    [MaxLength(200)]
    public string? Carrier { get; set; }

    /// <summary>
    /// Departure date and time.
    /// </summary>
    public DateTime? DepartureTime { get; set; }

    /// <summary>
    /// Arrival date and time.
    /// </summary>
    public DateTime? ArrivalTime { get; set; }

    /// <summary>
    /// Duration in minutes.
    /// </summary>
    public int? DurationMinutes { get; set; }

    /// <summary>
    /// Route cost.
    /// </summary>
    public decimal? Cost { get; set; }

    /// <summary>
    /// Indicates if this is the selected/preferred route option.
    /// Only one route between two points should have IsSelected = true.
    /// </summary>
    [Required]
    public bool IsSelected { get; set; }

    /// <summary>
    /// Additional route notes or directions (Flight/train/bus number).
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
    /// Starting point of the route.
    /// </summary>
    public TripPoint FromPoint { get; set; } = null!;

    /// <summary>
    /// Destination point of the route.
    /// </summary>
    public TripPoint ToPoint { get; set; } = null!;
}
