using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Data.Entities;

/// <summary>
/// Represents lodging or accommodation at a trip point.
/// </summary>
public class Accommodation
{
    /// <summary>
    /// Primary key.
    /// </summary>
    public int AccommodationId { get; set; }

    /// <summary>
    /// Foreign key to TripPoint.
    /// </summary>
    [Required]
    public int TripPointId { get; set; }

    /// <summary>
    /// Accommodation name.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Type of accommodation (Hotel, Airbnb, etc.).
    /// </summary>
    [Required]
    public AccommodationType AccommodationType { get; set; }

    /// <summary>
    /// Full address.
    /// </summary>
    [MaxLength(500)]
    public string? Address { get; set; }

    /// <summary>
    /// Check-in date and time.
    /// </summary>
    public DateTime? CheckInDate { get; set; }

    /// <summary>
    /// Check-out date and time.
    /// </summary>
    public DateTime? CheckOutDate { get; set; }

    /// <summary>
    /// Website URL.
    /// </summary>
    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    /// <summary>
    /// Total accommodation cost.
    /// </summary>
    public decimal? Cost { get; set; }

    /// <summary>
    /// Booking status (Planned, Confirmed, Paid, etc.).
    /// </summary>
    [Required]
    public AccommodationStatus Status { get; set; }

    /// <summary>
    /// Additional notes or special requirements (Email, PhoneNumber, ConfirmationNumber).
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
    /// Parent trip point.
    /// </summary>
    public TripPoint TripPoint { get; set; } = null!;
}
