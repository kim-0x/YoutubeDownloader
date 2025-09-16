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

        Func<string, string> DateLabel = (input) =>
        {
            var today = DateTime.Today;
            if (input == today.ToString("d"))
            {
                return "Today";
            }
            else if (input == today.AddDays(-1).ToString("d"))
            {
                return "Yesterday";
            }
            else
            {
                return "Previous";
            }
        };

        var result = list
            .OrderByDescending(x => DateTime.Parse(x.DateCreated))
            .GroupBy(x => DateLabel(x.DateCreated))
            .ToDictionary(group => group.Key,
            group => group.Select(x => new {x.Title, x.AudioUrl}));
        return Ok(result);
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