using System.ComponentModel.DataAnnotations;

namespace JourneyJournal.Data.Entities;

/// <summary>
/// Represents a complete trip (planned or completed).
/// Aggregate root for trip management.
/// </summary>
public class Trip
{
    /// <summary>
    /// Primary key.
    /// </summary>
    public int TripId { get; set; }

    /// <summary>
    /// Trip name or title.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Trip start date.
    /// </summary>
    [Required]
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Trip end date (nullable for ongoing or planned trips).
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Indicates whether the trip is completed or still planned.
    /// </summary>
    public bool IsCompleted { get; set; }

    /// <summary>
    /// General trip description.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Planned trip cost (budget).
    /// </summary>
    public decimal? PlannedCost { get; set; }

    /// <summary>
    /// Total trip cost.
    /// </summary>
    public decimal? TotalCost { get; set; }

    /// <summary>
    /// Currency code (USD, EUR, etc.).
    /// </summary>
    [MaxLength(3)]
    public string? Currency { get; set; }

    /// <summary>
    /// Indicates whether this is the default trip.
    /// </summary>
    public bool IsDefault { get; set; }

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
    /// Collection of points in this trip.
    /// </summary>
    public ICollection<TripPoint> TripPoints { get; set; } = new List<TripPoint>();

    /// <summary>
    /// Collection of expenses for this trip.
    /// </summary>
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}
