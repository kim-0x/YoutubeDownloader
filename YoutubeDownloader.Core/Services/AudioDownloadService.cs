public abstract class AudioDownloadService
{
    private readonly IVideoInfoProvider _videoInfoProvider;
    private readonly IAudioConverter _audioConverter;
    private readonly IAudioCoverEmbedder _audioCoverEmbedder;

    protected AudioDownloadService(IVideoInfoProvider videoInfoProvider, IAudioConverter audioConverter, IAudioCoverEmbedder audioCoverEmbedder)
    {
        _videoInfoProvider = videoInfoProvider;
        _audioConverter = audioConverter;
        _audioCoverEmbedder = audioCoverEmbedder;
    }

    public async Task ExecuteAsync(string urlPath, string saveFolder, string? startAt = null, string? endAt = null)
    {
        string? audioStreamFilePath = null;
        string? coverImagePath = null;

        try
        {
            // Get video info
            var videoInfo = await GetVideoInfoAsync(urlPath);
            // Download audio stream with file extension (e.g., .webm, .m4a)
            audioStreamFilePath = await DownloadAudioStreamAsync(urlPath);
            // Convert to mp3
            var audioOutputFilePath = await ConvertToMp3Async(audioStreamFilePath, saveFolder, videoInfo, startAt, endAt);
            if (!string.IsNullOrEmpty(videoInfo.ThumbnailUrl))
            {
                // Embed cover image
                coverImagePath = await GetCoverImageAsync(videoInfo.ThumbnailUrl);
                EmbedCover(audioOutputFilePath, coverImagePath);
            }
        }
        catch (Exception ex)
        {
            // Handle exceptions (e.g., log the error)
            throw new ApplicationException("An error occurred during the audio download process.", ex);
        }
        finally
        {
            // Cleanup temporary files if needed
            if (!string.IsNullOrEmpty(audioStreamFilePath))
                File.Delete(audioStreamFilePath);
            if (!string.IsNullOrEmpty(coverImagePath))
                File.Delete(coverImagePath);
        }
    }

    protected virtual Task<VideoModel> GetVideoInfoAsync(string urlPath)
    {
        return _videoInfoProvider.GetInfoAsync(urlPath);
    }

    protected virtual Task<string> DownloadAudioStreamAsync(string urlPath)
    {
        return _videoInfoProvider.DownloadAudioStreamAsync(urlPath);
    }

    protected virtual Task<string> ConvertToMp3Async(string audioStreamFilePath, string saveFolder, VideoModel videoInfo, string? startAt = null, string? endAt = null)
    {
        return _audioConverter.ConvertToMp3Async(audioStreamFilePath, saveFolder, videoInfo, startAt, endAt);
    }

    protected virtual Task<string> GetCoverImageAsync(string urlPath)
    {
        return _audioCoverEmbedder.GetCoverImageAsync(urlPath);
    }

    protected virtual void EmbedCover(string audioFilePath, string coverImagePath)
    {
        _audioCoverEmbedder.EmbedCover(audioFilePath, coverImagePath);
    }
}