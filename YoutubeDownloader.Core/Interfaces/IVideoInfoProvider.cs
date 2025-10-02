public interface IVideoInfoProvider
{
    Task<VideoModel> GetInfoAsync(string videoUrl, IProgress<double>? progress = null, CancellationToken cancellationToken = default);
    Task<string> DownloadAudioStreamAsync(string videoUrl, IProgress<double>? progress = null, CancellationToken cancellationToken = default);
}