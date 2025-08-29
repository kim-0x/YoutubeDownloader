using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DownloadController : ControllerBase
{
     private readonly AudioDownloadService _audioDownloadService;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public DownloadController(AudioDownloadService audioDownloadService,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        _audioDownloadService = audioDownloadService;
        _configuration = configuration;
        _environment = environment;
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
            var outputDirectory = _configuration.GetSection("DownloadSettings:OutputDirectory").Value;
            var saveFolder = Path.Combine(_environment.WebRootPath, outputDirectory ?? "downloads");

            var request = new DownloadRequest(
                VideoUrl: model.VideoUrl,
                SaveFolder: saveFolder,
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