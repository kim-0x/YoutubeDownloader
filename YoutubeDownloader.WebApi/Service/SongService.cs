
using Microsoft.EntityFrameworkCore;

public class SongService : ISongService
{
    private readonly AppDbContext _dbContext;
    public SongService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task AddSong(CreatedSongModel newSong)
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
                s.Id,
                s.DateCreated.ToString("o"),
                s.Title,
                s.AudioPath
            )).ToListAsync();

        return list;
    }

    public async Task<int> DeleteSong(int id)
    {
        var affectedRows = await _dbContext.Songs
            .Where(s => s.Id == id)
            .ExecuteDeleteAsync();

        await _dbContext.SaveChangesAsync();

        return affectedRows;
    }

    public async Task<SongModel?> GetSongById(int id)
    {
        return await _dbContext.Songs.Where(s => s.Id == id)
            .Select(s => new SongModel(
                s.Id,
                s.DateCreated.ToString("o"),
                s.Title,
                s.AudioPath
            )).FirstOrDefaultAsync();
    }
}