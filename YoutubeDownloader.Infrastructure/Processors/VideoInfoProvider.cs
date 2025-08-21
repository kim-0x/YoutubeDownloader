
using YoutubeExplode;

public class VideoInfoProvider : IVideoInfoProvider
{
    private readonly YoutubeClient _youtubeClient = new YoutubeClient();
    public async Task<string> DownloadAudioStreamAsync(string urlPath)
    {
        // Custom implementation for downloading audio stream from YouTube
        var streamManifest = await _youtubeClient.Videos.Streams.GetManifestAsync(urlPath);
        var audioStreams = streamManifest.GetAudioOnlyStreams();
        var bestAudio = audioStreams
            .OrderByDescending(s => s.Bitrate)
            .FirstOrDefault();

        if (bestAudio == null)
            throw new InvalidOperationException("No audio-only");

        var ext = bestAudio.Container.Name; // "m4a" or "webm"
        var tempFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.{ext}");

        await _youtubeClient.Videos.Streams.DownloadAsync(bestAudio, tempFile);

        return tempFile;
    }

    public async Task<VideoModel> GetInfoAsync(string urlPath)
    {
         // Implementation for YouTube video info retrieval
        var video = await _youtubeClient.Videos.GetAsync(urlPath);

        return new VideoModel
        {
            Title = video.Title,
            Author = video.Author.ChannelTitle,
            Duration = video.Duration,
            ThumbnailUrl = video.Thumbnails
                .OrderBy(t => t.Resolution.Width * t.Resolution.Height)
                .Last().Url
        };
    }
}