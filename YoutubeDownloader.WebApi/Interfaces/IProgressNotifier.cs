public interface IProgressNotifier
{
    Task ReportProgressAsync(ReportModel report);
}
