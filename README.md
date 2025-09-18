# YoutubeDownloader

An application for downloading and converting YouTube videos to audio files. This repository includes:

- **Console App**: Command-line interface for quick test infrastructure and core projects.
- **Web API**: ASP.NET Core backend for managing download requests, progress notifications, and file serving.
- **Angular Web UI**: Frontend for submitting download requests and getting progress in real time via SignalR.

## Features

- Download audio streams from YouTube videos.
- Convert audio streams to MP3 format.
- Embed cover images into MP3 files.
- Real-time progress updates via SignalR.
- Serve downloadable audio files via API endpoint.
- Modular architecture with extensible services.

## Demo

![App Demo](https://private-user-images.githubusercontent.com/101366262/491199170-15de7f0e-bc2b-4510-9ce1-fe4fc7d93d9e.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTgyMTU0MzMsIm5iZiI6MTc1ODIxNTEzMywicGF0aCI6Ii8xMDEzNjYyNjIvNDkxMTk5MTcwLTE1ZGU3ZjBlLWJjMmItNDUxMC05Y2UxLWZlNGZjN2Q5M2Q5ZS5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTE4JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkxOFQxNzA1MzNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iMzIyY2ZiODJkNGM4ZDY4OGIzZDVkOTJkMzI2ZWJhZDc5NTZkNzY4ZDA1ZGI4MDAxNzJmMjMwZTZhNThhMGI1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.-PI0NiLEI6L46B-q3kL4LUvQ7U9bUsmJ0pbID_xrIWo)

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
