FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Sqlite3 cli
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ./YoutubeDownloader.WebApi ./YoutubeDownloader.WebApi
COPY ./YoutubeDownloader.Infrastructure ./YoutubeDownloader.Infrastructure
COPY ./YoutubeDownloader.Core ./YoutubeDownloader.Core

# Restore all projects
RUN dotnet restore ./YoutubeDownloader.WebApi/YoutubeDownloader.WebApi.csproj

# Build and publish
WORKDIR /src/YoutubeDownloader.WebApi
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY ./YoutubeDownloader.WebApi/Scripts ./scripts
COPY ./deployment/scripts/entrypoint.sh .
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]