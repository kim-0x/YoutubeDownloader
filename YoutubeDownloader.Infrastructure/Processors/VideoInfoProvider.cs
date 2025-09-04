
using YoutubeExplode;

public class VideoInfoProvider : IVideoInfoProvider
{
    private readonly YoutubeClient _youtubeClient = new YoutubeClient();
    public async Task<string> DownloadAudioStreamAsync(string videoUrl, IProgress<double>? progress = null)
    {
        try
        {
            // Custom implementation for downloading audio stream from YouTube
            progress?.Report(0.1);
            var streamManifest = await _youtubeClient.Videos.Streams.GetManifestAsync(videoUrl);
            var audioStreams = streamManifest.GetAudioOnlyStreams();
            var bestAudio = audioStreams
                .OrderByDescending(s => s.Bitrate)
                .FirstOrDefault();

            if (bestAudio == null)
                throw new InvalidOperationException("No audio-only");

            var ext = bestAudio.Container.Name; // "m4a" or "webm"
            var tempFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.{ext}");

            // Download audio stream weight 40% of the progress
            await _youtubeClient.Videos.Streams.DownloadAsync(bestAudio, tempFile, new Progress<double>(p => progress?.Report(0.1 + p * 0.4)));

            return tempFile;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to download audio stream from YouTube.", ex);
        }
    }

    public async Task<VideoModel> GetInfoAsync(string videoUrl, IProgress<double>? progress = null)
    {
        try
        {
            // Implementation for YouTube video info retrieval
            progress?.Report(0);
            var video = await _youtubeClient.Videos.GetAsync(videoUrl);
            progress?.Report(0.1);
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
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to retrieve video info from YouTube.", ex);
        }
    }
}