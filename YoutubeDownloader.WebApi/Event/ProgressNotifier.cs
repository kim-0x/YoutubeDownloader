using Microsoft.AspNetCore.SignalR;

public class ProgressNotifier : IProgressNotifier
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public ProgressNotifier(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task ReportProgressAsync(ReportModel report)
    {
        await _hubContext.Clients.All.SendAsync("download", report);
    }
}