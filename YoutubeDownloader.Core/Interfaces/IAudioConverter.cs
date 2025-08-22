public interface IAudioConverter
{
    Task<string> ConvertToMp3Async(AudioConversionRequest request);
}