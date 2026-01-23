using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Data;
using JourneyJournal.Data.Entities;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JourneyJournal.Api.Services;

/// <summary>
/// Application service for managing trip expenses.
/// Handles expense-related operations and summary reporting.
/// </summary>
public class ExpenseService
{
    private readonly JourneyJournalDbContext _context;
    private readonly IMapper _mapper;
    private readonly TripService _tripService;

    public ExpenseService(JourneyJournalDbContext context, IMapper mapper, TripService tripService)
    {
        _context = context;
        _mapper = mapper;
        _tripService = tripService;
    }

    /// <summary>
    /// Retrieves all expenses for a specific trip.
    /// </summary>
    public async Task<List<ExpenseDto>> GetExpensesByTripIdAsync(int tripId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.TripId == tripId)
            .OrderByDescending(e => e.ExpenseDate)
            .ToListAsync();

        return _mapper.Map<List<ExpenseDto>>(expenses);
    }

    /// <summary>
    /// Retrieves a specific expense by ID.
    /// </summary>
    public async Task<ExpenseDto?> GetExpenseByIdAsync(int expenseId)
    {
        var expense = await _context.Expenses.FindAsync(expenseId);

        return expense is not null ? _mapper.Map<ExpenseDto>(expense) : null;
    }

    /// <summary>
    /// Creates a new expense for a trip.
    /// </summary>
    public async Task<ExpenseDto> CreateExpenseAsync(int tripId, CreateExpenseRequest request)
    {
        // Verify trip exists
        var tripExists = await _context.Trips.AnyAsync(t => t.TripId == tripId);
        if (!tripExists)
        {
            throw new KeyNotFoundException($"Trip with ID {tripId} not found");
        }

        ValidateExpenseAmount(request.Amount);

        var expense = new Expense
        {
            TripId = tripId,
            Description = request.Description,
            Category = request.Category,
            Amount = request.Amount,
            ExpenseDate = request.ExpenseDate,
            PaymentMethod = request.PaymentMethod,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        await _tripService.RecalculateTripTotalCostAsync(tripId);

        return _mapper.Map<ExpenseDto>(expense);
    }

    /// <summary>
    /// Updates an existing expense.
    /// </summary>
    public async Task<ExpenseDto> UpdateExpenseAsync(int expenseId, UpdateExpenseRequest request)
    {
        var expense = await _context.Expenses.FindAsync(expenseId);

        if (expense is null)
        {
            throw new KeyNotFoundException($"Expense with ID {expenseId} not found");
        }

        ValidateExpenseAmount(request.Amount);

        expense.Description = request.Description;
        expense.Category = request.Category;
        expense.Amount = request.Amount;
        expense.ExpenseDate = request.ExpenseDate;
        expense.PaymentMethod = request.PaymentMethod;
        expense.Notes = request.Notes;
        expense.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        await _tripService.RecalculateTripTotalCostAsync(expense.TripId);

        return _mapper.Map<ExpenseDto>(expense);
    }

    /// <summary>
    /// Deletes an expense.
    /// </summary>
    public async Task<bool> DeleteExpenseAsync(int expenseId)
    {
        var expense = await _context.Expenses.FindAsync(expenseId);

        if (expense is null)
        {
            return false;
        }

        var tripId = expense.TripId;

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        await _tripService.RecalculateTripTotalCostAsync(tripId);

        return true;
    }

    /// <summary>
    /// Calculates total expenses for a trip by category.
    /// </summary>
    public async Task<Dictionary<string, decimal>> GetExpenseSummaryByTripIdAsync(int tripId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.TripId == tripId)
            .GroupBy(e => e.Category)
            .Select(g => new { Category = g.Key.ToString(), Total = g.Sum(e => e.Amount) })
            .ToListAsync();

        return expenses.ToDictionary(e => e.Category, e => e.Total);
    }

    // Private helper methods

    private static void ValidateExpenseAmount(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Expense amount must be positive");
        }
    }
}
