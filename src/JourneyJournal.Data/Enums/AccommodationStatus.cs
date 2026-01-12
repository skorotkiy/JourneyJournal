namespace JourneyJournal.Data.Enums;

/// <summary>
/// Defines the booking status of an accommodation.
/// </summary>
public enum AccommodationStatus
{
    /// <summary>
    /// Accommodation is planned but not yet booked.
    /// </summary>
    Planned = 1,

    /// <summary>
    /// Booking is confirmed.
    /// </summary>
    Confirmed = 2,

    /// <summary>
    /// Payment is required to complete booking.
    /// </summary>
    PaymentRequired = 3,

    /// <summary>
    /// Payment has been completed.
    /// </summary>
    Paid = 4,

    /// <summary>
    /// Booking has been cancelled.
    /// </summary>
    Cancelled = 5
}
