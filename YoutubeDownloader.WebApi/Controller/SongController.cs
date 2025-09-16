using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SongController : ControllerBase
{
    private readonly ISongService _songService;
    public SongController(ISongService songService)
    {
        this._songService = songService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSong()
    {
        var list = await this._songService.GetSong();

        return Ok(list);
    }
    
    [HttpPost]
    public async Task<IActionResult> AddSong([FromBody] SongDto newSong)
    {
        var song = new SongModel(
            DateTime.Today.ToString("d"),
            newSong.Title,
            newSong.AudioUrl
        );

        await _songService.AddSong(song);
        return Ok(await this._songService.GetSong());
    }
}