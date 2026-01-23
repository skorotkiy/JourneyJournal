# JourneyJournal Copilot Instructions

## Architecture Overview

This is a **full-stack travel planning application** with:
- **Backend**: ASP.NET Core 10 Web API (`src/JourneyJournal.Api`)
- **Data Layer**: Entity Framework Core 10 with SQLite (`src/JourneyJournal.Data`)
- **Frontend**: React 19 + TypeScript 5.9 + Vite 7 + Material-UI 7 (`src/JourneyJournal.Web`)

The application manages travel trips with complex hierarchical data: `Trip → TripPoint → (Accommodations, PlacesToVisit, Routes)`.

## Critical Data Model Pattern

**Aggregate Root**: `Trip` is the aggregate root with cascade deletion enabled for all child entities.

**Self-referencing Routes**: Routes link TripPoints bidirectionally (`FromPoint`/`ToPoint`) with `DeleteBehavior.Restrict` to prevent circular deletion issues. When updating trips, ALL related data (TripPoints, Accommodations, Routes, etc.) is deleted and recreated - see [TripService.cs](../src/JourneyJournal.Api/Services/TripService.cs) UpdateTripAsync method.

**Entity Relationships**:
```
Trip (1:N) → TripPoint (1:N) → Accommodations
                              → PlacesToVisit (ordered by Order)
           → Expense
TripPoint (M:N via Route) → TripPoint (RoutesFrom/RoutesTo)
```

## Technology Stack Conventions

### Backend (.NET 10)

- **Mapping**: Uses **Mapster** (NOT AutoMapper) - configure in [MappingConfig.cs](../src/JourneyJournal.Api/Mapping/MappingConfig.cs)
- **Error Handling**: Global exception handler implements RFC 7807 Problem Details - see [GlobalExceptionHandler.cs](../src/JourneyJournal.Api/Middleware/GlobalExceptionHandler.cs)
- **Service Layer Pattern**: Business logic in services (e.g., `TripService`, `ExpenseService`), controllers are thin orchestrators
- **DTOs**: Separate Input/Output DTOs - `CreateXRequest`, `UpdateXRequest` for inputs; `XDto` for outputs
- **Validation**: Use Data Annotations on entities and DTOs; service layer throws `ArgumentException` (400), `KeyNotFoundException` (404), `InvalidOperationException` (400)
- **Connection String**: SQLite database path in `appsettings.json`: `"../JourneyJournal.Data/db/journeydb.sqlite"`

### Frontend (React + TypeScript)

- **API Communication**: Axios client in [api.ts](../src/JourneyJournal.Web/src/services/api.ts) with auth interceptors (token-based auth stub)
- **State Management**: Local component state with `useState` - no global state library currently used
- **Routing**: React Router v7 - routes defined in `App.tsx`
- **Styling**: Material-UI 7 with Emotion - use MUI components and `sx` prop for styling
- **API Base URL**: Set via `VITE_API_URL` in [.env.development](../src/JourneyJournal.Web/.env.development) (default: `http://localhost:5062/api`)

## Development Workflows

### Backend Commands (from `src/JourneyJournal.Api` directory)

```powershell
# Run API (launches on https://localhost:5062 or http://localhost:5062)
dotnet run

# Build solution (from root)
dotnet build JourneyJournal.sln

# Create EF migration (from src/JourneyJournal.Data)
dotnet ef migrations add MigrationName --startup-project ../JourneyJournal.Api

# Apply migrations
dotnet ef database update --startup-project ../JourneyJournal.Api
```

### Frontend Commands (from `src/JourneyJournal.Web` directory)

```powershell
# Install dependencies
npm install

# Run dev server (launches on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## Key Implementation Patterns

### Creating Nested Data (Backend)

When creating/updating Trips with nested TripPoints, Routes, etc., the service layer:
1. Validates business rules (date ranges, ratings 1-5, route integrity)
2. Creates entities in correct order (Trip → TripPoints → Routes)
3. Routes are created AFTER all TripPoints to ensure `FromPointId`/`ToPointId` exist
4. Uses `Order` property for TripPoint sequencing and PlaceToVisit ordering

See [TripService.cs](../src/JourneyJournal.Api/Services/TripService.cs) `CreateTripAsync` for reference implementation.

### EF Core Query Patterns

Always use explicit `Include()` for eager loading related data - example:
```csharp
var trips = await _context.Trips
    .Include(t => t.TripPoints)
        .ThenInclude(tp => tp.Accommodations)
    .Include(t => t.TripPoints)
        .ThenInclude(tp => tp.PlacesToVisit)
    .ToListAsync();
```

### Frontend Service Pattern

Each entity has a typed service in `src/services/` - example:
```typescript
export const tripService = {
  getAll: async (): Promise<Trip[]> => { /* ... */ },
  getById: async (id: string): Promise<Trip> => { /* ... */ },
  create: async (trip: CreateTripRequest): Promise<Trip> => { /* ... */ },
  // ...
};
```

## Enums Used

Located in `src/JourneyJournal.Data/Enums/`:
- `AccommodationType`, `AccommodationStatus`
- `TransportationType`
- `ExpenseCategory`, `PaymentMethod`
- `PlaceToVisitCategory`, `VisitStatus`

Use same enum values on frontend TypeScript types.

## Testing & Debugging

- **API Testing**: Use `JourneyJournal.Api.http` file for HTTP requests (VS Code REST Client extension)
- **Database**: SQLite file at `src/JourneyJournal.Data/db/journeydb.sqlite` - use SQLite browser for inspection
- **CORS**: API allows `http://localhost:5173` and `http://localhost:3000` - update in [Program.cs](../src/JourneyJournal.Api/Program.cs) if needed

## Documentation References

Additional architecture guidance in `docs/`:
- `aspnet-rest-apis.instructions.md` - API best practices
- `dotnet-architecture-good-practices.instructions.md` - .NET patterns
- `reactjs.instructions.md` - React conventions
- `typescript-5-es2022.instructions.md` - TypeScript standards
