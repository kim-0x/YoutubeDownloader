public interface IAudioCoverEmbedder
{
    Task<string> GetCoverImageAsync(string urlPath);
    /// <summary>
    /// Embeds the audio cover into the specified audio file.
    /// </summary>
    /// <param name="audioFilePath">Path to the audio file</param>
    /// <param name="coverImagePath">Path to the cover image file</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    void EmbedCover(string audioFilePath, string coverImagePath);
}