using System.Globalization;

public static class DateHelper
{
    public static string ToDateLabel(this string inputDate)
    {
        var today = DateTime.Today;
        
        if (!DateTimeOffset.TryParse(inputDate, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var dto)
         && !DateTimeOffset.TryParse(inputDate, CultureInfo.CurrentCulture, DateTimeStyles.AssumeLocal, out dto))
        {
            return "Unknown";
        }

        var date = dto.ToLocalTime().Date;
        if (date == today)
        {
            return "Today";
        }
        else if (date == today.AddDays(-1))
        {
            return "Yesterday";
        }
        else
        {
            var isThisWeek = Enumerable.Range(2, 5)
                .Any(day => date == today.AddDays(Math.Sign(-1) * day));

            return isThisWeek ? "This Week" : "Old";
        }
    }
}