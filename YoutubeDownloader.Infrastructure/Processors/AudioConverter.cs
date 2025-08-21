using Xabe.FFmpeg;
public class AudioConverter : IAudioConverter
{
    //private const string DefaultSaveFolder = "/Users/Kimleng/Downloads/Tests"; // Adjust the default save folder as needed
    public async Task<string> ConvertToMp3Async(string audioStreamFilePath, string saveFolder, VideoModel videoInfo, string? startAt = null, string? endAt = null)
    {
        // Custom implementation for converting audio to MP3
        var conversion = FFmpeg.Conversions.New()
            .AddParameter($"-i \"{audioStreamFilePath}\"")
            .AddParameter($"-vn")
            .AddParameter($"-codec:a libmp3lame -b:a 192k")

            .AddParameter($"-metadata title=\"{videoInfo.Title}\"")
            .AddParameter($"-metadata artist=\"{videoInfo.Author}\"");

        if (!string.IsNullOrEmpty(startAt))
        {
            conversion.AddParameter($"-ss {startAt}");
        }
        if (!string.IsNullOrEmpty(endAt))
        {
            conversion.AddParameter($"-to {endAt}");
        }

        var outputFilePath = Path.Combine(saveFolder, $"{videoInfo.Title}.mp3");
        conversion.SetOutput(outputFilePath);
        await conversion.Start();

        return outputFilePath;
    }
}
