public enum ReportType
{
    Error = -1,
    Start = 0,
    Progress = 1,
    Completed = 2,
}
public record ReportModel(
   ReportType Type,
   string Message,   
   int? Step = null,
   int? TotalSteps = null
);