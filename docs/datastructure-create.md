# Data Structure Creation Instructions

## Overview

This document provides comprehensive instructions for creating the data structure for the JourneyJournal application. The application is designed for planning future trips as well as keeping records of completed ones.

## Domain Model Overview

The application manages trips with the following key features:
- **Trip Planning & Tracking**: Plan future trips and document completed ones
- **Multi-Point Trips**: Start point, intermediate stops, and destination
- **Accommodations**: Lodging details at each location
- **Routes**: Multiple route options between points with selection capability
- **Expenses**: Track all costs (accommodation, transportation, fees, etc.)
- **Sightseeing**: Places of interest with detailed information

## Entity Structure


### 1. Trip Entity

**Purpose**: Main entity representing a complete trip (planned or completed)

**Properties**:
- `Id` (int, PK): Primary key
- `Name` (string, required, max 200): Trip name/title
- `StartDate` (DateTime, required): Trip start date
- `EndDate` (DateTime, nullable): Trip end date
- `IsCompleted` (bool): Flag indicating if trip is completed or still planned
- `Description` (string, nullable): General trip description
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Has many `TripPoints` (1:N)
- Has many `Routes` (1:N)
- Has many `Expenses` (1:N)
- Has many `Sightseeings` (1:N)

---

### 2. TripPoint Entity

**Purpose**: Represents a location in the trip (start, intermediate stops, or destination)

**Properties**:
- `Id` (int, PK): Primary key
- `TripId` (int, FK, required): Foreign key to Trip
- `Name` (string, required, max 200): Location/city name
- `PointType` (enum): Type of point - Start(1), Intermediate(2), Destination(3)
- `OrderIndex` (int, required): Sequential order of this point in the trip (0-based)
- `ArrivalDate` (DateTime, nullable): Arrival date to this point
- `DepartureDate` (DateTime, nullable): Departure date from this point
- `Address` (string, nullable, max 500): Full address or location details
- `Latitude` (decimal(9,6), nullable): Latitude coordinate
- `Longitude` (decimal(9,6), nullable): Longitude coordinate
- `Notes` (string, nullable): Additional notes about this point
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `Trip` (N:1)
- Has many `Accommodations` (1:N)
- Has many `Routes` as FromPoint (1:N)
- Has many `Routes` as ToPoint (1:N)
- Has many `Sightseeings` (1:N)

---

### 3. Accommodation Entity

**Purpose**: Represents lodging/accommodation at a trip point

**Properties**:
- `Id` (int, PK): Primary key
- `TripPointId` (int, FK, required): Foreign key to TripPoint
- `Name` (string, required, max 200): Accommodation name
- `AccommodationType` (string, nullable, max 50): Type (Hotel, Hostel, Apartment, Airbnb, etc.)
- `Address` (string, nullable, max 500): Full address
- `CheckInDate` (DateTime, nullable): Check-in date and time
- `CheckOutDate` (DateTime, nullable): Check-out date and time
- `PhoneNumber` (string, nullable, max 50): Contact phone
- `Email` (string, nullable, max 100): Contact email
- `WebsiteUrl` (string, nullable, max 500): Website URL
- `ConfirmationNumber` (string, nullable, max 100): Booking confirmation number
- `TotalCost` (decimal(18,2), nullable): Total accommodation cost
- `Currency` (string, nullable, max 3): Currency code (USD, EUR, etc.)
- `BookingStatus` (string, nullable, max 50): Status (Planned, Confirmed, PaymentRequired, Cancelled, Completed)
- `Notes` (string, nullable): Additional notes or special requirements
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `TripPoint` (N:1)
- Has many `Expenses` (1:N)

---

### 4. Route Entity

**Purpose**: Represents transportation route between two trip points with support for multiple route options

**Properties**:
- `Id` (int, PK): Primary key
- `TripId` (int, FK, required): Foreign key to Trip
- `FromPointId` (int, FK, required): Starting point foreign key
- `ToPointId` (int, FK, required): Destination point foreign key
- `Name` (string, required, max 200): Route name/description
- `TransportationType` (enum): Flight(1), Train(2), Bus(3), Car(4), Walking(5), Other(99)
- `Carrier` (string, nullable, max 200): Carrier/company name
- `RouteNumber` (string, nullable, max 50): Flight/train/bus number
- `DepartureTime` (DateTime, nullable): Departure date and time
- `ArrivalTime` (DateTime, nullable): Arrival date and time
- `DurationMinutes` (int, nullable): Duration in minutes
- `DistanceKm` (decimal(10,2), nullable): Distance in kilometers
- `Cost` (decimal(18,2), nullable): Route cost
- `Currency` (string, nullable, max 3): Currency code
- `ConfirmationNumber` (string, nullable, max 100): Booking confirmation
- `IsSelected` (bool, required, default false): Indicates if this is the selected/preferred route option
- `BookingStatus` (string, nullable, max 50): Status (Option, Confirmed, Cancelled, Completed)
- `Notes` (string, nullable): Additional route notes or directions
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `Trip` (N:1)
- Belongs to one `TripPoint` as FromPoint (N:1)
- Belongs to one `TripPoint` as ToPoint (N:1)
- Has many `Expenses` (1:N)

**Business Rules**:
- Multiple routes can exist between the same two points (allowing comparison of options)
- Only one route between two points should have `IsSelected = true` at a time
- FromPointId and ToPointId must be different

---

### 5. Expense Entity

**Purpose**: Tracks all trip expenses with categorization and associations

**Properties**:
- `Id` (int, PK): Primary key
- `TripId` (int, FK, required): Foreign key to Trip
- `AccommodationId` (int, FK, nullable): Optional link to Accommodation
- `RouteId` (int, FK, nullable): Optional link to Route
- `SightseeingId` (int, FK, nullable): Optional link to Sightseeing
- `Description` (string, required, max 200): Expense description
- `Category` (enum): Accommodation(1), Transportation(2), Food(3), Entertainment(4), Sightseeing(5), Shopping(6), Fees(7), Insurance(8), Other(99)
- `Amount` (decimal(18,2), required): Expense amount
- `Currency` (string, required, max 3, default "USD"): Currency code
- `PaymentStatus` (enum): Planned(1), Paid(2), Refunded(3), Cancelled(4)
- `ExpenseDate` (DateTime, required): Date of expense
- `PaymentMethod` (string, nullable, max 50): Payment method (Cash, Credit Card, etc.)
- `Notes` (string, nullable): Additional notes
- `ReceiptUrl` (string, nullable, max 500): Receipt image URL or file path
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `Trip` (N:1, required)
- Belongs to one `Accommodation` (N:1, optional)
- Belongs to one `Route` (N:1, optional)
- Belongs to one `Sightseeing` (N:1, optional)

**Business Rules**:
- At most one of AccommodationId, RouteId, or SightseeingId can be set
- Amount must be positive
- Currency should follow ISO 4217 codes

---

### 6. Sightseeing Entity

**Purpose**: Places of interest, tourist attractions, and points to visit

**Properties**:
- `Id` (int, PK): Primary key
- `TripId` (int, FK, required): Foreign key to Trip
- `TripPointId` (int, FK, nullable): Optional link to TripPoint (location)
- `Name` (string, required, max 200): Place/attraction name
- `Category` (string, nullable, max 100): Type of attraction (Museum, Park, Monument, Restaurant, etc.)
- `Address` (string, nullable, max 500): Full address
- `Latitude` (decimal(9,6), nullable): Latitude coordinate
- `Longitude` (decimal(9,6), nullable): Longitude coordinate
- `Description` (string, nullable): Detailed description of the place
- `Price` (decimal(18,2), nullable): Entrance fee or cost
- `Currency` (string, nullable, max 3): Currency code
- `OpeningHours` (string, nullable, max 200): Opening hours information
- `HowToReach` (string, nullable, max 500): Transportation/directions to reach this place
- `RecommendedDurationMinutes` (int, nullable): Recommended visit duration
- `PhoneNumber` (string, nullable, max 50): Contact phone
- `WebsiteUrl` (string, nullable, max 500): Official website URL
- `UsefulLinks` (string, nullable, max 2000): Additional useful links (JSON array or comma-separated)
- `Rating` (int, nullable): Personal rating (1-5 stars)
- `VisitDate` (DateTime, nullable): Planned or actual visit date
- `Priority` (int, nullable): Priority level (1=highest, 5=lowest)
- `VisitStatus` (string, nullable, max 50): Status (Planned, Visited, Skipped)
- `Notes` (string, nullable): Personal notes or review
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `Trip` (N:1, required)
- Belongs to one `TripPoint` (N:1, optional)
- Has many `Expenses` (1:N)

**Business Rules**:
- Rating must be between 1 and 5 if provided
- Priority must be between 1 and 5 if provided

---

## Database Schema Design

### Table Names
- `Trips`
- `TripPoints`
- `Accommodations`
- `Routes`
- `Expenses`
- `Sightseeings`

### Indexes to Create

**Performance Indexes**:
- `Trips`: Index on `StartDate`, `IsCompleted`
- `TripPoints`: Index on `TripId, OrderIndex`
- `Accommodations`: Index on `TripPointId`
- `Routes`: Index on `TripId, FromPointId, ToPointId`, `IsSelected`
- `Expenses`: Index on `TripId, Category`, `ExpenseDate`
- `Sightseeings`: Index on `TripId, TripPointId`, `VisitDate`

### Cascade Delete Rules
- Trip deletion → Cascade delete all TripPoints, Routes, Expenses, Sightseeings
- TripPoint deletion → Cascade delete Accommodations
- TripPoint deletion → Restrict if referenced by Routes (must delete routes first)
- Accommodation deletion → Set null in Expenses
- Route deletion → Set null in Expenses
- Sightseeing deletion → Set null in Expenses

---

## Entity Framework Core Implementation Steps

### Step 1: Create Entity Classes

Create the following files in `JourneyJournal.Data/Models/`:
1. `Trip.cs`
2. `TripPoint.cs`
3. `TripPointType.cs` (enum)
4. `Accommodation.cs`
5. `Route.cs`
6. `TransportationType.cs` (enum)
7. `Expense.cs`
8. `ExpenseCategory.cs` (enum)
9. `PaymentStatus.cs` (enum)
10. `Sightseeing.cs`

### Step 2: Create DbContext

Create `JourneyJournalDbContext.cs` in `JourneyJournal.Data/`:

```csharp
using Microsoft.EntityFrameworkCore;
using JourneyJournal.Data.Models;

namespace JourneyJournal.Data
{
    public class JourneyJournalDbContext : DbContext
    {
        public JourneyJournalDbContext(DbContextOptions<JourneyJournalDbContext> options)
            : base(options)
        {
        }

        public DbSet<Trip> Trips { get; set; }
        public DbSet<TripPoint> TripPoints { get; set; }
        public DbSet<Accommodation> Accommodations { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Sightseeing> Sightseeings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure entities here
            ConfigureTripEntity(modelBuilder);
            ConfigureTripPointEntity(modelBuilder);
            ConfigureAccommodationEntity(modelBuilder);
            ConfigureRouteEntity(modelBuilder);
            ConfigureExpenseEntity(modelBuilder);
            ConfigureSightseeingEntity(modelBuilder);
        }
        
        // Configuration methods for each entity
    }
}
```

### Step 3: Entity Configurations

#### Trip Configuration
```csharp
private void ConfigureTripEntity(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Trip>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        entity.Property(e => e.IsCompleted).IsRequired().HasDefaultValue(false);
        entity.Property(e => e.Description).HasMaxLength(2000);
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        
        entity.HasMany(e => e.Points)
            .WithOne(p => p.Trip)
            .HasForeignKey(p => p.TripId)
            .OnDelete(DeleteBehavior.Cascade);
            
        entity.HasMany(e => e.Routes)
            .WithOne(r => r.Trip)
            .HasForeignKey(r => r.TripId)
            .OnDelete(DeleteBehavior.Cascade);
            
        entity.HasMany(e => e.Expenses)
            .WithOne(exp => exp.Trip)
            .HasForeignKey(exp => exp.TripId)
            .OnDelete(DeleteBehavior.Cascade);
            
        entity.HasMany(e => e.Sightseeings)
            .WithOne(s => s.Trip)
            .HasForeignKey(s => s.TripId)
            .OnDelete(DeleteBehavior.Cascade);
    });
}
```

#### TripPoint Configuration
```csharp
private void ConfigureTripPointEntity(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<TripPoint>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        entity.Property(e => e.PointType).IsRequired();
        entity.Property(e => e.OrderIndex).IsRequired();
        entity.Property(e => e.Address).HasMaxLength(500);
        entity.Property(e => e.Latitude).HasPrecision(9, 6);
        entity.Property(e => e.Longitude).HasPrecision(9, 6);
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        
        entity.HasOne(e => e.Trip)
            .WithMany(t => t.Points)
            .HasForeignKey(e => e.TripId)
            .OnDelete(DeleteBehavior.Cascade);
            
        entity.HasMany(e => e.Accommodations)
            .WithOne(a => a.TripPoint)
            .HasForeignKey(a => a.TripPointId)
            .OnDelete(DeleteBehavior.Cascade);
    });
}
```

#### Route Configuration
```csharp
private void ConfigureRouteEntity(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Route>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Name).HasMaxLength(200);
        entity.Property(e => e.TransportationType).IsRequired();
        entity.Property(e => e.Carrier).HasMaxLength(200);
        entity.Property(e => e.RouteNumber).HasMaxLength(50);
        entity.Property(e => e.DistanceKm).HasPrecision(10, 2);
        entity.Property(e => e.Cost).HasPrecision(18, 2);
        entity.Property(e => e.Currency).HasMaxLength(3);
        entity.Property(e => e.IsSelected).IsRequired().HasDefaultValue(false);
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        
        entity.HasOne(e => e.FromPoint)
            .WithMany(p => p.RoutesFrom)
            .HasForeignKey(e => e.FromPointId)
            .OnDelete(DeleteBehavior.Restrict);
            
        entity.HasOne(e => e.ToPoint)
            .WithMany(p => p.RoutesTo)
            .HasForeignKey(e => e.ToPointId)
            .OnDelete(DeleteBehavior.Restrict);
    });
}
```

#### Expense Configuration
```csharp
private void ConfigureExpenseEntity(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Expense>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Description).IsRequired().HasMaxLength(200);
        entity.Property(e => e.Category).IsRequired();
        entity.Property(e => e.Amount).IsRequired().HasPrecision(18, 2);
        entity.Property(e => e.Currency).IsRequired().HasMaxLength(3).HasDefaultValue("USD");
        entity.Property(e => e.PaymentStatus).IsRequired();
        entity.Property(e => e.ExpenseDate).IsRequired();
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        
        entity.HasOne(e => e.Accommodation)
            .WithMany(a => a.Expenses)
            .HasForeignKey(e => e.AccommodationId)
            .OnDelete(DeleteBehavior.SetNull);
            
        entity.HasOne(e => e.Route)
            .WithMany(r => r.Expenses)
            .HasForeignKey(e => e.RouteId)
            .OnDelete(DeleteBehavior.SetNull);
            
        entity.HasOne(e => e.Sightseeing)
            .WithMany(s => s.Expenses)
            .HasForeignKey(e => e.SightseeingId)
            .OnDelete(DeleteBehavior.SetNull);
    });
}
```

### Step 4: Connection String Configuration

Add to `appsettings.json` in JourneyJournal.Api:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=JourneyJournalDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Step 5: Register DbContext in Program.cs

```csharp
builder.Services.AddDbContext<JourneyJournalDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### Step 6: Create and Apply Migration

```powershell
cd C:\Users\s.korotkiy\Repo\JourneyJournal\src\JourneyJournal.Api
dotnet ef migrations add InitialCreate --project ..\JourneyJournal.Data
dotnet ef database update --project ..\JourneyJournal.Data
```

---

## Validation Rules Summary

### Trip
- Name: Required, 1-200 characters
- StartDate: Required
- EndDate: Optional, must be >= StartDate if provided

### TripPoint
- Name: Required, 1-200 characters
- TripId: Required, must reference existing Trip
- PointType: Required
- OrderIndex: Required, non-negative
- Coordinates: Valid latitude (-90 to 90) and longitude (-180 to 180)

### Accommodation
- Name: Required, 1-200 characters
- TripPointId: Required, must reference existing TripPoint
- CheckOutDate: Must be >= CheckInDate if both provided

### Route
- TripId: Required
- FromPointId: Required, must reference existing TripPoint
- ToPointId: Required, must reference existing TripPoint, must be different from FromPointId
- TransportationType: Required
- Cost: Must be positive if provided

### Expense
- TripId: Required
- Description: Required, 1-200 characters
- Amount: Required, must be positive
- Currency: Required, valid ISO 4217 code
- ExpenseDate: Required
- Only one of: AccommodationId, RouteId, SightseeingId can be set

### Sightseeing
- TripId: Required
- Name: Required, 1-200 characters
- Rating: 1-5 if provided
- Priority: 1-5 if provided

---

## Future Enhancements

### Phase 2 - Potential Features
1. **User Management**: Multi-user support with authentication
2. **Media Attachments**: Photo gallery for sightseeing and accommodations
3. **Weather Integration**: Weather forecast for planned dates
4. **Map Integration**: Visual route mapping
5. **Budget Tracking**: Budget vs actual expense comparison
6. **Sharing**: Share trip plans with travel companions
7. **Templates**: Reusable trip templates
8. **Reviews**: Rate and review accommodations and sightseeings after completion

---

## Implementation Checklist

- [ ] Create all entity classes with proper properties
- [ ] Create enum types (TripPointType, TransportationType, ExpenseCategory, PaymentStatus)
- [ ] Create JourneyJournalDbContext with all DbSets
- [ ] Configure all entity relationships in OnModelCreating
- [ ] Add connection string to appsettings.json
- [ ] Register DbContext in Program.cs
- [ ] Create initial migration
- [ ] Apply migration to database
- [ ] Verify database structure in SQL Server
- [ ] Create repository pattern (optional)
- [ ] Create API controllers for each entity
- [ ] Add data validation attributes
- [ ] Implement DTOs for API responses
- [ ] Add unit tests for entities and repositories
