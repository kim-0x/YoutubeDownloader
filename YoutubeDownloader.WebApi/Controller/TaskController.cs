using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly ApplicationData _appData;
    private readonly ILongTaskService _longTaskService;
    public TaskController(ApplicationData applicationData,
        ILongTaskService longTaskService)
    {
        _appData = applicationData;
        _longTaskService = longTaskService;
    }

    [HttpGet]
    public IActionResult GetTask()
    {
        var taskIds = _appData.TasksRegistry.Select(x => x.Key).ToArray();

        return Ok(taskIds);
    }

    [HttpPost("{id}/cancel")]
    public IActionResult CancelTask(string id)
    {
        var tasksRegistry = _appData.TasksRegistry;
        if (tasksRegistry.TryGetValue(id, out var taskInfo))
        {
            if (taskInfo.RunningTask.IsCompleted)
            {
                return Ok(new { Message = $"Task id: {id} is completed." });
            }

            var cancellation = taskInfo.Cancellation;
            cancellation.Cancel();
        }

        return Ok(new { Message = $"Task {id} is cancelled." });
    }

    [HttpPost]
    public IActionResult ExecuteTask()
    {
        var tasksRegistry = _appData.TasksRegistry;
        var id = Guid.NewGuid().ToString();
        var taskInfo = _longTaskService.Execute(id);
        tasksRegistry.TryAdd(id, taskInfo);
        return Accepted(new { Id = id, Message = $"Task id: {id} is accepted." });
    }
}
