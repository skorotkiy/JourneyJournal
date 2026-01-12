namespace JourneyJournal.Data.Enums;

/// <summary>
/// Defines the type of transportation for a route.
/// </summary>
public enum TransportationType
{
    /// <summary>
    /// Air travel by plane.
    /// </summary>
    Flight = 1,

    /// <summary>
    /// Travel by train.
    /// </summary>
    Train = 2,

    /// <summary>
    /// Travel by bus or coach.
    /// </summary>
    Bus = 3,

    /// <summary>
    /// Travel by personal or rental car.
    /// </summary>
    Car = 4,

    /// <summary>
    /// Travel on foot.
    /// </summary>
    Walking = 5,

    /// <summary>
    /// Other type of transportation.
    /// </summary>
    Other = 6
}
