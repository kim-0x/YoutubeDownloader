public class YoutubeAudioDownloadService : AudioDownloadService
{
    public YoutubeAudioDownloadService(
        IAudioCoverEmbedder audioCoverEmbedder,
        IAudioConverter audioConverter,
        IVideoInfoProvider videoInfoProvider,
        IProgress<double>? progress = null)
        : base(videoInfoProvider, audioConverter, audioCoverEmbedder, progress)
    { }

    protected override Task<string> DownloadAudioStreamAsync(string videoUrl, CancellationToken cancellationToken = default)
    {
        Console.WriteLine("Downloading audio stream from Youtube...");
        return base.DownloadAudioStreamAsync(videoUrl, cancellationToken);
    }

    protected override Task<VideoModel> GetVideoInfoAsync(string videoUrl, CancellationToken cancellationToken = default)
    {
        Console.WriteLine("Fetching video info from Youtube...");
        return base.GetVideoInfoAsync(videoUrl, cancellationToken);
    }

    protected override Task<string> ConvertToMp3Async(AudioConversionRequest request, CancellationToken cancellationToken = default)
    {
        Console.WriteLine("Converting audio to MP3 format...");
        return base.ConvertToMp3Async(request, cancellationToken);
    }

    protected override Task<string> GetCoverImageAsync(string videoUrl, CancellationToken cancellationToken = default)
    {
        Console.WriteLine("Downloading cover image...");
        return base.GetCoverImageAsync(videoUrl, cancellationToken);
    }

    protected override void EmbedCover(string audioOutputFilePath, string coverImagePath)
    {
        Console.WriteLine("Embedding cover image into MP3 file...");
        base.EmbedCover(audioOutputFilePath, coverImagePath);
    }
    
    protected override void OnCompleted(string audioFilePath)
    {
        Console.WriteLine($"Audio download and processing completed: {audioFilePath}");
        base.OnCompleted(audioFilePath);
    }
}