namespace JourneyJournal.Data.Enums;

/// <summary>
/// Defines the visit status of a place to visit.
/// </summary>
public enum VisitStatus
{
    /// <summary>
    /// Visit is planned but not yet occurred.
    /// </summary>
    Planned = 1,

    /// <summary>
    /// Place has been visited.
    /// </summary>
    Visited = 2,

    /// <summary>
    /// Planned visit was skipped.
    /// </summary>
    Skipped = 3
}
