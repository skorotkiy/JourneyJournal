using JourneyJournal.Api.DTOs.Inputs;
using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Data;
using JourneyJournal.Data.Entities;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JourneyJournal.Api.Services;

public class TripPointService
{
    private readonly JourneyJournalDbContext _context;
    private readonly IMapper _mapper;

    public TripPointService(JourneyJournalDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<TripPointDto> CreateTripPointAsync(CreateTripPointRequest request)
    {
        var trip = await _context.Trips.Include(t => t.TripPoints).FirstOrDefaultAsync(t => t.TripId == request.TripId);
        if (trip == null)
            throw new ArgumentException($"Trip with ID {request.TripId} not found");

        var tripPoint = _mapper.Map<TripPoint>(request);
        tripPoint.CreatedAt = DateTime.UtcNow;
        trip.TripPoints.Add(tripPoint);
        await _context.SaveChangesAsync();
        return _mapper.Map<TripPointDto>(tripPoint);
    }

    public async Task<TripPointDto> UpdateTripPointAsync(int id, UpdateTripPointRequest request)
    {
        var tripPoint = await _context.TripPoints.Include(tp => tp.Accommodations).Include(tp => tp.PlacesToVisit).FirstOrDefaultAsync(tp => tp.TripPointId == id);
        if (tripPoint == null)
            throw new KeyNotFoundException($"TripPoint with ID {id} not found");

        _mapper.Map(request, tripPoint);
        tripPoint.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return _mapper.Map<TripPointDto>(tripPoint);
    }
    public async Task DeleteTripPointAsync(int id)
    {
        var tripPoint = await _context.TripPoints
            .Include(tp => tp.RoutesFrom)
            .Include(tp => tp.RoutesTo)
            .FirstOrDefaultAsync(tp => tp.TripPointId == id);
        if (tripPoint == null)
            throw new KeyNotFoundException($"TripPoint with ID {id} not found");

        // Remove related routes (if any)
        if (tripPoint.RoutesFrom != null)
            _context.Routes.RemoveRange(tripPoint.RoutesFrom);
        if (tripPoint.RoutesTo != null)
            _context.Routes.RemoveRange(tripPoint.RoutesTo);

        _context.TripPoints.Remove(tripPoint);
        await _context.SaveChangesAsync();
    }

    public async Task<TripPointDto?> GetTripPointByIdAsync(int id)
    {
        var tripPoint = await _context.TripPoints.Include(tp => tp.Accommodations).Include(tp => tp.PlacesToVisit).FirstOrDefaultAsync(tp => tp.TripPointId == id);
        return tripPoint == null ? null : _mapper.Map<TripPointDto>(tripPoint);
    }
}
