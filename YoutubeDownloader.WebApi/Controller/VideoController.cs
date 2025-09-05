using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[Route("api/[controller]")]
public class VideoController : ControllerBase
{
    private readonly IMemoryCache _memoryCache;
    private readonly IVideoInfoProvider _videoInfoProvider;
    public VideoController(IMemoryCache memoryCache, IVideoInfoProvider videoInfoProvider)
    {
        _memoryCache = memoryCache;
        _videoInfoProvider = videoInfoProvider;
    }

    [HttpGet]
    public async Task<IActionResult> GetVideoInfo(string videoUrl)
    {
        if (string.IsNullOrWhiteSpace(videoUrl))
        {
            return BadRequest("Video URL is required.");
        }

        try
        {
            var videoInfo = await _videoInfoProvider.GetInfoAsync(videoUrl);

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(5));

            _memoryCache.Set(videoUrl, videoInfo, cacheEntryOptions);

            return Ok(new VideoDto(videoUrl, videoInfo.Title));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public IActionResult UpdateVideoTitle([FromBody]VideoDto model)
    {
        if (model is null || string.IsNullOrWhiteSpace(model.VideoUrl))
        {
            return BadRequest("Invalid video data.");
        }

        try
        {
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(5));
            
            if (!_memoryCache.TryGetValue<VideoModel>(model.VideoUrl, out var videoModel))
            {
                return NotFound("Video info not found in cache.");
            }
            
            if (videoModel is not null)
            {
                videoModel.Title = model.Title;
            }                 
            _memoryCache.Set(model.VideoUrl, videoModel, cacheEntryOptions);

            return Ok("Video info updated in cache.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}