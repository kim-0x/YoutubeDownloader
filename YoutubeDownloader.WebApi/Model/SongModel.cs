public record SongModel(
    int Id,
    string DateCreated,
    string Title,
    string AudioUrl
);

public record SongDto (
    string Title,
    string AudioUrl
);

public record CreatedSongModel(
    string DateCreated,
    string Title,
    string AudioUrl
);
