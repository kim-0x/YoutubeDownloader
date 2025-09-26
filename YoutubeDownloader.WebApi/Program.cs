
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMemoryCache();

builder.Services.Configure<DownloadSetting>(
    builder.Configuration.GetSection("DownloadSettings"));
builder.Services.Configure<DataStoreSettings>(
    builder.Configuration.GetSection("DataStoreSettings"));
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IAudioCoverEmbedder, AudioCoverEmbedder>()
    .AddSingleton<IAudioConverter, AudioConverter>()
    .AddSingleton<IVideoInfoProvider, VideoInfoProvider>()
    .AddTransient<AudioDownloadService, YoutubeAudioDownloadService>();
builder.Services.AddSingleton<IStageNotifier, StageNotifier>();
builder.Services.AddSingleton<IProgress<double>, ProgressNotifier>();
builder.Services.AddSingleton<IOutputStorage, LocalOutputStorage>();
builder.Services.AddSingleton<ISongService, JsonSongService>();
builder.Services.AddSingleton<ApplicationData>();
builder.Services.AddSingleton<ILongTaskService, LongTaskConsoleService>();

builder.Services.AddSignalR().AddJsonProtocol(option =>
{
    option.PayloadSerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
    );
});
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
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

app.MapHub<NotificationHub>("/hubs/notification");

app.Run();
