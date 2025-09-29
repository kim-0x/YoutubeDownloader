public abstract class AudioDownloadService
{
    private readonly IVideoInfoProvider _videoInfoProvider;
    private readonly IAudioConverter _audioConverter;
    private readonly IAudioCoverEmbedder _audioCoverEmbedder;
    private readonly IProgress<double>? _progress;

    protected AudioDownloadService(IVideoInfoProvider videoInfoProvider,
        IAudioConverter audioConverter,
        IAudioCoverEmbedder audioCoverEmbedder,
        IProgress<double>? progress = null)
    {
        _videoInfoProvider = videoInfoProvider;
        _audioConverter = audioConverter;
        _audioCoverEmbedder = audioCoverEmbedder;
        _progress = progress ?? new Progress<double>();
    }

    public async Task ExecuteAsync(DownloadRequest request, CancellationToken cancellationToken = default)
    {
        string? audioStreamFilePath = null;
        string? coverImagePath = null;

        try
        {
            OnStart();

            // Get video info
            var videoInfo = await GetVideoInfoAsync(request.VideoUrl, cancellationToken);

            // Download audio stream with file extension (e.g., .webm, .m4a)
            audioStreamFilePath = await DownloadAudioStreamAsync(request.VideoUrl, cancellationToken);

            // Map download and conversion request and convert to mp3
            var conversionRequest = new AudioConversionRequest(
                audioStreamFilePath,
                request.SaveFolder,
                videoInfo,
                request.StartAt,
                request.EndAt
            );

            var audioOutputFilePath = await ConvertToMp3Async(conversionRequest, cancellationToken);

            if (!string.IsNullOrEmpty(videoInfo.ThumbnailUrl))
            {
                // Embed cover image
                coverImagePath = await GetCoverImageAsync(videoInfo.ThumbnailUrl, cancellationToken);
                EmbedCover(audioOutputFilePath, coverImagePath);
            }

            OnCompleted(audioOutputFilePath);
        }
        catch (OperationCanceledException cancelException)
        {
            Console.WriteLine(cancelException.Message, cancelException.CancellationToken);
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

    protected virtual void OnStart()
    {
        // Optionally override to handle start event (e.g., notify user)
    }

    protected virtual Task<VideoModel> GetVideoInfoAsync(string videoUrl, CancellationToken cancellationToken = default)
    {
        return _videoInfoProvider.GetInfoAsync(videoUrl, _progress, cancellationToken);
    }

    protected virtual Task<string> DownloadAudioStreamAsync(string videoUrl, CancellationToken cancellationToken = default)
    {
        return _videoInfoProvider.DownloadAudioStreamAsync(videoUrl, _progress, cancellationToken);
    }

    protected virtual Task<string> ConvertToMp3Async(AudioConversionRequest request, CancellationToken cancellationToken = default)
    {
        return _audioConverter.ConvertToMp3Async(request, _progress, cancellationToken);
    }

    protected virtual Task<string> GetCoverImageAsync(string videoUrl, CancellationToken cancellationToken = default)
    {
        return _audioCoverEmbedder.GetCoverImageAsync(videoUrl, _progress, cancellationToken);
    }

    protected virtual void EmbedCover(string audioFilePath, string coverImagePath)
    {
        _audioCoverEmbedder.EmbedCover(audioFilePath, coverImagePath, _progress);
    }

    protected virtual void OnCompleted(string audioFilePath)
    {
        // Optionally override to handle completion (e.g., notify user)
    }
}