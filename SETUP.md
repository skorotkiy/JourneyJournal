# JourneyJournal Setup Guide

This guide will help you set up the JourneyJournal application for local development.

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)
- [Node.js (v18+ recommended)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- (Optional) [SQLite Browser](https://sqlitebrowser.org/) for database inspection

---

## 1. Clone the Repository

```
git clone <your-repo-url>
cd JourneyJournal
```

---

## 2. Database Setup

The application uses SQLite. The database file is located at:

```
src/JourneyJournal.Data/db/journeydb.sqlite
```


### Apply Migrations (if needed)


You can apply migrations using the provided PowerShell script:

```
pwsh ./scripts/run-update-db.ps1
```

Or manually:

```
dotnet build JourneyJournal.sln
cd src/JourneyJournal.Data
# Create DB and apply migrations
dotnet ef database update --startup-project ../JourneyJournal.Api
```

---

## 3. Launch the API


From the root directory, run:

```
pwsh ./scripts/run-api.ps1
```

Or manually:

```
dotnet run --project src/JourneyJournal.Api
```

The API will be available at:
- http://localhost:5062/api

---

## 4. Launch the Web Client


From the root directory:

```
pwsh ./scripts/run-web.ps1
```

Or manually:

```
cd src/JourneyJournal.Web
npm install
npm run dev
```

The web client will be available at:
- http://localhost:5173

---

## 5. Environment Variables

- API base URL is set in `src/JourneyJournal.Web/.env.development` as `VITE_API_URL`.
- Default: `http://localhost:5062/api`

---


## 6. PowerShell Scripts


**Important:** You should run `run-update-db.ps1` first to ensure the database and migrations are up to date before starting the API or web client.



There are three helpful PowerShell scripts in the scripts folder to simplify common development tasks:

- **run-update-db.ps1**
	- Applies Entity Framework Core migrations to the SQLite database
	- Usage: `pwsh ./scripts/run-update-db.ps1`

- **run-api.ps1**
	- Starts the backend API server (ASP.NET Core)
	- Usage: `pwsh ./scripts/run-api.ps1`

- **run-web.ps1**
	- Starts the frontend React web client (Vite dev server)
	- Usage: `pwsh ./scripts/run-web.ps1`

You can run these scripts from the project root in any PowerShell terminal. They automate the most common setup and development steps for you.

----


## 7. Additional Notes

- CORS is enabled for `http://localhost:5173` and `http://localhost:3000` by default.
- Use the `JourneyJournal.Api.http` file for API testing (VS Code REST Client extension).
- For troubleshooting, check the API and web client terminal output for errors.

### First Run: Restore Dependencies

After cloning the repository, you must restore all required NuGet packages before building or running the project. Simply run:

```
dotnet restore
```

in the root of the repository.

---

## 8. Clean Build (if needed)

```
dotnet clean JourneyJournal.sln
dotnet build JourneyJournal.sln
```

---

You're ready to develop and run JourneyJournal locally!
