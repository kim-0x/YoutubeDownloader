public interface IOutputStorage
{
    public string GetStoragePath();
    public string GetFileInPublicPath(string physicalPath);
}