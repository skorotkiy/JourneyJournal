# JourneyJournal

JourneyJournal is a modern, full-stack travel planning application designed to help users organize, track, and manage their trips with ease. It provides a comprehensive platform for planning travel itineraries, managing accommodations, tracking expenses, and visualizing routes between destinations.

## Key Features
- **Trip Management:** Create, edit, and delete trips with detailed information.
- **Itinerary Planning:** Organize trips into multiple trip points (destinations), each with its own accommodations, places to visit, and routes.
- **Expense Tracking:** Log and categorize expenses for each trip.
- **Route Visualization:** Define and manage routes between trip points.
- **Default Trip:** Mark one trip as the default for quick access.
- **Audit & History:** Automatic tracking of creation and update times.

## Technology Stack
- **Backend:** ASP.NET Core 10 Web API (C#)
- **Frontend:** React 19, TypeScript 5.9, Vite, Material-UI 7
- **Database:** SQLite (Entity Framework Core 10)

## Architecture Overview
- **Backend:**
  - RESTful API with DTOs for input/output
  - Business logic in service layer (e.g., TripService)
  - Cascade deletion for trip hierarchies, restrict for routes
  - Mapster for object mapping
- **Frontend:**
  - Modern React SPA with Material-UI styling
  - Axios for API communication
  - Local state management (no global state library)
  - Typed services for API access

## Main Entities
- **Trip:** The root entity, containing trip points, expenses, and metadata
- **TripPoint:** Represents a destination or stop within a trip
- **Accommodation:** Lodging details for each trip point
- **PlaceToVisit:** Points of interest, ordered by visit sequence
- **Route:** Connections between trip points (with transport info)
- **Expense:** Financial records for the trip

## Getting Started
See [SETUP.md](SETUP.md) for installation and local development instructions.

---

JourneyJournal is ideal for travelers, travel bloggers, and anyone who wants to keep their journeys organized and memorable.
