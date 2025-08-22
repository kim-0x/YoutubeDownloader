public record AudioConversionRequest(
    string AudioStreamFilePath,
    string SaveFolder,
    VideoModel VideoInfo,
    string? StartAt = null,
    string? EndAt = null
);