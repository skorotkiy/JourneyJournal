using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Data;
using JourneyJournal.Data.Entities;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JourneyJournal.Api.Services;

/// <summary>
/// Application service for managing accommodations.
/// Orchestrates accommodation operations and enforces business rules.
/// </summary>
public class AccommodationService
{
    private readonly JourneyJournalDbContext _context;
    private readonly IMapper _mapper;
    private readonly TripService _tripService;

    public AccommodationService(JourneyJournalDbContext context, IMapper mapper, TripService tripService)
    {
        _context = context;
        _mapper = mapper;
        _tripService = tripService;
    }

    /// <summary>
    /// Creates a new accommodation attached to an existing TripPoint.
    /// </summary>
    public async Task<AccommodationDto> CreateAccommodationAsync(CreateAccommodationRequest request)
    {
        ValidateAccommodationDates(request.CheckInDate, request.CheckOutDate);

        var tripPoint = await _context.TripPoints
            .Include(tp => tp.Accommodations)
            .FirstOrDefaultAsync(tp => tp.TripPointId == request.TripPointId);

        if (tripPoint == null)
            throw new KeyNotFoundException($"TripPoint with ID {request.TripPointId} not found");

        var accommodation = new Accommodation
        {
            TripPointId = request.TripPointId,
            Name = request.Name,
            AccommodationType = request.AccommodationType,
            Address = request.Address,
            CheckInDate = request.CheckInDate,
            CheckOutDate = request.CheckOutDate,
            WebsiteUrl = request.WebsiteUrl,
            Cost = request.Cost,
            Status = request.Status,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        tripPoint.Accommodations.Add(accommodation);
        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        await _tripService.RecalculateTripTotalCostFromTripPointAsync(tripPoint.TripId);

        return _mapper.Map<AccommodationDto>(accommodation);
    }

    /// <summary>
    /// Updates an existing accommodation.
    /// </summary>
    public async Task<AccommodationDto?> UpdateAccommodationAsync(int accommodationId, UpdateAccommodationRequest request)
    {
        var accommodation = await _context.Accommodations.FindAsync(accommodationId);
        if (accommodation == null)
            return null;

        accommodation.Name = request.Name;
        accommodation.AccommodationType = request.AccommodationType;
        accommodation.Address = request.Address;
        accommodation.CheckInDate = DateTime.Parse(request.CheckInDate);
        accommodation.CheckOutDate = DateTime.Parse(request.CheckOutDate);
        accommodation.WebsiteUrl = request.WebsiteUrl;
        accommodation.Cost = request.Cost;
        accommodation.Status = request.Status;
        accommodation.Notes = request.Notes;
        accommodation.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Recalculate trip total cost
        await _tripService.RecalculateTripTotalCostFromTripPointAsync(accommodation.TripPointId);

        return _mapper.Map<AccommodationDto>(accommodation);
    }

    /// <summary>
    /// Deletes an accommodation.
    /// </summary>
    public async Task<bool> DeleteAccommodationAsync(int accommodationId)
    {
        var tripPointId = await _context.Accommodations
            .Where(a => a.AccommodationId == accommodationId)
            .Select(a => a.TripPointId)
            .FirstOrDefaultAsync();

        if (tripPointId == 0)
            return false;

        var deletedCount = await _context.Accommodations
            .Where(a => a.AccommodationId == accommodationId)
            .ExecuteDeleteAsync();

        // Recalculate trip total cost
        await _tripService.RecalculateTripTotalCostFromTripPointAsync(tripPointId);

        return deletedCount > 0;
    }

    // Private helper methods

    private static void ValidateAccommodationDates(DateTime checkIn, DateTime checkOut)
    {
        if (checkOut < checkIn)
        {
            throw new ArgumentException("Check-out date must be greater than or equal to check-in date");
        }
    }
}