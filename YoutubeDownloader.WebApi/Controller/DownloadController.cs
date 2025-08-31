using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DownloadController : ControllerBase
{
    private readonly AudioDownloadService _audioDownloadService;
    private readonly IOutputStorage _outputStorage;

    public DownloadController(AudioDownloadService audioDownloadService,
       IOutputStorage outputStorage)
    {
        _audioDownloadService = audioDownloadService;
        _outputStorage = outputStorage;
    }

    [HttpPost]
    public IActionResult DownloadAudio([FromBody] DownloadModel model)
    {
        if (string.IsNullOrWhiteSpace(model.VideoUrl))
        {
            return BadRequest("Video URL is required.");
        }

        try
        {
            var request = new DownloadRequest(
                VideoUrl: model.VideoUrl,
                SaveFolder: _outputStorage.GetStoragePath(),
                StartAt: model.StartAt,
                EndAt: model.EndAt
            );

            var _ = Task.Run(async () => await _audioDownloadService.ExecuteAsync(request));
            return Ok("Request accepted. Processing download.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}