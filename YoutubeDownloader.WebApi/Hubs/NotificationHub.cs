using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub<INotificationClient>
{
    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.Status($"Connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public Task Ping() => Clients.All.Status("Pong");
}