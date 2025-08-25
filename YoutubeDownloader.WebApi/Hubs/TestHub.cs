using Microsoft.AspNetCore.SignalR;

public class TestHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("status", $"Connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public Task Ping() => Clients.All.SendAsync("status", "Pong");
}