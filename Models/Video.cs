public class VideoModel
{
    public required string Title { get; set; }
    public required string Author { get; set; }
    public TimeSpan? Duration { get; set; }
    public string? ThumbnailUrl { get; set; }
}