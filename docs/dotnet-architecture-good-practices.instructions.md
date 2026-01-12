---
description: "DDD and .NET architecture guidelines"
applyTo: '**/*.cs,**/*.csproj,**/Program.cs,**/*.razor'
---

# DDD & .NET Architecture Guidelines

## Core Principles

### Domain-Driven Design (DDD)
- **Ubiquitous Language:** Use consistent business terminology across code and documentation
- **Bounded Contexts:** Clear service boundaries with well-defined responsibilities
- **Aggregates:** Ensure consistency boundaries and transactional integrity
- **Domain Events:** Capture and propagate business-significant occurrences
- **Rich Domain Models:** Business logic belongs in the domain layer

### SOLID Principles
- **Single Responsibility:** A class should have only one reason to change
- **Open/Closed:** Open for extension, closed for modification
- **Liskov Substitution:** Subtypes must be substitutable for base types
- **Interface Segregation:** No client should depend on methods it doesn't use
- **Dependency Inversion:** Depend on abstractions, not concretions

### .NET Best Practices
- **Async Programming:** Use `async`/`await` for I/O-bound operations
- **Dependency Injection:** Leverage built-in DI for loose coupling
- **LINQ:** Use for expressive data manipulation
- **Exception Handling:** Consistent error handling and logging strategy
- **Modern C# Features:** Use records, pattern matching, nullable reference types

## Layer Architecture

### Domain Layer
- **Aggregates:** Root entities maintaining consistency boundaries
- **Value Objects:** Immutable objects representing domain concepts
- **Domain Services:** Stateless services for complex operations
- **Domain Events:** Capture state changes
- **Specifications:** Encapsulate business rules

### Application Layer
- **Application Services:** Orchestrate domain operations
- **DTOs:** Transfer data between layers
- **Input Validation:** Validate before executing business logic
- **Dependency Injection:** Use constructor injection

### Infrastructure Layer
- **Repositories:** Aggregate persistence using domain interfaces
- **Event Bus:** Publish and subscribe to domain events
- **Data Mappers/ORMs:** Map domain to database schemas
- **External Adapters:** Integrate with external systems

## Testing Standards

### Test Naming Convention
Use `MethodName_Condition_ExpectedResult()` pattern:
```csharp
[Fact]
public void CreateTrip_WithValidData_ReturnsCreatedTrip()
{
    // Arrange
    var trip = new Trip { Name = "Summer Vacation" };
    
    // Act
    var result = _tripService.CreateTrip(trip);
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal("Summer Vacation", result.Name);
}
```

### Test Coverage
- Minimum 85% for domain and application layers
- Focus on domain logic and business rules
- Test aggregate boundaries
- Integration tests for persistence
- Acceptance tests for user scenarios

## Implementation Process

### 1. Domain Analysis (REQUIRED)
- Identify domain concepts and relationships
- Define aggregate boundaries
- Establish ubiquitous language
- Define business rules and invariants

### 2. Architecture Review (REQUIRED)
- Validate layer responsibilities
- Check SOLID principles adherence
- Plan domain events for decoupling
- Consider security at aggregate level

### 3. Implementation Planning (REQUIRED)
- List files to create/modify
- Define test cases with proper naming
- Plan error handling strategy
- Consider performance and scalability

### 4. Implementation
- Start with domain modeling
- Define aggregate boundaries
- Implement application services with validation
- Follow .NET best practices
- Add comprehensive tests
- Implement domain events
- Document decisions

## Quality Checklist

### Domain Design
- [ ] Aggregates model business concepts correctly
- [ ] Ubiquitous language used consistently
- [ ] SOLID principles followed
- [ ] Business rules encapsulated in aggregates
- [ ] Domain events properly published

### Implementation Quality
- [ ] Tests follow `MethodName_Condition_ExpectedResult()` pattern
- [ ] Async/await used for I/O operations
- [ ] Dependency injection implemented correctly
- [ ] Error handling comprehensive
- [ ] Performance considerations addressed
- [ ] Code documented appropriately

### Data Integrity
- [ ] Use `decimal` for monetary values
- [ ] Proper transaction boundaries
- [ ] Domain events for audit trail
- [ ] Validation at entry points

## Common Patterns

### Repository Pattern
```csharp
public interface ITripRepository
{
    Task<Trip> GetByIdAsync(int id);
    Task<IEnumerable<Trip>> GetAllAsync();
    Task AddAsync(Trip trip);
    Task UpdateAsync(Trip trip);
    Task DeleteAsync(int id);
}
```

### Domain Event Pattern
```csharp
public class TripCreatedEvent : IDomainEvent
{
    public int TripId { get; init; }
    public string TripName { get; init; }
    public DateTime CreatedAt { get; init; }
}
```

### Aggregate Pattern
```csharp
public class Trip : AggregateRoot
{
    private readonly List<TripPoint> _points = new();
    
    public void AddTripPoint(TripPoint point)
    {
        // Validate business rules
        ValidateBusinessRules(point);
        
        _points.Add(point);
        
        // Raise domain event
        RaiseDomainEvent(new TripPointAddedEvent(Id, point.Id));
    }
}
```

## Key Reminders

- Show analysis before implementation
- Validate against guidelines explicitly
- Follow test naming pattern strictly
- Encapsulate business logic in domain layer
- Use dependency injection consistently
- Document architectural decisions
