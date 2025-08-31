export interface IReport {
  type: 'error' | 'start' | 'progress' | 'completed';
  message: string;
  step?: number;
  totalSteps?: number;
}

export function formatReport(report: IReport): string {
  if (report.type === 'progress') {
    return (
      `Progress: ${report.step}/${report.totalSteps} - ${report.message}` +
      '<br/>'
    );
  } else if (report.type === 'start') {
    return `Started: ${report.message}` + '<br/>';
  } else if (report.type === 'completed') {
    return `Completed: ${report.message}` + '<br/>';
  } else if (report.type === 'error') {
    return `Error: ${report.message}` + '<br/>';
  } else {
    return JSON.stringify(report) + '<br/>';
  }
}
