public record SongModel(
    string DateCreated,
    string Title,
    string AudioUrl
);

public record SongDto (
    string Title,
    string AudioUrl
);
