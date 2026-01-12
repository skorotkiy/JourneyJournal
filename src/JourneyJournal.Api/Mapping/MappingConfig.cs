using JourneyJournal.Api.DTOs.Outputs;
using JourneyJournal.Data.Entities;
using Mapster;

namespace JourneyJournal.Api.Mapping;

/// <summary>
/// Configures Mapster mappings for entity-to-DTO conversions.
/// </summary>
public static class MappingConfig
{
    /// <summary>
    /// Registers all mapping configurations.
    /// </summary>
    public static void RegisterMappings()
    {
        // Configure Trip to TripDto mapping
        TypeAdapterConfig<Trip, TripDto>.NewConfig()
            .Map(dest => dest.TripPoints, src => src.TripPoints.OrderBy(tp => tp.Order))
            .Map(dest => dest.Expenses, src => src.Expenses.OrderByDescending(e => e.ExpenseDate));

        // Configure TripPoint to TripPointDto mapping
        TypeAdapterConfig<TripPoint, TripPointDto>.NewConfig()
            .Map(dest => dest.PlacesToVisit, src => src.PlacesToVisit.OrderBy(p => p.Order));

        // All other mappings will use default conventions
        // Entities: Accommodation, Route, PlaceToVisit, Expense
        // will map automatically to their respective DTOs
    }
}
