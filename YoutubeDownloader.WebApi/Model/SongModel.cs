public record SongModel(
    string DateCreated,
    string Title,
    string AudioUrl
);

public record SongDto (
    string Title,
    string AudioUrl
);

public sealed class DataStoreSettings
{
    public string PublicBaseUrl { get; set; } = "https://localhost:7085";
    public string SongDbDirectory { get; set; } = "json";
    public string DbName { get; set; } = "song.json";
}