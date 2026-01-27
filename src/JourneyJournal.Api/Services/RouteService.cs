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
        // Check if both TripPoints exist
        var fromPointExists = await _context.TripPoints.AnyAsync(tp => tp.TripPointId == request.FromPointOrder);
        if (!fromPointExists)
            throw new KeyNotFoundException($"From TripPoint with ID {request.FromPointOrder} not found");

        var toPointExists = await _context.TripPoints.AnyAsync(tp => tp.TripPointId == request.ToPointOrder);
        if (!toPointExists)
            throw new KeyNotFoundException($"To TripPoint with ID {request.ToPointOrder} not found");

        // Check if both points belong to the same trip
        var tripIds = await _context.TripPoints
            .Where(tp => tp.TripPointId == request.FromPointOrder || tp.TripPointId == request.ToPointOrder)
            .Select(tp => tp.TripId)
            .Distinct()
            .ToListAsync();

        if (tripIds.Count != 1)
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
        await _tripService.RecalculateTripTotalCostAsync(tripIds[0]);

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
        var tripId = await _context.TripPoints
            .Where(tp => tp.TripPointId == route.FromPointId)
            .Select(tp => tp.TripId)
            .FirstOrDefaultAsync();
        if (tripId != 0)
        {
            await _tripService.RecalculateTripTotalCostAsync(tripId);
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

        var tripId = await _context.TripPoints
            .Where(tp => tp.TripPointId == route.FromPointId)
            .Select(tp => tp.TripId)
            .FirstOrDefaultAsync();

        _context.Routes.Remove(route);
        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        if (tripId != 0)
        {
            await _tripService.RecalculateTripTotalCostAsync(tripId);
        }

        return true;
    }
}