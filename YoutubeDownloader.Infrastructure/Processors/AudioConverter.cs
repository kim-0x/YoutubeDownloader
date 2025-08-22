using Xabe.FFmpeg;
public class AudioConverter : IAudioConverter
{
    public async Task<string> ConvertToMp3Async(AudioConversionRequest request)
    {
        // Custom implementation for converting audio to MP3
        var conversion = FFmpeg.Conversions.New()
            .AddParameter($"-i \"{request.AudioStreamFilePath}\"")
            .AddParameter($"-vn")
            .AddParameter($"-codec:a libmp3lame -b:a 192k")

            .AddParameter($"-metadata title=\"{request.VideoInfo.Title}\"")
            .AddParameter($"-metadata artist=\"{request.VideoInfo.Author}\"");

        if (!string.IsNullOrEmpty(request.StartAt))
        {
            conversion.AddParameter($"-ss {request.StartAt}");
        }
        if (!string.IsNullOrEmpty(request.EndAt))
        {
            conversion.AddParameter($"-to {request.EndAt}");
        }

        var outputFilePath = Path.Combine(request.SaveFolder, $"{request.VideoInfo.Title}.mp3");
        conversion.SetOutput(outputFilePath);
        await conversion.Start();

        return outputFilePath;
    }
}
