public interface IAudioCoverEmbedder
{
    Task<string> GetCoverImageAsync(string videoUrl);
    void EmbedCover(string audioFilePath, string coverImagePath);
}