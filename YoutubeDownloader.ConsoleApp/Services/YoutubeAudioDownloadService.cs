public class YoutubeAudioDownloadService : AudioDownloadService
{
    public YoutubeAudioDownloadService(
        IAudioCoverEmbedder audioCoverEmbedder,
        IAudioConverter audioConverter,
        IVideoInfoProvider videoInfoProvider,
        IProgress<double>? progress = null) 
        : base(videoInfoProvider, audioConverter, audioCoverEmbedder, progress)
    {}

    protected override Task<string> DownloadAudioStreamAsync(string videoUrl)
    {
        Console.WriteLine("Downloading audio stream from Youtube...");
        return base.DownloadAudioStreamAsync(videoUrl);
    }

    protected override Task<VideoModel> GetVideoInfoAsync(string videoUrl)
    {
        Console.WriteLine("Fetching video info from Youtube...");
        return base.GetVideoInfoAsync(videoUrl);
    }

    protected override Task<string> ConvertToMp3Async(AudioConversionRequest request)
    {
        Console.WriteLine("Converting audio to MP3 format...");
        return base.ConvertToMp3Async(request);
    }

    protected override Task<string> GetCoverImageAsync(string videoUrl)
    {
        Console.WriteLine("Downloading cover image...");
        return base.GetCoverImageAsync(videoUrl);
    }

    protected override void EmbedCover(string audioOutputFilePath, string coverImagePath)
    {
        Console.WriteLine("Embedding cover image into MP3 file...");
        base.EmbedCover(audioOutputFilePath, coverImagePath);
    }
}