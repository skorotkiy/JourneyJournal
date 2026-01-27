using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Outputs;

/// <summary>
/// Data transfer object for Expense entity.
/// </summary>
public class ExpenseDto
{
    public int ExpenseId { get; set; }
    public int TripId { get; set; }
    public string Description { get; set; } = string.Empty;
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public DateTime ExpenseDate { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string Currency { get; set; } = string.Empty;
}
