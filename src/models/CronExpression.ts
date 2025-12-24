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

/**
 * Reverse mapping from names to numbers for day of week and month
 */
export const DAY_OF_WEEK_NAME_TO_NUMBER: Record<string, number> = {
  'SUN': 0, 'SUNDAY': 0,
  'MON': 1, 'MONDAY': 1,
  'TUE': 2, 'TUESDAY': 2,
  'WED': 3, 'WEDNESDAY': 3,
  'THU': 4, 'THURSDAY': 4,
  'FRI': 5, 'FRIDAY': 5,
  'SAT': 6, 'SATURDAY': 6
};

export const MONTH_NAME_TO_NUMBER: Record<string, number> = {
  'JAN': 1, 'JANUARY': 1,
  'FEB': 2, 'FEBRUARY': 2,
  'MAR': 3, 'MARCH': 3,
  'APR': 4, 'APRIL': 4,
  'MAY': 5,
  'JUN': 6, 'JUNE': 6,
  'JUL': 7, 'JULY': 7,
  'AUG': 8, 'AUGUST': 8,
  'SEP': 9, 'SEPTEMBER': 9,
  'OCT': 10, 'OCTOBER': 10,
  'NOV': 11, 'NOVEMBER': 11,
  'DEC': 12, 'DECEMBER': 12
};


