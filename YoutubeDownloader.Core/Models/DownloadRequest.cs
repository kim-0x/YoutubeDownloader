public record DownloadRequest
(
    string VideoUrl,
    string SaveFolder,
    string? StartAt = null,
    string? EndAt = null
);
