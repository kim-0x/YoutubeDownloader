using Xabe.FFmpeg;
public class AudioConverter : IAudioConverter
{
    public async Task<string> ConvertToMp3Async(AudioConversionRequest request, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
    {
        try
        {
            // Custom implementation for converting audio to MP3
            progress?.Report(0.5);
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
            conversion.OnProgress += (sender, args) =>
            {
                // Conversion weight 30% of the progress
                var percent = Math.Round(args.Duration.TotalSeconds / args.TotalLength.TotalSeconds, 2);
                progress?.Report(0.5 + percent * 0.3);
            };
            await conversion.Start(cancellationToken);
            return outputFilePath;
        }
        catch (OperationCanceledException cancelException)
        {
            throw new OperationCanceledException($"Convert video to MP3 was cancelled.", cancelException.CancellationToken);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("FFmpeg executables not found. Please ensure FFmpeg is installed and the path is set correctly.", ex);
        }        
    }
}
