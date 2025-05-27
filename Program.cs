using TagLib;
using YoutubeExplode;

Console.WriteLine("Youtube Downloader App");
Console.Write("Enter Save Folder: ");
var saveFolder = Console.ReadLine();
if (saveFolder == null) return;

do
{
    Console.Clear();
    Console.Write("Enter Url Path: ");
    var urlPath = Console.ReadLine();
    if (urlPath == null) return;

    var youtubeClient = new YoutubeClient();
    var service = new DownloadService(youtubeClient);
    var video = await service.GetVideoInfoAsync(urlPath);

    Console.WriteLine("Here are Video Info.");
    Console.WriteLine($"Video Title: {video.Title}");
    Console.WriteLine($"Video Author: {video.Author}");
    Console.WriteLine($"Video Duration: {video.Duration}");

    Console.WriteLine("Downlaod Starting...");
    var tempFile = await service.DownloadAudioTempAsync(urlPath);

    Console.WriteLine("Download Cover File...");
    using var http = new HttpClient();
    var coverBytes = await http.GetByteArrayAsync(video.ThumbnailUrl);
    var tempCoverFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.jpg");
    await System.IO.File.WriteAllBytesAsync(tempCoverFile, coverBytes);

    var downladerModel = new DownloaderModel
    {
        UrlPath = urlPath,
        SaveFolder = saveFolder,
        TempAudioFile = tempFile,
        TempCoverFile = tempCoverFile,
        VideoInfo = video
    };

    Console.WriteLine("Convert to MP3...");
    await service.ConvertToMp3Async(downladerModel);

    System.IO.File.Delete(downladerModel.TempAudioFile);

    Console.WriteLine("Add Cover Picture...");

    var audioFile = TagLib.File.Create($"{downladerModel.SaveFolder}/{downladerModel.VideoInfo.Title}.mp3");

    var pic = new Picture
    {
        Type = PictureType.FrontCover,
        MimeType = System.Net.Mime.MediaTypeNames.Image.Jpeg,
        Description = "Cover",
        Data = ByteVector.FromPath(downladerModel.TempCoverFile)
    };

    audioFile.Tag.Pictures = [pic];
    audioFile.Save();

    System.IO.File.Delete(downladerModel.TempCoverFile);

    Console.Write("Done. Do you want to download more? (Enter/ESC): ");
} while (Console.ReadKey().Key != ConsoleKey.Escape);
