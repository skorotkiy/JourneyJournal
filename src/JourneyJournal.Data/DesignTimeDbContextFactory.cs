using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace JourneyJournal.Data;

/// <summary>
/// Factory for creating DbContext instances at design time for EF Core tools.
/// This allows migrations to be created without referencing the API project.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<JourneyJournalDbContext>
{
    public JourneyJournalDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<JourneyJournalDbContext>();
        
        // Use a default connection string for migrations
        // The actual connection string will be loaded from appsettings.json at runtime
        optionsBuilder.UseSqlite("Data Source=db/journeydb.sqlite");

        return new JourneyJournalDbContext(optionsBuilder.Options);
    }
}
