public interface IOutputStorage
{
    public string GetStoragePath();
    public string GetFileInPublicPath(string physicalPath);
    public bool DeleteFile(string audioPath);
}