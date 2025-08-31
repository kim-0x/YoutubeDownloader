public interface IOutputStorage
{
    public string GetStoragePath();
    public string GetFileInPublicUrl(string physicalPath);
}