/**
 * Represents a parsed cron expression with expanded field values
 */
export interface CronExpression {
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[];
  dayOfWeek: number[];
  command: string;
}

/**
 * Configuration for cron field constraints
 */
export interface FieldConstraints {
  min: number;
  max: number;
  name: string;
}

/**
 * Enumeration of all cron fields
 */
export enum CronField {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY_OF_MONTH = 'dayOfMonth',
  MONTH = 'month',
  DAY_OF_WEEK = 'dayOfWeek'
}

/**
 * Mapping of cron fields to their constraints
 */
export const FIELD_CONSTRAINTS: Record<CronField, FieldConstraints> = {
  [CronField.MINUTE]: { min: 0, max: 59, name: 'minute' },
  [CronField.HOUR]: { min: 0, max: 23, name: 'hour' },
  [CronField.DAY_OF_MONTH]: { min: 1, max: 31, name: 'day of month' },
  [CronField.MONTH]: { min: 1, max: 12, name: 'month' },
  [CronField.DAY_OF_WEEK]: { min: 0, max: 6, name: 'day of week' }
};
