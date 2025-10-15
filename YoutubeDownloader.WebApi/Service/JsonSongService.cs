
using System.Text.Json;
using Microsoft.Extensions.Options;

public class JsonSongService : ISongService
{
    private readonly IOptionsMonitor<DataStoreSettings> _options;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ISongService> _logger;
    public JsonSongService(IOptionsMonitor<DataStoreSettings> options,
        IWebHostEnvironment environment,
        ILogger<ISongService> logger)
    {
        this._options = options;
        this._environment = environment;
        this._logger = logger;
    }
    private IEnumerable<SongModel> _internalSong = new List<SongModel>();

    public string DbFilePath
    {
        get
        {
            var dbFile = Path.Combine(_environment.WebRootPath,
                _options.CurrentValue.SongDbDirectory,
                _options.CurrentValue.DbName);
            
            if (File.Exists(dbFile)) return dbFile;

            if (!Directory.Exists(Path.GetDirectoryName(dbFile)))
            {
                _logger.LogWarning("Json data store directory does not exist. Creating new directory");
                Directory.CreateDirectory(Path.GetDirectoryName(dbFile)!);
            }
            
            using (FileStream stream = File.Create(dbFile))
            {
                byte[] emptyContent = System.Text.Encoding.UTF8.GetBytes("[]");
                stream.Write(emptyContent);
            }

            return dbFile;          
        }
    }
    public async Task AddSong(SongModel newSong)
    {
        var list = this._internalSong.ToList();
        list.Insert(0, newSong);
        var jsonOptions = new JsonSerializerOptions { WriteIndented = true };
        string updatedSongDb = JsonSerializer.Serialize(list, jsonOptions);

        await File.WriteAllTextAsync(this.DbFilePath, updatedSongDb);
    }

    public async Task<IEnumerable<SongModel>> GetSong()
    {
        using (FileStream fileStream = File.OpenRead(DbFilePath))
        {
            try
            {
                var list = await JsonSerializer.DeserializeAsync<IEnumerable<SongModel>>(fileStream);

                if (list != null)
                {
                    _internalSong = list;
                }
            }
            catch (JsonException exception)
            {
                _logger.LogError(exception, "Failed to deserialize song data store.");
            }
        }

        return this._internalSong;
    }
}