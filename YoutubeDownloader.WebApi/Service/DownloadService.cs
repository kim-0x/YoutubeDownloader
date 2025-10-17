
using System.Collections.Concurrent;

public class DownloadService : IDownloadService
{
    private readonly ConcurrentDictionary<string, DownloadTaskInfo> _tasksRegistry = new();
    private readonly AudioDownloadService _audioDownloadService;
    private readonly ILogger<IDownloadService> _logger;

    public DownloadService(AudioDownloadService audioDownloadService,
        ILogger<IDownloadService> logger)
    {
        _audioDownloadService = audioDownloadService;
        _logger = logger;
    }

    public void CancelTask(string taskId)
    {
        if (this._tasksRegistry.TryGetValue(taskId, out var taskInfo))
        {
            taskInfo.Cancellation.Cancel();
            this._tasksRegistry.TryRemove(taskId, out var _);
            _logger.LogInformation("Unregistered task with id {TaskId}", taskId);
        }
    }

    public DownloadTaskInfo ExecuteAsync(string taskId, DownloadRequest request)
    {
        try
        {
            var cts = new CancellationTokenSource();
            var token = cts.Token;
            var startAt = DateTime.Now;

            _logger.LogInformation("Task with id {TaskId} start execute", taskId);
            var task = Task.Run(async () =>
            {
                token.ThrowIfCancellationRequested();
                await _audioDownloadService.ExecuteAsync(request, token);
            }, token);
            task.ContinueWith(t =>
            {
                if (t.IsFaulted)
                {
                    _logger.LogError(t.Exception, "Download task with id {TaskId} failed", taskId);
                }
            }, TaskScheduler.Default);

            var newTask = new DownloadTaskInfo
            {
                RunningTask = task,
                Cancellation = cts,
                StartAt = startAt
            };

            _logger.LogInformation("Registered new download task with id {TaskId}", taskId);

            this._tasksRegistry.TryAdd(taskId, newTask);

            return newTask;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to download task with id {TaskId}", taskId);
            return new DownloadTaskInfo();
        }
    }
}