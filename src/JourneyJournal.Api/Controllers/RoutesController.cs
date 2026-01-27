using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace JourneyJournal.Api.Controllers;

/// <summary>
/// API controller for managing routes.
/// Handles HTTP requests for route operations.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly RouteService _routeService;
    private readonly ILogger<RoutesController> _logger;

    public RoutesController(RouteService routeService, ILogger<RoutesController> logger)
    {
        _routeService = routeService;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new route.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RouteDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RouteDto>> CreateRoute([FromBody] CreateRouteRequest request)
    {
        _logger.LogInformation("Creating route from TripPoint {FromPointId} to {ToPointId}", request.FromPointOrder, request.ToPointOrder);
        try
        {
            var created = await _routeService.CreateRouteAsync(request);
            return CreatedAtAction(nameof(UpdateRoute), new { id = created.RouteId }, created);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating route");
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Referenced entity not found");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates a route by ID.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(RouteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RouteDto>> UpdateRoute(int id, [FromBody] UpdateRouteRequest request)
    {
        _logger.LogInformation("Updating route with ID {RouteId}", id);
        try
        {
            var updated = await _routeService.UpdateRouteAsync(id, request);
            if (updated == null)
            {
                return NotFound(new { message = $"Route with ID {id} not found" });
            }
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error updating route");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation updating route");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes a route by ID.
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteRoute(int id)
    {
        _logger.LogInformation("Deleting route with ID {RouteId}", id);
        try
        {
            var deleted = await _routeService.DeleteRouteAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = $"Route with ID {id} not found" });
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting route");
            return StatusCode(500, new { message = "An error occurred while deleting the route" });
        }
    }
}