public record DownloadModel (
   string VideoUrl,
   string? Title = null,
   string? StartAt = null,
   string? EndAt = null 
);

public record VideoDto (
   string VideoUrl,
   string Title
);