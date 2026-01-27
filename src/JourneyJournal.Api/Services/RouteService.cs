using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Data;
using JourneyJournal.Data.Entities;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using RouteEntity = JourneyJournal.Data.Entities.Route;

namespace JourneyJournal.Api.Services;

/// <summary>
/// Application service for managing routes.
/// Orchestrates route operations and enforces business rules.
/// </summary>
public class RouteService
{
    private readonly JourneyJournalDbContext _context;
    private readonly IMapper _mapper;
    private readonly TripService _tripService;

    public RouteService(JourneyJournalDbContext context, IMapper mapper, TripService tripService)
    {
        _context = context;
        _mapper = mapper;
        _tripService = tripService;
    }

    /// <summary>
    /// Creates a new route between two TripPoints.
    /// </summary>
    public async Task<RouteDto> CreateRouteAsync(CreateRouteRequest request)
    {
        var fromPoint = await _context.TripPoints.FindAsync(request.FromPointOrder);
        var toPoint = await _context.TripPoints.FindAsync(request.ToPointOrder);

        if (fromPoint == null)
            throw new KeyNotFoundException($"From TripPoint with ID {request.FromPointOrder} not found");

        if (toPoint == null)
            throw new KeyNotFoundException($"To TripPoint with ID {request.ToPointOrder} not found");

        if (fromPoint.TripId != toPoint.TripId)
            throw new ArgumentException("Both TripPoints must belong to the same trip");

        if (request.FromPointOrder == request.ToPointOrder)
            throw new ArgumentException("Route cannot have the same starting and ending point");

        var route = new RouteEntity
        {
            FromPointId = request.FromPointOrder,
            ToPointId = request.ToPointOrder,
            Name = request.Name,
            TransportationType = request.TransportationType,
            Carrier = request.Carrier,
            DepartureTime = request.DepartureTime,
            ArrivalTime = request.ArrivalTime,
            DurationMinutes = request.DurationMinutes,
            Cost = request.Cost,
            IsSelected = request.IsSelected,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.Routes.Add(route);
        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        await _tripService.RecalculateTripTotalCostAsync(fromPoint.TripId);

        return _mapper.Map<RouteDto>(route);
    }

    /// <summary>
    /// Updates an existing route.
    /// </summary>
    public async Task<RouteDto?> UpdateRouteAsync(int routeId, UpdateRouteRequest request)
    {
        var route = await _context.Routes.FindAsync(routeId);
        if (route == null)
            return null;

        route.Name = request.Name;
        route.TransportationType = request.TransportationType;
        route.Carrier = request.Carrier;
        route.DepartureTime = request.DepartureTime;
        route.ArrivalTime = request.ArrivalTime;
        route.DurationMinutes = request.DurationMinutes;
        route.Cost = request.Cost;
        route.IsSelected = request.IsSelected;
        route.Notes = request.Notes;
        route.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        var fromPoint = await _context.TripPoints.FindAsync(route.FromPointId);
        if (fromPoint != null)
        {
            await _tripService.RecalculateTripTotalCostAsync(fromPoint.TripId);
        }

        return _mapper.Map<RouteDto>(route);
    }

    /// <summary>
    /// Deletes a route.
    /// </summary>
    public async Task<bool> DeleteRouteAsync(int routeId)
    {
        var route = await _context.Routes.FindAsync(routeId);
        if (route == null)
            return false;

        var tripId = (await _context.TripPoints.FindAsync(route.FromPointId))?.TripId;

        _context.Routes.Remove(route);
        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        if (tripId.HasValue)
        {
            await _tripService.RecalculateTripTotalCostAsync(tripId.Value);
        }

        return true;
    }
}