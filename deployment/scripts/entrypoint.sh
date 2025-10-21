#!/bin/bash

# Exit immediately on error
set -e

DB_PATH="/app/data/youtubedownloader.db"
INIT_SCRIPT="/app/scripts/init_db.sql"

echo "Starting container init script..."

if [ ! -f "$DB_PATH" ]; then
    echo "Database file not found. Creating new database at $DB_PATH"
    sqlite3 "$DB_PATH" < "$INIT_SCRIPT"
    echo "Database initialized."
else
    echo "Database file found at $DB_PATH. Skipping initialization."
fi

echo "Database is ready."
sqlite3 "$DB_PATH" ".tables"

echo "Starting the application..."
exec dotnet YoutubeDownloader.WebApi.dll