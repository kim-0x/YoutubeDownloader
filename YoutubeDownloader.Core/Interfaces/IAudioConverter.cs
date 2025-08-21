public interface IAudioConverter
{
    Task<string> ConvertToMp3Async(string audioStreamFilePath, string saveFolder, VideoModel videoInfo, string? startAt = null, string? endAt = null);
}