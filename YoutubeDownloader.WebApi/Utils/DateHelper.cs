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
        if (date == today) return "Today";

        if (date == today.AddDays(-1)) return "Yesterday";

        var weekOfYear = ISOWeek.GetWeekOfYear(today);
        var year = date.Year;
        var startAndEndDateOfWeek = GetStartAndEndDateOfWeek(year, weekOfYear);        
        if (date >= startAndEndDateOfWeek.Start && date <= startAndEndDateOfWeek.End)
        {
            return "This Week";
        }

        if (date > startAndEndDateOfWeek.End)
        {
            return "Future";
        }

        return "Old";
    }
    
    public static (DateTime Start, DateTime End) GetStartAndEndDateOfWeek(int year, int weekOfYear, DayOfWeek firstDayOfWeek = DayOfWeek.Monday)
    {
        var firstDayOfYear = new DateTime(year, 1, 1);
        var dayOffset = (int)firstDayOfWeek - (int)firstDayOfYear.DayOfWeek;
        if (dayOffset > 0)
        {
            dayOffset -= 7;
        }

        var firstDayOfFirstWeek = firstDayOfYear.AddDays(dayOffset);
        var startDayOfTheWeek = firstDayOfFirstWeek.AddDays((weekOfYear - 1) * 7);
        var endDayOfTheWeek = startDayOfTheWeek.AddDays(6);
        return (startDayOfTheWeek, endDayOfTheWeek);
    }
}