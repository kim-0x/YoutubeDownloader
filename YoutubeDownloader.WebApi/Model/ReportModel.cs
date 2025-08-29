public enum ReportType
{
    Start,
    Progress,
    Completed,
    Error
}
public record ReportModel(
   ReportType Type,
   string Message,   
   int? Step = null,
   int? TotalSteps = null
);