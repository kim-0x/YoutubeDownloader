using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[Route("api/[controller]")]
public class DownloadController : ControllerBase
{
    private readonly IDownloadService _downloadService;
    private readonly IOutputStorage _outputStorage;
    private readonly IMemoryCache _memoryCache;
    public DownloadController(
        IDownloadService downloadService,
        IOutputStorage outputStorage,
        IMemoryCache memoryCache)
    {
        _downloadService = downloadService;
        _outputStorage = outputStorage;
        _memoryCache = memoryCache;
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

            if (model.Title is not null)
            {
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5));
                if (_memoryCache.TryGetValue<VideoModel>(model.VideoUrl, out var videoInfo))
                {
                    if (videoInfo is not null)
                    {
                        videoInfo.Title = model.Title;
                        _memoryCache.Set(model.VideoUrl, videoInfo, cacheEntryOptions);
                    }
                }
            }

            var taskId = Guid.NewGuid().ToString();
            _downloadService.ExecuteAsync(taskId, request);

            return Ok(new
            {
                TaskId = taskId,
                Message = $"Request task id {taskId} is accepted. Processing download."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("{taskId}/cancel")]
    public ActionResult CancelDownload(string taskId)
    {
        _downloadService.CancelTask(taskId);
        return Ok($"Task Id: {taskId} was canceled");
    }
}