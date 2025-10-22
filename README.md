# YoutubeDownloader

An application for downloading and converting YouTube videos to audio files. This repository includes:

- **Console App**: Command-line interface for quick test infrastructure and core projects.
- **Web API**: ASP.NET Core backend for managing download requests, progress notifications, and file serving. Downloaded songs are currently managed in `SQLite` for simplicity and Entity Framework Core as ORM.
- **Angular Web UI**: Frontend for submitting download requests and getting progress in real time via SignalR. NgRx is used for application state management.

## Features

- Download audio streams from YouTube videos.
- Convert audio streams to MP3 format.
- Embed cover images into MP3 files.
- Real-time progress updates via SignalR.
- Serve downloadable audio files.
- Display songs in a scrollable list for play and download.
- Modular architecture with extensible services.

## Demo

![App Demo](https://private-user-images.githubusercontent.com/101366262/496762274-157df35a-6591-431c-ac4a-6d7d304772aa.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTk0MjYzNTcsIm5iZiI6MTc1OTQyNjA1NywicGF0aCI6Ii8xMDEzNjYyNjIvNDk2NzYyMjc0LTE1N2RmMzVhLTY1OTEtNDMxYy1hYzRhLTZkN2QzMDQ3NzJhYS5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDAyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAwMlQxNzI3MzdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lODFjZWRiZGVlNzMyNGIwNDc4NjFkODNlYjQ4Nzg4NGM0M2MyMmNiMDA1ODJlZjQ5ZDIzYzIzNWVkZGIzMTA1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.l9HkM9cd-xhCFCcGi2Jwl4tWpHgSbO86y6FKRgVSrSo)

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [EF Core Command-line](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli#install-the-tools) install cli for database migration and generated sql script for `Docker`
- [SQLite Command-line](https://sqlite.org/cli.html) It is optional but for interacting with database
- [Node.js & npm](https://nodejs.org/) (for Angular frontend)
- [FFmpeg](https://ffmpeg.org/) installed and available in your system PATH

### Running the Console App

```sh
cd YoutubeDownloader.ConsoleApp
dotnet run
```

### Running the Web API

```sh
cd YoutubeDownloader.WebApi
dotnet run
```

### Running the Angular Web UI

```sh
cd youtube-downloader-webui
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Deploying to Docker

```sh
cd YoutubeDownloader
docker compose -f 'docker-compose.yml' up -d --build
```

## API Endpoints

- `POST /api/download` — Start a new download request.
- `POST /api/download/{taskId}/cancel` — Cancel download video request.
- `GET /api/video` — Get video information such as title and duration.
- `GET /api/song` — Get list of song has been download.
- `POST /api/song` — Add a new song to the list.

## Progress Notifications

Progress and status updates are sent to clients via SignalR (`/hubs/notification`). The Angular frontend displays real-time progress and download links.

## Configuration

- Output folder and other settings can be configured in `appsettings.json` (Web API) or via environment variables.

**Note:** This project is for educational purposes. Please respect YouTube’s terms of service and copyright laws when using this tool.
