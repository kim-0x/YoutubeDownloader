public class YoutubeAudioDownloadService : AudioDownloadService
{
    private readonly IProgressNotifier _progressNotifier;
    private readonly IWebHostEnvironment _environment;
    public YoutubeAudioDownloadService(
        IAudioCoverEmbedder audioCoverEmbedder,
        IAudioConverter audioConverter,
        IVideoInfoProvider videoInfoProvider,
        IProgressNotifier progressNotifier,
        IWebHostEnvironment environment)
        : base(videoInfoProvider, audioConverter, audioCoverEmbedder)
    {
        _progressNotifier = progressNotifier;
        _environment = environment;
    }
    protected override async Task<VideoModel> GetVideoInfoAsync(string videoUrl)
    {
        await _progressNotifier.ReportProgressAsync(
            new ReportModel(ReportType.Progress, "Fetching video information...", 1, 5));
        return await base.GetVideoInfoAsync(videoUrl);
    }
    protected override async Task<string> DownloadAudioStreamAsync(string videoUrl)
    {
        await _progressNotifier.ReportProgressAsync(
            new ReportModel(ReportType.Progress, "Starting audio download...", 2, 5));
        return await base.DownloadAudioStreamAsync(videoUrl);
    }
    protected override async Task<string> ConvertToMp3Async(AudioConversionRequest request)
    {
        await _progressNotifier.ReportProgressAsync(
            new ReportModel(ReportType.Progress, "Converting audio to MP3...", 3, 5));
        return await base.ConvertToMp3Async(request);
    }
    protected override async Task<string> GetCoverImageAsync(string videoUrl)
    {
        await _progressNotifier.ReportProgressAsync(
            new ReportModel(ReportType.Progress, "Downloading cover image...", 4, 5));
        return await base.GetCoverImageAsync(videoUrl);
    }
    protected override async void EmbedCover(string audioOutputFilePath, string coverImagePath)
    {
        await _progressNotifier.ReportProgressAsync(
            new ReportModel(ReportType.Progress, "Embedding cover image...", 5, 5));
        base.EmbedCover(audioOutputFilePath, coverImagePath);

        var hostedAudioPath = audioOutputFilePath.Replace(_environment.WebRootPath, "https://localhost:7085");
        await _progressNotifier.ReportProgressAsync(
            new ReportModel(ReportType.Completed, $"Download completed. {hostedAudioPath}"));
    }
}