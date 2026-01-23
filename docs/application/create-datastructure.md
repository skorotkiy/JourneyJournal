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
- **PlaceToVisit**: Places of interest with detailed information

## Entity Structure


### 1. Trip Entity

**Purpose**: Main entity representing a complete trip (planned or completed)

**Properties**:
- `TripId` (int, PK): Primary key
- `Name` (string, required, max 200): Trip name/title
- `StartDate` (DateTime, required): Trip start date
- `EndDate` (DateTime, nullable): Trip end date
- `IsCompleted` (bool): Flag indicating if trip is completed or still planned
- `Description` (string, nullable): General trip description
- `TotalCost` (decimal(18,2), nullable): Total trip cost
- `Currency` (string, nullable, max 3): Currency code (USD, EUR, etc.)
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Has many `TripPoints` (1:N)
- Has many `Expenses` (1:N)

---

### 2. TripPoint Entity

**Purpose**: Represents a location in the trip (start, intermediate stops, or destination)

**Properties**:
- `TripPointId` (int, PK): Primary key
- `TripId` (int, FK, required): Foreign key to Trip
- `Name` (string, required, max 200): Location/city name
- `Order` (int, required): Sequential order of this point in the trip (0-based)
- `ArrivalDate` (DateTime, nullable): Arrival date to this point
- `DepartureDate` (DateTime, nullable): Departure date from this point
- `Address` (string, nullable, max 500): Full address or location details
- `Notes` (string, nullable): Additional notes about this point
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `Trip` (N:1)
- Has many `Accommodations` (1:N)
- Has many `Routes` as FromPoint (1:N)
- Has many `Routes` as ToPoint (1:N)
- Has many `PlaceToVisit` (1:N)

---

### 3. Accommodation Entity

**Purpose**: Represents lodging/accommodation at a trip point

**Properties**:
- `AccommodationId` (int, PK): Primary key
- `TripPointId` (int, FK, required): Foreign key to TripPoint
- `Name` (string, required, max 200): Accommodation name
- `AccommodationType` (enum): Booking (1), Hotel(2), Apartment(3), Airbnb(4), Other(5)
- `Address` (string, nullable, max 500): Full address
- `CheckInDate` (DateTime, nullable): Check-in date and time
- `CheckOutDate` (DateTime, nullable): Check-out date and time
- `WebsiteUrl` (string, nullable, max 500): Website URL
- `Cost` (decimal(18,2), nullable): Total accommodation cost
- `Status` (enum): Planned(1), Confirmed(2), PaymentRequired(3), Paid(4), Cancelled(5)
- `Notes` (string, nullable): Additional notes or special requirements (Email, PhoneNumber, ConfirmationNumber)
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `TripPoint` (N:1)

---

### 4. Route Entity

**Purpose**: Represents transportation route between two trip points with support for multiple route options

**Properties**:
- `RouteId` (int, PK): Primary key
- `FromPointId` (int, FK, required): Starting point foreign key
- `ToPointId` (int, FK, required): Destination point foreign key
- `Name` (string, required, max 200): Route name/description
- `TransportationType` (enum): Flight(1), Train(2), Bus(3), Car(4), Walking(5), Other(6)
- `Carrier` (string, nullable, max 200): Carrier/company name
- `DepartureTime` (DateTime, nullable): Departure date and time
- `ArrivalTime` (DateTime, nullable): Arrival date and time
- `DurationMinutes` (int, nullable): Duration in minutes
- `Cost` (decimal(18,2), nullable): Route cost
- `IsSelected` (bool, required, default false): Indicates if this is the selected/preferred route option
- `Notes` (string, nullable): Additional route notes or directions:  Flight/train/bus number
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `TripPoint` as FromPoint (N:1)
- Belongs to one `TripPoint` as ToPoint (N:1)

**Business Rules**:
- Multiple routes can exist between the same two points (allowing comparison of options)
- Only one route between two points should have `IsSelected = true` at a time
- FromPointId and ToPointId must be different

---

### 5. Expense Entity

**Purpose**: Tracks additional trip expenses with categorization and associations

**Properties**:
- `ExpenseId` (int, PK): Primary key
- `TripId` (int, FK, required): Foreign key to Trip
- `Description` (string, required, max 200): Expense description
- `Category` (enum): Transportation(1), Restourant(2), Food(3), Entertainment(4), Shopping(5), Fee(6), Living(7), Other(8)
- `Amount` (decimal(18,2), required): Expense amount
- `ExpenseDate` (DateTime, required): Date of expense
- `PaymentMethod` (enum): Cash(1), Credit Card(2)
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `Trip` (N:1, required)

**Business Rules**:
- At most one of AccommodationId, RouteId, or SightseeingId can be set
- Amount must be positive

---

### 6. PlaceToVisit Entity

**Purpose**: Places of interest, tourist attractions, and points to visit

**Properties**:
- `PlaceToVisitId` (int, PK): Primary key
- `TripPointId` (int, FK, nullable): Optional link to TripPoint (location)
- `Name` (string, required, max 200): Place/attraction name
- `Category` (enum): Museum(1), Park(2), Restaurant(3), Site(4), Other(5)
- `Address` (string, nullable, max 500): Full address
- `Description` (string, nullable): Detailed description of the place
- `Price` (decimal(18,2), nullable): Entrance fee or cost
- `WebsiteUrl` (string, nullable, max 500): Official website URL
- `UsefulLinks` (string, nullable, max 2000): Additional useful links (JSON array or comma-separated)
- `Order` (short int, required): Sequential order of this place in the trip point (0-based)
- `Rating` (short int, nullable): Personal rating (1-5 stars)
- `VisitDate` (DateTime, nullable): Planned or actual visit date and time
- `VisitStatus` (enum): Planned(1), Visited(2), Skipped(3)
- `AfterVisitNotes` (string, nullable): Personal notes or review
- `CreatedAt` (DateTime, required): Record creation timestamp (UTC)
- `UpdatedAt` (DateTime, nullable): Record last update timestamp (UTC)

**Relationships**:
- Belongs to one `TripPoint` (N:1, optional)

**Business Rules**:
- Rating must be between 1 and 5 if provided
- Priority must be between 1 and 5 if provided

---

## Database Schema Design

### Table Names
- `Trip`
- `TripPoint`
- `Accommodation`
- `Route`
- `Expense`
- `PlaceToVisit`

### Indexes to Create

**Performance Indexes**:
- `Trips`: Index on `StartDate`, `IsCompleted`
- `TripPoints`: Index on `TripId, Order`
- `Accommodations`: Index on `TripPointId`
- `Routes`: Index on `FromPointId, ToPointId`, `IsSelected`
- `Expenses`: Index on `TripId, Category`, `ExpenseDate`
- `PlaceToVisit`: Index on `TripPointId`, `VisitDate`, `Order`

### Cascade Delete Rules
- Trip deletion → Cascade delete all TripPoints and Expenses
- TripPoint deletion → Cascade delete Accommodations and PlaceToVisit
- TripPoint deletion → Restrict if referenced by Routes (must delete routes first)

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
