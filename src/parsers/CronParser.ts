import { CronExpression, CronField, FIELD_CONSTRAINTS } from '../models/CronExpression';
import { CronFieldParser } from './CronFieldParser';
import { CronValidator } from '../validators/CronValidator';

/**
 * Main parser for cron expressions
 * Follows Open/Closed Principle - open for extension via dependency injection
 */
export class CronParser {
  private fieldParser: CronFieldParser;
  private validator: CronValidator;

  constructor(fieldParser: CronFieldParser, validator: CronValidator) {
    this.fieldParser = fieldParser;
    this.validator = validator;
  }

  /**
   * Parses a complete cron expression string
   * @param cronString - The cron expression to parse
   * @returns Parsed cron expression with expanded fields
   */
  public parse(cronString: string): CronExpression {
    if (!cronString || cronString.trim() === '') {
      throw new Error('Cron expression cannot be empty');
    }

    const parts = cronString.trim().split(/\s+/);
    this.validator.validateCronFormat(parts);

    const [minuteExpr, hourExpr, dayOfMonthExpr, monthExpr, dayOfWeekExpr, ...commandParts] = parts;

    return {
      minute: this.fieldParser.parseFields(minuteExpr, FIELD_CONSTRAINTS[CronField.MINUTE]),
      hour: this.fieldParser.parseFields(hourExpr, FIELD_CONSTRAINTS[CronField.HOUR]),
      dayOfMonth: this.fieldParser.parseFields(dayOfMonthExpr, FIELD_CONSTRAINTS[CronField.DAY_OF_MONTH]),
      month: this.fieldParser.parseFields(monthExpr, FIELD_CONSTRAINTS[CronField.MONTH]),
      dayOfWeek: this.fieldParser.parseFields(dayOfWeekExpr, FIELD_CONSTRAINTS[CronField.DAY_OF_WEEK]),
      command: commandParts.join(' ')
    };
  }
}
