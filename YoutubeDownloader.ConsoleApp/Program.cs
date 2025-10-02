using Microsoft.Extensions.DependencyInjection;

Console.WriteLine("Youtube Downloader App");

var services = new ServiceCollection()
    .AddSingleton<IAudioCoverEmbedder, AudioCoverEmbedder>()
    .AddSingleton<IAudioConverter, AudioConverter>()
    .AddSingleton<IVideoInfoProvider, VideoInfoProvider>()
    .AddSingleton<IProgress<double>, ConsoleProgressReporter>()
    .AddTransient<AudioDownloadService, YoutubeAudioDownloadService>()
    .BuildServiceProvider();

Console.Write("Enter Save Folder: ");
var saveFolder = Console.ReadLine();
if (saveFolder == null) return;

do
{    
    Console.Clear();
    Console.Write("Enter Video URL: ");
    var videoUrl = Console.ReadLine();
    if (videoUrl == null) return;

    Console.Write("Do you want to trim audio(Y/n)?: ");
    var tryTrim = Console.ReadLine();
    string? startAt = null;
    string? endAt = null;
    if (tryTrim != null && tryTrim.ToLower() == "y")
    {
        Console.Write("Start At (hh:mm:ss): ");
        startAt = Console.ReadLine();
        Console.Write("End At (hh:mm:ss): ");
        endAt = Console.ReadLine();
    }

    try
    {
        var audioDownloadService = services.GetRequiredService<AudioDownloadService>();
        var cancellationTokenSource = new CancellationTokenSource();
        cancellationTokenSource.CancelAfter(TimeSpan.FromHours(1));
        await audioDownloadService.ExecuteAsync(new DownloadRequest(videoUrl, saveFolder, startAt, endAt), cancellationTokenSource.Token);
    }
    catch (OperationCanceledException cancelException)
    {
        Console.WriteLine(cancelException.Message, cancelException.CancellationToken);
    }
    catch (ApplicationException appException)
    {
        Console.WriteLine(appException.Message, appException.Message);
    }

    Console.Write("Done. Do you want to download more? (Enter/ESC): ");
} while (Console.ReadKey().Key != ConsoleKey.Escape);
