
using Microsoft.EntityFrameworkCore;

public class SqlitSongService : ISongService
{
    private readonly AppDbContext _dbContext;
    public SqlitSongService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task AddSong(SongModel newSong)
    {
        await _dbContext.Songs.AddAsync(new Song
        {
            Title = newSong.Title,
            DateCreated = DateTime.Parse(newSong.DateCreated),
            AudioPath = newSong.AudioUrl,
        });

        await _dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<SongModel>> GetSong()
    {
        var list = await _dbContext.Songs
            .Select(s => new SongModel(
                s.DateCreated.ToString("o"),
                s.Title,
                s.AudioPath
            )).ToListAsync();
        
        return list;
    }
}