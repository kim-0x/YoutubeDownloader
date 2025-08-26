using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DownloadController : ControllerBase
{
    private readonly AudioDownloadService _audioDownloadService;

    public DownloadController(AudioDownloadService audioDownloadService)
    {
        _audioDownloadService = audioDownloadService;
    }

    [HttpPost]
    public IActionResult DownloadAudio([FromBody] DownloadRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.VideoUrl))
        {
            return BadRequest("Video URL is required.");
        }

        try
        {
            Task.Run(() => _audioDownloadService.ExecuteAsync(request));
            return Ok("Request accepted. Processing download.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}