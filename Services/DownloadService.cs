using Xabe.FFmpeg;
using YoutubeExplode;

public class DownloadService
{
    private readonly YoutubeClient _youtube;
    public DownloadService(YoutubeClient youtube)
    {
        _youtube = youtube;
    }

    public async Task<VideoModel> GetVideoInfoAsync(string urlPath)
    {
        var video = await _youtube.Videos.GetAsync(urlPath);
        
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

    public async Task<string> DownloadAudioTempAsync(string urlPath)
    {
        var streamManifest = await _youtube.Videos.Streams.GetManifestAsync(urlPath);
        var audioStreams = streamManifest.GetAudioOnlyStreams();
        var bestAudio = audioStreams
            .OrderByDescending(s => s.Bitrate)
            .FirstOrDefault();

        if (bestAudio == null)
            throw new InvalidOperationException("No audio-only");

        var ext = bestAudio.Container.Name; // "m4a" or "webm"
        var tempFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.{ext}");

        await _youtube.Videos.Streams.DownloadAsync(bestAudio, tempFile);

        return tempFile;
    }

    public async Task ConvertToMp3Async(DownloaderModel model)
    {
        var conversion = FFmpeg.Conversions.New()
            .AddParameter($"-i \"{model.TempAudioFile}\"")
            .AddParameter($"-vn")
            .AddParameter($"-codec:a libmp3lame -b:a 192k")

            .AddParameter($"-metadata title=\"{model.VideoInfo.Title}\"")
            .AddParameter($"-metadata artist=\"{model.VideoInfo.Author}\"");

        if (!string.IsNullOrEmpty(model.StartAt))
        {
            conversion.AddParameter($"-ss {model.StartAt}");
        }
        if (!string.IsNullOrEmpty(model.EndAt))
        {
            conversion.AddParameter($"-to {model.EndAt}");
        }

        conversion.SetOutput($"{model.SaveFolder}/{model.VideoInfo.Title}.mp3");

        await conversion.Start();
    }
}