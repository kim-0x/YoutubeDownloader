public record DownloadModel (
   string VideoUrl,
   string? StartAt = null,
   string? EndAt = null 
);