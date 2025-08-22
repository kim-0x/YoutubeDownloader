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

    public async Task ExecuteAsync(DownloadRequest request)
    {
        string? audioStreamFilePath = null;
        string? coverImagePath = null;

        try
        {
            // Get video info
            var videoInfo = await GetVideoInfoAsync(request.VideoUrl);
            // Download audio stream with file extension (e.g., .webm, .m4a)
            audioStreamFilePath = await DownloadAudioStreamAsync(request.VideoUrl);
            // Map download and conversion request and convert to mp3
            var conversionRequest = new AudioConversionRequest(
                audioStreamFilePath,
                request.SaveFolder,
                videoInfo,
                request.StartAt,
                request.EndAt
            );

            var audioOutputFilePath = await ConvertToMp3Async(conversionRequest);
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

    protected virtual Task<VideoModel> GetVideoInfoAsync(string videoUrl)
    {
        return _videoInfoProvider.GetInfoAsync(videoUrl);
    }

    protected virtual Task<string> DownloadAudioStreamAsync(string videoUrl)
    {
        return _videoInfoProvider.DownloadAudioStreamAsync(videoUrl);
    }

    protected virtual Task<string> ConvertToMp3Async(AudioConversionRequest request)
    {
        return _audioConverter.ConvertToMp3Async(request);
    }

    protected virtual Task<string> GetCoverImageAsync(string videoUrl)
    {
        return _audioCoverEmbedder.GetCoverImageAsync(videoUrl);
    }

    protected virtual void EmbedCover(string audioFilePath, string coverImagePath)
    {
        _audioCoverEmbedder.EmbedCover(audioFilePath, coverImagePath);
    }
}