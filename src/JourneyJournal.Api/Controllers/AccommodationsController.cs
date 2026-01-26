    // ...existing code...
using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace JourneyJournal.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccommodationsController : ControllerBase
{
    private readonly AccommodationService _accommodationService;
    private readonly ILogger<AccommodationsController> _logger;

    public AccommodationsController(AccommodationService accommodationService, ILogger<AccommodationsController> logger)
    {
        _accommodationService = accommodationService;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new accommodation.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(AccommodationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AccommodationDto>> CreateAccommodation([FromBody] CreateAccommodationRequest request)
    {
        _logger.LogInformation("Creating accommodation for TripPoint {TripPointId}", request.TripPointId);
        try
        {
            var created = await _accommodationService.CreateAccommodationAsync(request);
            return CreatedAtAction(nameof(UpdateAccommodation), new { id = created.AccommodationId }, created);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating accommodation");
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Referenced entity not found");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an accommodation by ID.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(AccommodationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AccommodationDto>> UpdateAccommodation(int id, [FromBody] UpdateAccommodationRequest request)
    {
        _logger.LogInformation("Updating accommodation with ID {AccommodationId}", id);
        try
        {
            var updated = await _accommodationService.UpdateAccommodationAsync(id, request);
            if (updated == null)
            {
                return NotFound(new { message = $"Accommodation with ID {id} not found" });
            }
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error updating accommodation");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation updating accommodation");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes an accommodation by ID.
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAccommodation(int id)
    {
        _logger.LogInformation("Deleting accommodation with ID {AccommodationId}", id);
        try
        {
            var deleted = await _accommodationService.DeleteAccommodationAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = $"Accommodation with ID {id} not found" });
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting accommodation");
            return StatusCode(500, new { message = "An error occurred while deleting the accommodation" });
        }
    }
}
