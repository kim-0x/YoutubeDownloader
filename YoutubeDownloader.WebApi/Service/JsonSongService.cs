
using System.Text.Json;
using Microsoft.Extensions.Options;

public class JsonSongService : ISongService
{
    private readonly IOptionsMonitor<DataStoreSettings> _options;
    private readonly IWebHostEnvironment _environment;
    public JsonSongService(IOptionsMonitor<DataStoreSettings> options,
        IWebHostEnvironment environment)
    {
        this._options = options;
        this._environment = environment;
    }
    private IEnumerable<SongModel> _internalSong = new List<SongModel>();

    public string DbFilePath
    {
        get
        {
            try
            {
                var dbFile = Path.Combine(_environment.WebRootPath,
                 _options.CurrentValue.SongDbDirectory,
                _options.CurrentValue.DbName);

                return dbFile;
            }
            catch (ArgumentNullException exception)
            {
                Console.WriteLine(exception);
                throw new Exception(exception.Message);
            }
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
        if (!File.Exists(DbFilePath))
        {
            using (FileStream stream = File.Create(DbFilePath))
            {
                byte[] emptyContent = System.Text.Encoding.UTF8.GetBytes("[]");
                await stream.WriteAsync(emptyContent);
            }
        }

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
                Console.WriteLine(exception);
            }
        }

        return this._internalSong;
    }
}