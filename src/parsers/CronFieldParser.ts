import { FieldConstraints } from '../models/CronExpression';
import { CronValidator } from '../validators/CronValidator';

/**
 * Parses individual cron field expressions into arrays of values
 * Follows Single Responsibility Principle - only handles field parsing logic
 */
export class CronFieldParser {
  private validator: CronValidator;

  constructor(validator: CronValidator) {
    this.validator = validator;
  }

  /**
   * Parses a cron field expression and returns all matching values
   * @param expression - The field expression (e.g., wildcard, range, or list)
   * @param constraints - The field constraints
   * @returns Array of all values that match the expression
   */
  public parseField(expression: string, constraints: FieldConstraints): number[] {
    this.validator.validateFieldNotEmpty(expression, constraints.name);

    // Handle asterisk with optional step
    if (expression.includes('*')) {
      return this.parseWildcard(expression, constraints);
    }

    // Handle comma-separated values
    if (expression.includes(',')) {
      return this.parseList(expression, constraints);
    }

    // Handle range with optional step
    if (expression.includes('-')) {
      return this.parseRange(expression, constraints);
    }

    // Handle single value
    return this.parseSingleValue(expression, constraints);
  }

  /**
   * Parses wildcard expressions (e.g., asterisk or asterisk with step)
   */
  private parseWildcard(expression: string, constraints: FieldConstraints): number[] {
    const parts = expression.split('/');
    
    if (parts[0] !== '*') {
      throw new Error(`Invalid wildcard expression: ${expression}`);
    }

    const step = parts.length > 1 ? parseInt(parts[1], 10) : 1;
    
    if (isNaN(step)) {
      throw new Error(`Invalid step value in expression: ${expression}`);
    }

    this.validator.validateStep(step, constraints.name);

    return this.generateRange(constraints.min, constraints.max, step);
  }

  /**
   * Parses comma-separated list expressions (e.g., 1,3,5)
   */
  private parseList(expression: string, constraints: FieldConstraints): number[] {
    const parts = expression.split(',');
    const values: number[] = [];

    for (const part of parts) {
      const trimmedPart = part.trim();
      
      // Each part can be a range or single value
      if (trimmedPart.includes('-')) {
        values.push(...this.parseRange(trimmedPart, constraints));
      } else {
        values.push(...this.parseSingleValue(trimmedPart, constraints));
      }
    }

    // Return unique sorted values
    return [...new Set(values)].sort((a, b) => a - b);
  }

  /**
   * Parses range expressions (e.g., 1-5 or 1-5/2)
   */
  private parseRange(expression: string, constraints: FieldConstraints): number[] {
    const [rangePart, stepPart] = expression.split('/');
    const [startStr, endStr] = rangePart.split('-');

    const start = parseInt(startStr.trim(), 10);
    const end = parseInt(endStr.trim(), 10);

    if (isNaN(start) || isNaN(end)) {
      throw new Error(`Invalid range expression: ${expression}`);
    }

    this.validator.validateValueInRange(start, constraints);
    this.validator.validateValueInRange(end, constraints);

    if (start > end) {
      throw new Error(
        `Invalid range for ${constraints.name}: start (${start}) is greater than end (${end})`
      );
    }

    const step = stepPart ? parseInt(stepPart.trim(), 10) : 1;
    
    if (isNaN(step)) {
      throw new Error(`Invalid step value in expression: ${expression}`);
    }

    this.validator.validateStep(step, constraints.name);

    return this.generateRange(start, end, step);
  }

  /**
   * Parses single value expressions (e.g., 5)
   */
  private parseSingleValue(expression: string, constraints: FieldConstraints): number[] {
    const value = parseInt(expression.trim(), 10);

    if (isNaN(value)) {
      throw new Error(`Invalid numeric value: ${expression}`);
    }

    this.validator.validateValueInRange(value, constraints);

    return [value];
  }

  /**
   * Generates an array of numbers within a range with a step
   */
  private generateRange(start: number, end: number, step: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  }
}
