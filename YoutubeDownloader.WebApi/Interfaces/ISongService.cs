public interface ISongService
{
    Task<IEnumerable<SongModel>> GetSong();
    Task AddSong(CreatedSongModel newSong);
    Task<int> DeleteSong(int id);
    Task<SongModel?> GetSongById(int id);
}