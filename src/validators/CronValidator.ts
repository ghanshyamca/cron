import { FieldConstraints } from '../models/CronExpression';

/**
 * Validates cron expression components
 * Follows Single Responsibility Principle - only handles validation
 */
export class CronValidator {
  /**
   * Validates that a cron string has the correct number of parts
   * @param parts - The split cron expression parts
   * @throws Error if the format is invalid
   */
  public validateCronFormat(parts: string[]): void {
    if (parts.length < 6) {
      throw new Error(
        `Invalid cron format. Expected 6 parts (minute hour day_of_month month day_of_week command), got ${parts.length}`
      );
    }
  }

  /**
   * Validates that a field expression is not empty
   * @param field - The field expression to validate
   * @param fieldName - The name of the field for error messages
   * @throws Error if the field is empty
   */
  public validateFieldNotEmpty(field: string, fieldName: string): void {
    if (!field || field.trim() === '') {
      throw new Error(`Field '${fieldName}' cannot be empty`);
    }
  }

  /**
   * Validates that a numeric value is within the allowed range for a field
   * @param value - The numeric value to validate
   * @param constraints - The field constraints
   * @throws Error if the value is out of range
   */
  public validateValueInRange(value: number, constraints: FieldConstraints): void {
    if (value < constraints.min || value > constraints.max) {
      throw new Error(
        `Value ${value} is out of range for ${constraints.name}. ` +
        `Expected ${constraints.min}-${constraints.max}`
      );
    }
  }

  /**
   * Validates a step value
   * @param step - The step value to validate
   * @param fieldName - The name of the field for error messages
   * @throws Error if the step is invalid
   */
  public validateStep(step: number, fieldName: string): void {
    if (step <= 0) {
      throw new Error(`Step value for ${fieldName} must be greater than 0, got ${step}`);
    }
  }
}
