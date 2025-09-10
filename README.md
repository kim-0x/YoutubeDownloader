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

## Progress Notifications

Progress and status updates are sent to clients via SignalR (`/hubs/notification`). The Angular frontend displays real-time progress and download links.

## Configuration

- Output folder and other settings can be configured in `appsettings.json` (Web API) or via environment variables.

**Note:** This project is for educational purposes. Please respect YouTube’s terms of service and copyright laws when using this tool.
