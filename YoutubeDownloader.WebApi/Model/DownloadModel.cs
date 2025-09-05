public record DownloadModel (
   string VideoUrl,
   string? StartAt = null,
   string? EndAt = null 
);

public record VideoDto (
   string VideoUrl,
   string Title
);