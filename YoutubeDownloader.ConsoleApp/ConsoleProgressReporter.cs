internal class ConsoleProgressReporter : IProgress<double>
{
    public void Report(double value)
    {        
        Console.WriteLine($"Progress: {value:P2}");
    }
}