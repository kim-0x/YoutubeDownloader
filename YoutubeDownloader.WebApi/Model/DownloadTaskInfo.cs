public class DownloadTaskInfo
{
    public CancellationTokenSource Cancellation { get; set; } = default!;
    public Task RunningTask { get; set; } = default!;
    public DateTime StartAt { get; set; }
}