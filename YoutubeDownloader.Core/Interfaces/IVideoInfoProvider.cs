public interface IVideoInfoProvider
{
    Task<VideoModel> GetInfoAsync(string urlPath);
      /// <summary>
    /// Downloads the audio stream from the specified YouTube video URL.
    /// </summary>
    /// <param name="urlPath">Youtube video URL</param>
    /// <returns>A temporary file path to the audio file</returns>
    Task<string> DownloadAudioStreamAsync(string urlPath);
}