public interface IAudioConverter
{
    Task<string> ConvertToMp3Async(AudioConversionRequest request, IProgress<double>? progress = null, CancellationToken cancellationToken = default);
}