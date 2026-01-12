namespace JourneyJournal.Data.Enums;

/// <summary>
/// Defines the type of accommodation for a trip point.
/// </summary>
public enum AccommodationType
{
    /// <summary>
    /// Online booking platform accommodation.
    /// </summary>
    Booking = 1,

    /// <summary>
    /// Traditional hotel accommodation.
    /// </summary>
    Hotel = 2,

    /// <summary>
    /// Apartment rental.
    /// </summary>
    Apartment = 3,

    /// <summary>
    /// Airbnb or similar short-term rental.
    /// </summary>
    Airbnb = 4,

    /// <summary>
    /// Other type of accommodation.
    /// </summary>
    Other = 5
}
