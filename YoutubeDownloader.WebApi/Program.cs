
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IAudioCoverEmbedder, AudioCoverEmbedder>()
    .AddSingleton<IAudioConverter, AudioConverter>()
    .AddSingleton<IVideoInfoProvider, VideoInfoProvider>()
    .AddTransient<AudioDownloadService, YoutubeAudioDownloadService>();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://127.0.0.1:5500")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();
app.MapGet("/", () => Results.Ok("Welcome to the Youtube Downloader Web API!"))
.WithName("Quick health check")
.WithOpenApi();

app.MapHub<TestHub>("/hubs/test");

app.Run();
