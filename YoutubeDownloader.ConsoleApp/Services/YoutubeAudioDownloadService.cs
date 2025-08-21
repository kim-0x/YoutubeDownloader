public class YoutubeAudioDownloadService : AudioDownloadService
{
    public YoutubeAudioDownloadService(
        IAudioCoverEmbedder audioCoverEmbedder,
        IAudioConverter audioConverter,
        IVideoInfoProvider videoInfoProvider) 
        : base(videoInfoProvider, audioConverter, audioCoverEmbedder)
    {}

    protected override Task<string> DownloadAudioStreamAsync(string urlPath)
    {
        Console.WriteLine("Downloading audio stream from Youtube...");
        return base.DownloadAudioStreamAsync(urlPath);
    }

    protected override Task<VideoModel> GetVideoInfoAsync(string urlPath)
    {
        Console.WriteLine("Fetching video info from Youtube...");
        return base.GetVideoInfoAsync(urlPath);
    }

    protected override Task<string> ConvertToMp3Async(string audioStreamFilePath, string saveFolder, VideoModel videoInfo, string? startAt = null, string? endAt = null)
    {
        Console.WriteLine("Converting audio to MP3 format...");
        return base.ConvertToMp3Async(audioStreamFilePath, saveFolder, videoInfo, startAt, endAt);
    }

    protected override Task<string> GetCoverImageAsync(string urlPath)
    {
        Console.WriteLine("Downloading cover image...");
        return base.GetCoverImageAsync(urlPath);
    }

    protected override void EmbedCover(string audioOutputFilePath, string coverImagePath)
    {
        Console.WriteLine("Embedding cover image into MP3 file...");
        base.EmbedCover(audioOutputFilePath, coverImagePath);
        Console.WriteLine("Cover image embedded successfully.");
    }
}