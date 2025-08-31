using Microsoft.Extensions.Options;

public class LocalOutputStorage : IOutputStorage
{
    private readonly IOptionsMonitor<DownloadSetting> _options;
    private readonly IWebHostEnvironment _environment;
    public LocalOutputStorage(IOptionsMonitor<DownloadSetting> options, IWebHostEnvironment environment)
    {
        _options = options;
        _environment = environment;
    }

    public string GetStoragePath()
    {
        return Path.Combine(_environment.WebRootPath, _options.CurrentValue.OutputDirectory);
    }

    public string GetFileInPublicUrl(string physicalPath)
    {
        var outputDir = _options.CurrentValue.OutputDirectory;
        var index = physicalPath.IndexOf(outputDir, StringComparison.OrdinalIgnoreCase);
        if (index >= 0)
        {
            return Path.Combine(_options.CurrentValue.PublicBaseUrl, physicalPath.Substring(index).Replace("\\", "/"));
        }
        return string.Empty;
    }
}