using Microsoft.Extensions.Caching.Memory;

public class YoutubeAudioDownloadService : AudioDownloadService
{
    private readonly IStageNotifier _stageNotifier;
    private readonly IOutputStorage _outputStorage;
    private readonly IMemoryCache _memoryCache;
    public YoutubeAudioDownloadService(
        IAudioCoverEmbedder audioCoverEmbedder,
        IAudioConverter audioConverter,
        IVideoInfoProvider videoInfoProvider,
        IOutputStorage outputStorage,
        IStageNotifier stageNotifier,
        IProgress<double> progressNotifier,
        IMemoryCache memoryCache)
        : base(videoInfoProvider, audioConverter, audioCoverEmbedder, progressNotifier)
    {
        _stageNotifier = stageNotifier;
        _outputStorage = outputStorage;
        _memoryCache = memoryCache;
    }
    
    protected override async Task<VideoModel> GetVideoInfoAsync(string videoUrl)
    {
        await _stageNotifier.ReportStageAsync(
            new ReportModel(ReportType.Progress, "Fetching video information...", 1, 5));

        if (_memoryCache.TryGetValue<VideoModel>(videoUrl, out var videoInfo))
        {
            if (videoInfo is not null)
            {
                return videoInfo;
            }
        }

        return await base.GetVideoInfoAsync(videoUrl);
    }
    protected override async Task<string> DownloadAudioStreamAsync(string videoUrl)
    {
        await _stageNotifier.ReportStageAsync(
            new ReportModel(ReportType.Progress, "Starting audio download...", 2, 5));
        return await base.DownloadAudioStreamAsync(videoUrl);
    }
    protected override async Task<string> ConvertToMp3Async(AudioConversionRequest request)
    {
        try
        {
            await _stageNotifier.ReportStageAsync(
                new ReportModel(ReportType.Progress, "Converting audio to MP3...", 3, 5));
            return await base.ConvertToMp3Async(request);
        }
        catch (Exception ex)
        {
            await _stageNotifier.ReportStageAsync(
                new ReportModel(ReportType.Error, $"Error during conversion: {ex.Message}"));
            throw;
        }
    }
    protected override async Task<string> GetCoverImageAsync(string videoUrl)
    {
        await _stageNotifier.ReportStageAsync(
            new ReportModel(ReportType.Progress, "Downloading cover image...", 4, 5));
        return await base.GetCoverImageAsync(videoUrl);
    }
    protected override async void EmbedCover(string audioOutputFilePath, string coverImagePath)
    {
        await _stageNotifier.ReportStageAsync(
            new ReportModel(ReportType.Progress, "Embedding cover image...", 5, 5));
        base.EmbedCover(audioOutputFilePath, coverImagePath);       
    }
    
    protected override async void OnCompleted(string audioFilePath)
    {
        var hostedAudioPath = _outputStorage.GetFileInPublicUrl(audioFilePath);
        await _stageNotifier.ReportStageAsync(
            new ReportModel(ReportType.Completed, hostedAudioPath));
    }
}