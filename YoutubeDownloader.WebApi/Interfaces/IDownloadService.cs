public interface IDownloadService
{
    DownloadTaskInfo ExecuteAsync(string taskId, DownloadRequest request);

    void CancelTask(string taskId);
}