public static class DateHelper
{
    public static string ToDateLabel(this string inputDate)
    {
        var today = DateTime.Today;
        if (inputDate == today.ToString("d"))
        {
            return "Today";
        }
        else if (inputDate == today.AddDays(-1).ToString("d"))
        {
            return "Yesterday";
        }
        else
        {
            var isThisWeek = Enumerable.Range(2, 5)
                .Any(day => inputDate == today.AddDays(Math.Sign(-1) * day)
                .ToString("d"));

            return isThisWeek ? "This Week" : "Old";
        }
    }
}