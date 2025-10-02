
using System.Collections.Concurrent;

public class DownloadService : IDownloadService
{
    private readonly ConcurrentDictionary<string, DownloadTaskInfo> _tasksRegistry = new();

    private readonly AudioDownloadService _audioDownloadService;

    public DownloadService(AudioDownloadService audioDownloadService)
    {
        _audioDownloadService = audioDownloadService;
    }

    public void CancelTask(string taskId)
    {
        if (this._tasksRegistry.TryGetValue(taskId, out var taskInfo))
        {
            taskInfo.Cancellation.Cancel();
            this._tasksRegistry.TryRemove(taskId, out var _);
        }
    }

    public DownloadTaskInfo ExecuteAsync(string taskId, DownloadRequest request)
    {
        try
        {
            var cts = new CancellationTokenSource();
            var token = cts.Token;
            var startAt = DateTime.Now;

            var task = Task.Run(async () =>
            {
                token.ThrowIfCancellationRequested();

                await _audioDownloadService.ExecuteAsync(request, token);
                
            }, token);

            var newTask = new DownloadTaskInfo
            {
                RunningTask = task,
                Cancellation = cts,
                StartAt = startAt
            };

            this._tasksRegistry.TryAdd(taskId, newTask);

            return newTask;
        }
        catch (Exception)
        {
            return new DownloadTaskInfo();
        }
    }
}