import { CronExpression } from '../models/CronExpression';

/**
 * Formats parsed cron expressions for display
 * Follows Single Responsibility Principle - only handles output formatting
 */
export class OutputFormatter {
  private readonly FIELD_WIDTH = 14;

  /**
   * Formats a parsed cron expression as a table
   * @param expression - The parsed cron expression
   * @returns Formatted string representation
   */
  public format(expression: CronExpression): string {
    const lines: string[] = [
      this.formatLine('minute', expression.minute),
      this.formatLine('hour', expression.hour),
      this.formatLine('day of month', expression.dayOfMonth),
      this.formatLine('month', expression.month),
      this.formatLine('day of week', expression.dayOfWeek),
      this.formatLine('command', expression.command)
    ];

    return lines.join('\n');
  }

  /**
   * Formats a single line of the output table
   * @param fieldName - The name of the field
   * @param values - The values or command string
   * @returns Formatted line
   */
  private formatLine(fieldName: string, values: number[] | string): string {
    const paddedFieldName = fieldName.padEnd(this.FIELD_WIDTH);
    const valueString = Array.isArray(values) 
      ? values.join(' ') 
      : values;
    
    return `${paddedFieldName}${valueString}`;
  }
}
