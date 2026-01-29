using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace JourneyJournal.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripPointsController : ControllerBase
{
    private readonly TripPointService _tripPointService;
    private readonly ILogger<TripPointsController> _logger;

    public TripPointsController(TripPointService tripPointService, ILogger<TripPointsController> logger)
    {
        _tripPointService = tripPointService;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(TripPointDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TripPointDto>> CreateTripPoint([FromBody] CreateTripPointRequest request)
    {
        _logger.LogInformation("Creating new trip point for Trip {TripId}", request.TripId);
        try
        {
            var tripPoint = await _tripPointService.CreateTripPointAsync(request);
            return CreatedAtAction(nameof(GetTripPointById), new { id = tripPoint.TripPointId }, tripPoint);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating trip point");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(TripPointDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TripPointDto>> UpdateTripPoint(int id, [FromBody] UpdateTripPointRequest request)
    {
        _logger.LogInformation("Updating trip point {TripPointId}", id);
        try
        {
            var tripPoint = await _tripPointService.UpdateTripPointAsync(id, request);
            return Ok(tripPoint);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "TripPoint with ID {TripPointId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error updating trip point");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TripPointDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TripPointDto>> GetTripPointById(int id)
    {
        var tripPoint = await _tripPointService.GetTripPointByIdAsync(id);
        if (tripPoint == null)
            return NotFound();
        return Ok(tripPoint);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTripPoint(int id)
    {
        _logger.LogInformation("Deleting trip point {TripPointId}", id);
        try
        {
            await _tripPointService.DeleteTripPointAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "TripPoint with ID {TripPointId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error deleting trip point");
            return BadRequest(new { message = ex.Message });
        }
    }
}
