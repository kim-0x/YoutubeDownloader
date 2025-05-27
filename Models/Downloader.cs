public class DownloaderModel
{
    public required string UrlPath { get; set; }
    public required string SaveFolder { get; set; }
    public required string TempAudioFile { get; set; }
    public required string TempCoverFile { get; set; }
    public required VideoModel VideoInfo { get; set; }
}