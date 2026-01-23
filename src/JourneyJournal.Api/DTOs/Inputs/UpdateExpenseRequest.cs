using System.ComponentModel.DataAnnotations;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.DTOs.Inputs;

/// <summary>
/// Request model for updating an expense.
/// </summary>
public class UpdateExpenseRequest
{
    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public ExpenseCategory Category { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be positive")]
    public decimal Amount { get; set; }

    [Required]
    public DateTime ExpenseDate { get; set; }

    [Required]
    public PaymentMethod PaymentMethod { get; set; }

    [MaxLength(200)]
    public string? Notes { get; set; }
}
