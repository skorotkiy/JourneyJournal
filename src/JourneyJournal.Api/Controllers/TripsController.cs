using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace JourneyJournal.Api.Controllers;

/// <summary>
/// API controller for managing trips.
/// Handles HTTP requests for trip operations.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly TripService _tripService;
    private readonly ILogger<TripsController> _logger;

    public TripsController(TripService tripService, ILogger<TripsController> logger)
    {
        _tripService = tripService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all trips.
    /// </summary>
    /// <returns>List of all trips with their details.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<TripDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TripDto>>> GetAllTrips()
    {
        _logger.LogInformation("Retrieving all trips");
        var trips = await _tripService.GetAllTripsAsync();
        return Ok(trips);
    }

    /// <summary>
    /// Gets a specific trip by ID.
    /// </summary>
    /// <param name="id">The trip ID.</param>
    /// <returns>The trip details.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TripDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TripDto>> GetTripById(int id)
    {
        _logger.LogInformation("Retrieving trip with ID {TripId}", id);
        var trip = await _tripService.GetTripByIdAsync(id);

        if (trip is null)
        {
            _logger.LogWarning("Trip with ID {TripId} not found", id);
            return NotFound(new { message = $"Trip with ID {id} not found" });
        }

        return Ok(trip);
    }

    /// <summary>
    /// Creates a new trip.
    /// </summary>
    /// <param name="request">The trip creation request.</param>
    /// <returns>The created trip.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(TripDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TripDto>> CreateTrip([FromBody] CreateTripRequest request)
    {
        _logger.LogInformation("Creating new trip: {TripName}", request.Name);

        try
        {
            var trip = await _tripService.CreateTripAsync(request);
            _logger.LogInformation("Trip created successfully with ID {TripId}", trip.TripId);
            return CreatedAtAction(nameof(GetTripById), new { id = trip.TripId }, trip);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating trip");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation creating trip");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing trip.
    /// </summary>
    /// <param name="id">The trip ID.</param>
    /// <param name="request">The trip update request.</param>
    /// <returns>The updated trip.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(TripDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TripDto>> UpdateTrip(int id, [FromBody] UpdateTripRequest request)
    {
        _logger.LogInformation("Updating trip with ID {TripId}", id);

        try
        {
            var trip = await _tripService.UpdateTripAsync(id, request);
            _logger.LogInformation("Trip with ID {TripId} updated successfully", id);
            return Ok(trip);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Trip with ID {TripId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error updating trip");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation updating trip");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes a trip.
    /// </summary>
    /// <param name="id">The trip ID.</param>
    /// <returns>No content on success.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTrip(int id)
    {
        _logger.LogInformation("Deleting trip with ID {TripId}", id);

        var deleted = await _tripService.DeleteTripAsync(id);

        if (!deleted)
        {
            _logger.LogWarning("Trip with ID {TripId} not found", id);
            return NotFound(new { message = $"Trip with ID {id} not found" });
        }

        _logger.LogInformation("Trip with ID {TripId} deleted successfully", id);
        return NoContent();
    }
}
