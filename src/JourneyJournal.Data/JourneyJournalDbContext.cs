using JourneyJournal.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JourneyJournal.Data;

/// <summary>
/// Database context for JourneyJournal application.
/// Manages entity configurations and database operations.
/// </summary>
public class JourneyJournalDbContext : DbContext
{
    public JourneyJournalDbContext(DbContextOptions<JourneyJournalDbContext> options)
        : base(options)
    {
    }

    // DbSets for all entities

    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripPoint> TripPoints => Set<TripPoint>();
    public DbSet<Accommodation> Accommodations => Set<Accommodation>();
    public DbSet<Route> Routes => Set<Route>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<PlaceToVisit> PlacesToVisit => Set<PlaceToVisit>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureTripEntity(modelBuilder);
        ConfigureTripPointEntity(modelBuilder);
        ConfigureAccommodationEntity(modelBuilder);
        ConfigureRouteEntity(modelBuilder);
        ConfigureExpenseEntity(modelBuilder);
        ConfigurePlaceToVisitEntity(modelBuilder);
    }

    private static void ConfigureTripEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Trip>(entity =>
        {
            entity.HasKey(e => e.TripId);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.StartDate)
                .IsRequired();

            entity.Property(e => e.TotalCost)
                .HasPrecision(18, 2);

            entity.Property(e => e.Currency)
                .HasMaxLength(3);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Indexes for performance
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => e.IsCompleted);

            // Relationships
            entity.HasMany(e => e.TripPoints)
                .WithOne(tp => tp.Trip)
                .HasForeignKey(tp => tp.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Expenses)
                .WithOne(ex => ex.Trip)
                .HasForeignKey(ex => ex.TripId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureTripPointEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TripPoint>(entity =>
        {
            entity.HasKey(e => e.TripPointId);

            entity.Property(e => e.TripId)
                .IsRequired();

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Order)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Indexes for performance
            entity.HasIndex(e => new { e.TripId, e.Order });

            // Relationships
            entity.HasMany(e => e.Accommodations)
                .WithOne(a => a.TripPoint)
                .HasForeignKey(a => a.TripPointId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.PlacesToVisit)
                .WithOne(p => p.TripPoint)
                .HasForeignKey(p => p.TripPointId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureAccommodationEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Accommodation>(entity =>
        {
            entity.HasKey(e => e.AccommodationId);

            entity.Property(e => e.TripPointId)
                .IsRequired();

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.AccommodationType)
                .IsRequired();

            entity.Property(e => e.Address)
                .HasMaxLength(500);

            entity.Property(e => e.WebsiteUrl)
                .HasMaxLength(500);

            entity.Property(e => e.Cost)
                .HasPrecision(18, 2);

            entity.Property(e => e.Status)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Indexes for performance
            entity.HasIndex(e => e.TripPointId);
        });
    }

    private static void ConfigureRouteEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Route>(entity =>
        {
            entity.HasKey(e => e.RouteId);

            entity.Property(e => e.FromPointId)
                .IsRequired();

            entity.Property(e => e.ToPointId)
                .IsRequired();

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.TransportationType)
                .IsRequired();

            entity.Property(e => e.Carrier)
                .HasMaxLength(200);

            entity.Property(e => e.Cost)
                .HasPrecision(18, 2);

            entity.Property(e => e.IsSelected)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Indexes for performance
            entity.HasIndex(e => new { e.FromPointId, e.ToPointId });
            entity.HasIndex(e => e.IsSelected);

            // Relationships with explicit foreign keys
            entity.HasOne(e => e.FromPoint)
                .WithMany(tp => tp.RoutesFrom)
                .HasForeignKey(e => e.FromPointId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ToPoint)
                .WithMany(tp => tp.RoutesTo)
                .HasForeignKey(e => e.ToPointId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureExpenseEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.ExpenseId);

            entity.Property(e => e.TripId)
                .IsRequired();

            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Category)
                .IsRequired();

            entity.Property(e => e.Amount)
                .IsRequired()
                .HasPrecision(18, 2);

            entity.Property(e => e.ExpenseDate)
                .IsRequired();

            entity.Property(e => e.PaymentMethod)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Indexes for performance
            entity.HasIndex(e => new { e.TripId, e.Category });
            entity.HasIndex(e => e.ExpenseDate);
        });
    }

    private static void ConfigurePlaceToVisitEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PlaceToVisit>(entity =>
        {
            entity.HasKey(e => e.PlaceToVisitId);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Category)
                .IsRequired();

            entity.Property(e => e.Address)
                .HasMaxLength(500);

            entity.Property(e => e.Price)
                .HasPrecision(18, 2);

            entity.Property(e => e.WebsiteUrl)
                .HasMaxLength(500);

            entity.Property(e => e.UsefulLinks)
                .HasMaxLength(2000);

            entity.Property(e => e.Order)
                .IsRequired();

            entity.Property(e => e.VisitStatus)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Indexes for performance
            entity.HasIndex(e => e.TripPointId);
            entity.HasIndex(e => e.VisitDate);
            entity.HasIndex(e => new { e.TripPointId, e.Order });
        });
    }
}
