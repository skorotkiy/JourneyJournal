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

From the root directory, run:

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
pwsh ./run-api.ps1
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
pwsh ./run-web.ps1
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

## 6. Useful Scripts

- `run-api.ps1` — Launches the backend API
- `run-web.ps1` — Launches the frontend web client
- `run-update-db.ps1` — Applies database migrations

---

## 7. Additional Notes

- CORS is enabled for `http://localhost:5173` and `http://localhost:3000` by default.
- Use the `JourneyJournal.Api.http` file for API testing (VS Code REST Client extension).
- For troubleshooting, check the API and web client terminal output for errors.

---

## 8. Clean Build (if needed)

```
dotnet clean JourneyJournal.sln
dotnet build JourneyJournal.sln
```

---

You're ready to develop and run JourneyJournal locally!
