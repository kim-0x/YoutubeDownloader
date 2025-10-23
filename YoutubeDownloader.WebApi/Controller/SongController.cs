using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SongController : ControllerBase
{
    private readonly ISongService _songService;
    private readonly IOutputStorage _outputStorage;
    public SongController(ISongService songService, IOutputStorage outputStorage)
    {
        this._songService = songService;
        this._outputStorage = outputStorage;
    }

    [HttpGet]
    public async Task<IActionResult> GetSong()
    {
        var list = await this._songService.GetSong();

        var result = list
            .OrderByDescending(x => DateTime.Parse(x.DateCreated))
            .GroupBy(x => x.DateCreated.ToDateLabel())
            .ToDictionary(
                group => group.Key,
                group => group.Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.AudioUrl
                })
            );
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddSong([FromBody] SongDto newSong)
    {
        var song = new CreatedSongModel(
            DateTime.Today.ToString("d"),
            newSong.Title,
            newSong.AudioUrl
        );

        await _songService.AddSong(song);
        return Ok(song);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSong(int id)
    {
        var song = await _songService.GetSongById(id);
        if (song is null)
        {
            return NotFound();
        }
        var isFileDeleted = _outputStorage.DeleteFile(song.AudioUrl);
        var totalDeleted = await _songService.DeleteSong(id);
        
        return Ok(new
        {
            Id = id,
            Message = isFileDeleted && (totalDeleted > 0) ? "Song and associated file deleted successfully." : "Song deleted, but failed to delete associated file."
        });
    }
}