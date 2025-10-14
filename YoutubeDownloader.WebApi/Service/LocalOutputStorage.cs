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

    public string GetFileInPublicPath(string physicalPath)
    {
        // physicalPath contains the full system or computer path to the file
        // we need to strip out the part that is not public (wwwroot)
        var outputDir = _options.CurrentValue.OutputDirectory;
        var index = physicalPath.IndexOf(outputDir, StringComparison.OrdinalIgnoreCase);
        if (index >= 0)
        {
            return physicalPath.Substring(index).Replace("\\", "/");
        }
        return string.Empty;
    }
}