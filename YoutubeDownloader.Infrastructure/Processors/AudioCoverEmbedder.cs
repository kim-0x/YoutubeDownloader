public class AudioCoverEmbedder : IAudioCoverEmbedder
{
    public async Task<string> GetCoverImageAsync(string videoUrl, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
    {
        try
        {
            // Implementation for retrieving cover image from YouTube
            progress?.Report(0.8);
            using var http = new HttpClient();
            byte[] coverBytes = await http.GetByteArrayAsync(videoUrl, cancellationToken);
            string tempCoverFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.jpg");
            await File.WriteAllBytesAsync(tempCoverFile, coverBytes, cancellationToken);
            progress?.Report(0.9);
            return tempCoverFile;
        }
        catch (OperationCanceledException cancelException)
        {
            throw new OperationCanceledException($"Get cover image for video url {videoUrl} was cancelled.", cancelException.CancellationToken);
        }
    }

    public void EmbedCover(string audioFilePath, string coverImagePath, IProgress<double>? progress = null)
    {
        // Implementation for embedding cover image into MP3 file
        progress?.Report(0.9);
        var audioFile = TagLib.File.Create(audioFilePath);
        var picture = new TagLib.Picture(coverImagePath)
        {
            Type = TagLib.PictureType.FrontCover,
            Description = "Cover",
            MimeType = System.Net.Mime.MediaTypeNames.Image.Jpeg
        };
        audioFile.Tag.Pictures = [picture];
        audioFile.Save();
        progress?.Report(1);
    }
}