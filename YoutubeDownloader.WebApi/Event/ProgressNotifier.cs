using Microsoft.AspNetCore.SignalR;

public class ProgressNotifier : IProgress<double>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public ProgressNotifier(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async void Report(double value)
    {
        await _hubContext.Clients.All.SendAsync("download", new ReportModel(ReportType.Progress, $"{value}"));
    }
}