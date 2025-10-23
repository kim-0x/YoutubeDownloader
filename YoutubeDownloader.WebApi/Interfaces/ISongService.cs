public interface ISongService
{
    Task<IEnumerable<SongModel>> GetSong();
    Task AddSong(CreatedSongModel newSong);
}