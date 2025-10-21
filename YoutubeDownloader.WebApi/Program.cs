
using System.Text.Json;
using System.Text.Json.Serialization;
using Serilog;

// Setup global logger configuration
var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", true)
    .Build();

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddSerilog();

    builder.Services.AddMemoryCache();

    builder.Services.Configure<DownloadSetting>(
        builder.Configuration.GetSection("DownloadSettings"));
    
    builder.Services.AddSqliteDbContext<AppDbContext>(builder.Configuration, builder.Environment);

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
    builder.Services.AddTransient<ISongService, SqlitSongService>();
    builder.Services.AddSingleton<IDownloadService, DownloadService>();

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
} catch (Exception ex)
{
    Log.Fatal(ex, "Application start-up failed");
}
finally
{
    Log.CloseAndFlush();
}
