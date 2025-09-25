# YoutubeDownloader

An application for downloading and converting YouTube videos to audio files. This repository includes:

- **Console App**: Command-line interface for quick test infrastructure and core projects.
- **Web API**: ASP.NET Core backend for managing download requests, progress notifications, and file serving. Downloaded songs are currently managed in a JSON file for simplicity.
- **Angular Web UI**: Frontend for submitting download requests and getting progress in real time via SignalR. NgRx is used for application state management.

## Features

- Download audio streams from YouTube videos.
- Convert audio streams to MP3 format.
- Embed cover images into MP3 files.
- Real-time progress updates via SignalR.
- Serve downloadable audio files via API endpoint.
- Display songs in a scrollable list for play and download.
- Modular architecture with extensible services.

## Demo

![App Demo](https://private-user-images.githubusercontent.com/101366262/494123273-2f48a10c-5b03-4e07-b692-11529a9c18c3.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTg4MzM4MjcsIm5iZiI6MTc1ODgzMzUyNywicGF0aCI6Ii8xMDEzNjYyNjIvNDk0MTIzMjczLTJmNDhhMTBjLTViMDMtNGUwNy1iNjkyLTExNTI5YTljMThjMy5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTI1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkyNVQyMDUyMDdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04OTcwOTBiNTU4MTJmZjExNDcwNjJhNjNkNzJmMTgwNGMxNTA0YmM0Y2E4NTBkYzNhMzg2MjAwZmQwNjYxMThkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.xYwK4j3iS95zq5DDevmuJFX1j4m_wRyc3QT9lbqW1eY)

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
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

## API Endpoints

- `POST /api/download` — Start a new download request.
- `GET /api/video` — Get video information such as title and duration.
- `GET /api/song` — Get list of song has been download.
- `POST /api/song` — Add a new song to the list.

## Progress Notifications

Progress and status updates are sent to clients via SignalR (`/hubs/notification`). The Angular frontend displays real-time progress and download links.

## Configuration

- Output folder and other settings can be configured in `appsettings.json` (Web API) or via environment variables.

**Note:** This project is for educational purposes. Please respect YouTube’s terms of service and copyright laws when using this tool.
