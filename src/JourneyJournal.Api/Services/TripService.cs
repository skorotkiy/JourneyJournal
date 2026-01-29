using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Data;
using JourneyJournal.Data.Entities;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using RouteEntity = JourneyJournal.Data.Entities.Route;
using JourneyJournal.Data.Enums;

namespace JourneyJournal.Api.Services;

/// <summary>
/// Application service for managing trips.
/// Orchestrates trip operations and enforces business rules.
/// </summary>
public class TripService
{
    private readonly JourneyJournalDbContext _context;
    private readonly IMapper _mapper;

    public TripService(JourneyJournalDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    /// <summary>
    /// Retrieves all trips with their related data.
    /// Default trip appears first, then sorted by start date (earliest to oldest).
    /// </summary>
    public async Task<List<TripDto>> GetAllTripsAsync()
    {
        var trips = await _context.Trips
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.Accommodations)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.RoutesFrom)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.RoutesTo)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.PlacesToVisit)
            .Include(t => t.Expenses)
            .AsSplitQuery()
            .AsNoTracking()
            .OrderBy(t => t.IsDefault ? 0 : 1)
            .ThenBy(t => t.StartDate)
            .ToListAsync();

        return _mapper.Map<List<TripDto>>(trips);
    }

    /// <summary>
    /// Retrieves a specific trip by ID with all related data.
    /// </summary>
    public async Task<TripDto?> GetTripByIdAsync(int tripId)
    {
        var trip = await _context.Trips
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.Accommodations)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.RoutesFrom)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.RoutesTo)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.PlacesToVisit)
            .Include(t => t.Expenses)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.TripId == tripId);

        return trip is not null ? _mapper.Map<TripDto>(trip) : null;
    }

    /// <summary>
    /// Creates a new trip with all related data.
    /// </summary>
    public async Task<TripDto> CreateTripAsync(CreateTripRequest request)
    {
        // Validate business rules
        ValidateTripDates(request.StartDate, request.EndDate);

        // If setting this trip as default, ensure all other trips are not default
        if (request.IsDefault)
        {
            var otherDefaultTrip = await _context.Trips.FirstOrDefaultAsync(t => t.IsDefault);
            if (otherDefaultTrip is not null)
            {
                otherDefaultTrip.IsDefault = false;
                otherDefaultTrip.UpdatedAt = DateTime.UtcNow;
            }
        }

        var trip = new Trip
        {
            Name = request.Name,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsCompleted = request.IsCompleted,
            IsDefault = request.IsDefault,
            Description = request.Description,
            PlannedCost = request.PlannedCost,
            Currency = request.Currency,
            CreatedAt = DateTime.UtcNow
        };

        // Create trip points (only direct properties)
        foreach (var pointRequest in request.TripPoints.OrderBy(p => p.Order))
        {
            var tripPoint = new TripPoint
            {
                Name = pointRequest.Name,
                Order = pointRequest.Order,
                ArrivalDate = pointRequest.ArrivalDate,
                DepartureDate = pointRequest.DepartureDate,
                Notes = pointRequest.Notes,
                CreatedAt = DateTime.UtcNow
            };
            trip.TripPoints.Add(tripPoint);
        }

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        return await GetTripByIdAsync(trip.TripId) ?? throw new InvalidOperationException("Failed to retrieve created trip");
    }

    /// <summary>
    /// Updates an existing trip with all related data.
    /// </summary>

    // New version: only updates trip properties and default flag, no trip point reconstruction
    public async Task<TripDto> UpdateTripAsync(int tripId, UpdateTripRequest request)
    {
        var trip = await _context.Trips.FirstOrDefaultAsync(t => t.TripId == tripId);
        if (trip is null)
        {
            throw new KeyNotFoundException($"Trip with ID {tripId} not found");
        }

        ValidateTripDates(request.StartDate, request.EndDate);

        trip.Name = request.Name;
        trip.StartDate = request.StartDate;
        trip.EndDate = request.EndDate;
        trip.IsCompleted = request.IsCompleted;
        trip.IsDefault = request.IsDefault;

        if (request.IsDefault)
        {
            var otherDefaultTrip = await _context.Trips.FirstOrDefaultAsync(t => t.TripId != tripId && t.IsDefault);
            if (otherDefaultTrip is not null)
            {
                otherDefaultTrip.IsDefault = false;
                otherDefaultTrip.UpdatedAt = DateTime.UtcNow;
            }
        }


        trip.Description = request.Description;
        trip.PlannedCost = request.PlannedCost;
        trip.Currency = request.Currency;
        trip.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetTripByIdAsync(tripId) ?? throw new InvalidOperationException("Failed to retrieve updated trip");
    }

    /// <summary>
    /// Sets the specified trip as default and unsets IsDefault for all other trips.
    /// </summary>
    public async Task SetTripAsDefaultAsync(int tripId)
    {
        var trip = await _context.Trips.FirstOrDefaultAsync(t => t.TripId == tripId);
        if (trip is null)
        {
            throw new KeyNotFoundException($"Trip with ID {tripId} not found");
        }

        if (!trip.IsDefault)
        {
            // Unset IsDefault for the other default trip if it exists
            var otherDefaultTrip = await _context.Trips.FirstOrDefaultAsync(t => t.TripId != tripId && t.IsDefault);
            if (otherDefaultTrip is not null)
            {
                otherDefaultTrip.IsDefault = false;
                otherDefaultTrip.UpdatedAt = DateTime.UtcNow;
            }
            trip.IsDefault = true;
            trip.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Deletes a trip and all related data.
    /// </summary>
    public async Task<bool> DeleteTripAsync(int tripId)
    {
        // Load trip with TripPoints and their Routes
        var trip = await _context.Trips
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.RoutesFrom)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.RoutesTo)
            .FirstOrDefaultAsync(t => t.TripId == tripId);

        if (trip is null)
        {
            return false;
        }

        // Collect all Route entities associated with this trip's TripPoints
        var allRoutes = trip.TripPoints
            .SelectMany(tp => tp.RoutesFrom)
            .Concat(trip.TripPoints.SelectMany(tp => tp.RoutesTo))
            .Distinct()
            .ToList();

        if (allRoutes.Count > 0)
        {
            _context.Routes.RemoveRange(allRoutes);
        }

        _context.Trips.Remove(trip);
        await _context.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Recalculates and updates the total cost for a trip.
    /// Includes expenses, accommodation costs, and route costs.
    /// </summary>
    public async Task RecalculateTripTotalCostAsync(int tripId)
    {
        var trip = await _context.Trips
            .Include(t => t.Expenses)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.Accommodations)
            .Include(t => t.TripPoints)
                .ThenInclude(tp => tp.RoutesFrom)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.TripId == tripId);

        if (trip is null)
        {
            throw new KeyNotFoundException($"Trip with ID {tripId} not found");
        }

        var totalCost = CalculateTripTotalCost(trip);
        var updatedAt = DateTime.UtcNow;

        await _context.Trips
            .Where(t => t.TripId == tripId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(t => t.TotalCost, totalCost)
                .SetProperty(t => t.UpdatedAt, updatedAt));
    }

    /// <summary>
    /// Calculates the total cost for a trip including expenses, accommodations, and routes.
    /// </summary>
    private static decimal CalculateTripTotalCost(Trip trip)
    {
        decimal totalCost = 0;

        // Add all expenses
        if (trip.Expenses is not null)
        {
            totalCost += trip.Expenses.Sum(e => e.Amount);
        }

        // Add accommodation costs from all trip points
        if (trip.TripPoints is not null)
        {
            foreach (var tripPoint in trip.TripPoints)
            {
                if (tripPoint.Accommodations is not null)
                {
                    // Only include accommodations with status Confirmed or Paid
                    totalCost += tripPoint.Accommodations
                        .Where(a => a.Status == AccommodationStatus.Confirmed || a.Status == AccommodationStatus.Paid)
                        .Sum(a => a.Cost);
                }

                // Add route costs for routes departing from this trip point (only selected routes)
                if (tripPoint.RoutesFrom is not null)
                {
                    totalCost += tripPoint.RoutesFrom
                        .Where(r => r.IsSelected && r.Cost.HasValue)
                        .Sum(r => r.Cost!.Value);
                }
            }
        }

        return totalCost;
    }

    /// <summary>
    /// Recalculates trip total cost from a trip point ID.
    /// </summary>
    public async Task RecalculateTripTotalCostFromTripPointAsync(int tripPointId)
    {
        var tripId = await _context.TripPoints
            .Where(tp => tp.TripPointId == tripPointId)
            .Select(tp => tp.TripId)
            .FirstOrDefaultAsync();

        if (tripId == 0)
        {
            throw new KeyNotFoundException($"TripPoint with ID {tripPointId} not found or not associated with a trip");
        }

        await RecalculateTripTotalCostAsync(tripId);
    }

    // Private helper methods

    private static void ValidateTripDates(DateTime startDate, DateTime? endDate)
    {
        if (endDate.HasValue && endDate.Value < startDate)
        {
            throw new ArgumentException("End date must be greater than or equal to start date");
        }
    }

    private static void ValidateAccommodationDates(DateTime checkIn, DateTime checkOut)
    {
        if (checkOut < checkIn)
        {
            throw new ArgumentException("Check-out date must be greater than or equal to check-in date");
        }
    }

    private static void ValidateRating(short? rating)
    {
        if (rating.HasValue && (rating.Value < 1 || rating.Value > 5))
        {
            throw new ArgumentException("Rating must be between 1 and 5");
        }
    }
}
