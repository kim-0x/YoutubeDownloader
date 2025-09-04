public interface IVideoInfoProvider
{
    Task<VideoModel> GetInfoAsync(string videoUrl, IProgress<double>? progress = null);
    Task<string> DownloadAudioStreamAsync(string videoUrl, IProgress<double>? progress = null);
}