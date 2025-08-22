public interface IVideoInfoProvider
{
    Task<VideoModel> GetInfoAsync(string videoUrl);
    Task<string> DownloadAudioStreamAsync(string videoUrl);
}