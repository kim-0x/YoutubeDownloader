public class AudioCoverEmbedder : IAudioCoverEmbedder
{
    public async Task<string> GetCoverImageAsync(string videoUrl)
    {
        // Implementation for retrieving cover image from YouTube
        using var http = new HttpClient();
        byte[] coverBytes = await http.GetByteArrayAsync(videoUrl);
        string tempCoverFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.jpg");
        await File.WriteAllBytesAsync(tempCoverFile, coverBytes);
        return tempCoverFile;
    }

    public void EmbedCover(string audioFilePath, string coverImagePath)
    {
        // Implementation for embedding cover image into MP3 file
        var audioFile = TagLib.File.Create(audioFilePath);
        var picture = new TagLib.Picture(coverImagePath)
        {
            Type = TagLib.PictureType.FrontCover,
            Description = "Cover",
            MimeType = System.Net.Mime.MediaTypeNames.Image.Jpeg
        };
        audioFile.Tag.Pictures = [picture];
        audioFile.Save();
    }
}