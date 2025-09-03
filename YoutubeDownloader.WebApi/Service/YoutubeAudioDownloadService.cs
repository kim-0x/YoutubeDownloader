public class YoutubeAudioDownloadService : AudioDownloadService
{
    private readonly IStageNotifier _stageNotifier;
    private readonly IOutputStorage _outputStorage;
    public YoutubeAudioDownloadService(
        IAudioCoverEmbedder audioCoverEmbedder,
        IAudioConverter audioConverter,
        IVideoInfoProvider videoInfoProvider,        
        IOutputStorage outputStorage,
        IStageNotifier stageNotifier)
        : base(videoInfoProvider, audioConverter, audioCoverEmbedder)
    {
        _stageNotifier = stageNotifier;
        _outputStorage = outputStorage;
    }
    protected override async Task<VideoModel> GetVideoInfoAsync(string videoUrl)
    {
        await _stageNotifier.ReportStageAsync(
            new ReportModel(ReportType.Progress, "Fetching video information...", 1, 5));
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
        } catch (Exception ex)
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

        var hostedAudioPath = _outputStorage.GetFileInPublicUrl(audioOutputFilePath);
        await _stageNotifier.ReportStageAsync(
            new ReportModel(ReportType.Completed, $"Download completed. {hostedAudioPath}"));
    }
}