CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;
CREATE TABLE "Songs" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Songs" PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "DateCreated" TEXT NOT NULL,
    "AudioPath" TEXT NOT NULL
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251017180230_InitialDatabase', '9.0.10');

COMMIT;

