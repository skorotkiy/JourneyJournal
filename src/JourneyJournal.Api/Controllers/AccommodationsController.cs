using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace JourneyJournal.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccommodationsController : ControllerBase
{
    private readonly TripService _tripService;
    private readonly ILogger<AccommodationsController> _logger;

    public AccommodationsController(TripService tripService, ILogger<AccommodationsController> logger)
    {
        _tripService = tripService;
        _logger = logger;
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
            var updated = await _tripService.UpdateAccommodationAsync(id, request);
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
}
