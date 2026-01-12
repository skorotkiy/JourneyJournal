using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Data.Entities;

/// <summary>
/// Tracks additional trip expenses with categorization.
/// </summary>
public class Expense
{
    /// <summary>
    /// Primary key.
    /// </summary>
    public int ExpenseId { get; set; }

    /// <summary>
    /// Foreign key to Trip.
    /// </summary>
    [Required]
    public int TripId { get; set; }

    /// <summary>
    /// Expense description.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Expense category (Transportation, Food, etc.).
    /// </summary>
    [Required]
    public ExpenseCategory Category { get; set; }

    /// <summary>
    /// Expense amount.
    /// </summary>
    [Required]
    public decimal Amount { get; set; }

    /// <summary>
    /// Date of expense.
    /// </summary>
    [Required]
    public DateTime ExpenseDate { get; set; }

    /// <summary>
    /// Payment method (Cash, Credit Card).
    /// </summary>
    [Required]
    public PaymentMethod PaymentMethod { get; set; }

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
}
