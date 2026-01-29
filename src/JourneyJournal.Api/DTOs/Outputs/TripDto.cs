namespace JourneyJournal.Api.DTOs.Outputs;

/// <summary>
/// Data transfer object for Trip entity with all related data.
/// </summary>
public class TripDto
{
    public int TripId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsDefault { get; set; }
    public string? Description { get; set; }
    public decimal? PlannedCost { get; set; }
    public decimal? TotalCost { get; set; }
    public string? Currency { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<TripPointFullDto> TripPoints { get; set; } = new();
    public List<ExpenseDto> Expenses { get; set; } = new();
}
