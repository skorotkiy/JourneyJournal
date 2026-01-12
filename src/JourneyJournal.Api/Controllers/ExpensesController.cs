using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace JourneyJournal.Api.Controllers;

/// <summary>
/// API controller for managing trip expenses.
/// Handles HTTP requests for expense operations.
/// </summary>
[ApiController]
[Route("api/trips/{tripId}/expenses")]
public class ExpensesController : ControllerBase
{
    private readonly ExpenseService _expenseService;
    private readonly ILogger<ExpensesController> _logger;

    public ExpensesController(ExpenseService expenseService, ILogger<ExpensesController> logger)
    {
        _expenseService = expenseService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all expenses for a specific trip.
    /// </summary>
    /// <param name="tripId">The trip ID.</param>
    /// <returns>List of expenses for the trip.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<ExpenseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ExpenseDto>>> GetExpensesByTripId(int tripId)
    {
        _logger.LogInformation("Retrieving expenses for trip {TripId}", tripId);
        var expenses = await _expenseService.GetExpensesByTripIdAsync(tripId);
        return Ok(expenses);
    }

    /// <summary>
    /// Gets expense summary by category for a trip.
    /// </summary>
    /// <param name="tripId">The trip ID.</param>
    /// <returns>Dictionary of categories and total amounts.</returns>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(Dictionary<string, decimal>), StatusCodes.Status200OK)]
    public async Task<ActionResult<Dictionary<string, decimal>>> GetExpenseSummary(int tripId)
    {
        _logger.LogInformation("Retrieving expense summary for trip {TripId}", tripId);
        var summary = await _expenseService.GetExpenseSummaryByTripIdAsync(tripId);
        return Ok(summary);
    }

    /// <summary>
    /// Gets a specific expense by ID.
    /// </summary>
    /// <param name="tripId">The trip ID.</param>
    /// <param name="expenseId">The expense ID.</param>
    /// <returns>The expense details.</returns>
    [HttpGet("{expenseId}")]
    [ProducesResponseType(typeof(ExpenseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExpenseDto>> GetExpenseById(int tripId, int expenseId)
    {
        _logger.LogInformation("Retrieving expense {ExpenseId} for trip {TripId}", expenseId, tripId);
        var expense = await _expenseService.GetExpenseByIdAsync(expenseId);

        if (expense is null || expense.TripId != tripId)
        {
            _logger.LogWarning("Expense {ExpenseId} not found for trip {TripId}", expenseId, tripId);
            return NotFound(new { message = $"Expense with ID {expenseId} not found" });
        }

        return Ok(expense);
    }

    /// <summary>
    /// Creates a new expense for a trip.
    /// </summary>
    /// <param name="tripId">The trip ID.</param>
    /// <param name="request">The expense creation request.</param>
    /// <returns>The created expense.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ExpenseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExpenseDto>> CreateExpense(int tripId, [FromBody] CreateExpenseRequest request)
    {
        _logger.LogInformation("Creating expense for trip {TripId}", tripId);

        try
        {
            var expense = await _expenseService.CreateExpenseAsync(tripId, request);
            _logger.LogInformation("Expense created successfully with ID {ExpenseId}", expense.ExpenseId);
            return CreatedAtAction(
                nameof(GetExpenseById),
                new { tripId, expenseId = expense.ExpenseId },
                expense);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Trip {TripId} not found", tripId);
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating expense");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing expense.
    /// </summary>
    /// <param name="tripId">The trip ID.</param>
    /// <param name="expenseId">The expense ID.</param>
    /// <param name="request">The expense update request.</param>
    /// <returns>The updated expense.</returns>
    [HttpPut("{expenseId}")]
    [ProducesResponseType(typeof(ExpenseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExpenseDto>> UpdateExpense(int tripId, int expenseId, [FromBody] UpdateExpenseRequest request)
    {
        _logger.LogInformation("Updating expense {ExpenseId} for trip {TripId}", expenseId, tripId);

        try
        {
            var expense = await _expenseService.UpdateExpenseAsync(expenseId, request);

            if (expense.TripId != tripId)
            {
                _logger.LogWarning("Expense {ExpenseId} does not belong to trip {TripId}", expenseId, tripId);
                return NotFound(new { message = $"Expense with ID {expenseId} not found for trip {tripId}" });
            }

            _logger.LogInformation("Expense {ExpenseId} updated successfully", expenseId);
            return Ok(expense);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Expense {ExpenseId} not found", expenseId);
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error updating expense");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes an expense.
    /// </summary>
    /// <param name="tripId">The trip ID.</param>
    /// <param name="expenseId">The expense ID.</param>
    /// <returns>No content on success.</returns>
    [HttpDelete("{expenseId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteExpense(int tripId, int expenseId)
    {
        _logger.LogInformation("Deleting expense {ExpenseId} for trip {TripId}", expenseId, tripId);

        // Verify expense belongs to trip
        var expense = await _expenseService.GetExpenseByIdAsync(expenseId);
        if (expense is null || expense.TripId != tripId)
        {
            _logger.LogWarning("Expense {ExpenseId} not found for trip {TripId}", expenseId, tripId);
            return NotFound(new { message = $"Expense with ID {expenseId} not found" });
        }

        var deleted = await _expenseService.DeleteExpenseAsync(expenseId);

        if (!deleted)
        {
            return NotFound(new { message = $"Expense with ID {expenseId} not found" });
        }

        _logger.LogInformation("Expense {ExpenseId} deleted successfully", expenseId);
        return NoContent();
    }
}
