# Application Structure

## Overview

This document provides instructions for creating the JourneyJournal application structure. The application follows a three-tier architecture with a .NET Core API backend, React frontend, and Entity Framework Core data layer.

## Architecture

- **Frontend**: React + TypeScript + Vite (JourneyJournal.Web)
- **Backend API**: .NET Core Web API (JourneyJournal.Api)
- **Data Layer**: .NET Core Class Library with Entity Framework Core (JourneyJournal.Data)

## Project Creation Commands

### 1. Create .NET Core Web API Project

Navigate to the `src` folder and create the API project:

```powershell
cd C:\Users\s.korotkiy\Repo\JourneyJournal\src
dotnet new webapi -n JourneyJournal.Api
```

This creates a REST API project that will serve HTTP requests from the web client.

### 2. Create Data Layer Project (.NET Core Class Library)

Create the data layer project using Entity Framework Core:

```powershell
dotnet new classlib -n JourneyJournal.Data
cd JourneyJournal.Data
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
cd ..
```

This project will contain:
- Database context
- Entity models
- Migration scripts
- Repository patterns (optional)

### 3. Add Project Reference

Add a reference to the Data project in the API project:

```powershell
cd JourneyJournal.Api
dotnet add reference ..\JourneyJournal.Data\JourneyJournal.Data.csproj
cd ..
```

### 4. Create React + TypeScript + Vite Web Client

Create the frontend project using Vite:

```powershell
npm create vite@latest JourneyJournal.Web -- --template react-ts
cd JourneyJournal.Web
npm install
cd ..
```

This creates a modern React application with:
- TypeScript support
- Vite for fast development and building
- Hot module replacement (HMR)

## Expected Project Structure

After creation, the structure should be:

```
JourneyJournal/
├── docs/
│   └── appstructure.md
└── src/
    ├── JourneyJournal.Api/         # .NET Core Web API
    │   ├── Controllers/
    │   ├── Program.cs
    │   ├── appsettings.json
    │   └── JourneyJournal.Api.csproj
    │
    ├── JourneyJournal.Data/        # Data Layer (EF Core)
    │   ├── Models/                 # Entity models
    │   ├── Migrations/             # EF migrations
    │   ├── DbContext.cs            # Database context
    │   └── JourneyJournal.Data.csproj
    │
    └── JourneyJournal.Web/         # React Frontend
        ├── src/
        ├── public/
        ├── package.json
        ├── vite.config.ts
        └── tsconfig.json
```

## Project Dependencies

### JourneyJournal.Api Dependencies
- Microsoft.AspNetCore.OpenApi
- Swashbuckle.AspNetCore (API documentation)
- Reference to JourneyJournal.Data

### JourneyJournal.Data Dependencies
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer (or your preferred provider)
- Microsoft.EntityFrameworkCore.Design
- Microsoft.EntityFrameworkCore.Tools

### JourneyJournal.Web Dependencies
- React
- React-DOM
- TypeScript
- Vite
- Additional packages as needed (axios, react-router-dom, etc.)

## Next Steps After Project Creation

1. **Configure API**:
   - Set up CORS policy to allow requests from the React app
   - Configure Entity Framework connection string in appsettings.json
   - Register DbContext in Program.cs

2. **Set Up Data Layer**:
   - Create DbContext class
   - Define entity models
   - Run initial migration: `dotnet ef migrations add InitialCreate`
   - Update database: `dotnet ef database update`

3. **Configure Web Client**:
   - Set up API base URL for HTTP requests
   - Configure proxy in vite.config.ts for development
   - Install additional dependencies (axios, react-router, etc.)

4. **Development Workflow**:
   - Run API: `dotnet run` from JourneyJournal.Api folder
   - Run Web: `npm run dev` from JourneyJournal.Web folder

## Architecture Decisions

- **Separation of Concerns**: Three distinct projects for API, Data, and UI
- **Entity Framework Core**: For database operations and migrations
- **React + TypeScript**: Type-safe frontend development
- **Vite**: Modern, fast build tool for optimal development experience
- **RESTful API**: Standard HTTP API for communication between frontend and backend
