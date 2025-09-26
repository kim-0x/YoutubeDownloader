
using System.Collections.Concurrent;

public class TaskInfo
{
    public CancellationTokenSource Cancellation { get; init; } = default!;
    public Task RunningTask { get; init; } = default!;
}

public class ApplicationData
{
    public ConcurrentDictionary<string, TaskInfo> TasksRegistry = new();
}

public interface ILongTaskService
{
    TaskInfo Execute(string taskId);
}
public class LongTaskConsoleService : ILongTaskService
{
    public TaskInfo Execute(string taskId)
    {
        try
        {
            var cts = new CancellationTokenSource();
            var token = cts.Token;

            var task = Task.Run(async () =>
            {
                foreach (var percentage in Enumerable.Range(1, 100))
                {
                    token.ThrowIfCancellationRequested();

                    Console.WriteLine($"Task id {taskId} is running... {percentage}%");

                    await Task.Delay(TimeSpan.FromSeconds(1), token);
                }
            }, token);

            return new TaskInfo
            {
                RunningTask = task,
                Cancellation = cts
            };
        }
        catch (OperationCanceledException exception)
        {
            Console.Write(exception.Message);
            throw new Exception($"Task Id {taskId} was cancelled.");
        }
    }
}
