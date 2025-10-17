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

        if (connectionString?.Contains("{WEBROOT}") == true)
        {
            var webRootPath = environment.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot");
            Directory.CreateDirectory(Path.Combine(webRootPath, "data"));
            connectionString = connectionString.Replace("{WEBROOT}", webRootPath);
        }
        
        services.AddDbContext<TContext>(options =>
            options.UseSqlite(connectionString));

        return services;
    }
}