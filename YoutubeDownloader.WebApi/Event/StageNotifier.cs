using Microsoft.AspNetCore.SignalR;

public class StageNotifier : IStageNotifier
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public StageNotifier(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    
    public async Task ReportStageAsync(ReportModel report)
    {
        await _hubContext.Clients.All.SendAsync("download", report);
    }
}