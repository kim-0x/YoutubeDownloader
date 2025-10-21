using Microsoft.EntityFrameworkCore;

public static class SqliteServiceCollectionExtensions
{
    public static IServiceCollection AddSqliteDbContext<TContext>(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment)
        where TContext : DbContext
    {
        var connectionString = configuration.GetConnectionString("SqliteConnection");

        if (connectionString?.Contains("{APPDATA}") == true)
        {
            var webRootPath = environment.WebRootPath.Replace("wwwroot", "") ?? AppContext.BaseDirectory;
            Directory.CreateDirectory(Path.Combine(webRootPath, "data"));
            connectionString = connectionString.Replace("{APPDATA}", webRootPath);
        }
        
        services.AddDbContext<TContext>(options =>
            options.UseSqlite(connectionString));

        return services;
    }
}