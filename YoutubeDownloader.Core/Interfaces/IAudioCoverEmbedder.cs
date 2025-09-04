public interface IAudioCoverEmbedder
{
    Task<string> GetCoverImageAsync(string videoUrl, IProgress<double>? progress = null);
    void EmbedCover(string audioFilePath, string coverImagePath, IProgress<double>? progress = null);
}