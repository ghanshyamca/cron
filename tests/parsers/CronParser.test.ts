import { CronParser } from '../../src/parsers/CronParser';
import { CronFieldParser } from '../../src/parsers/CronFieldParser';
import { CronValidator } from '../../src/validators/CronValidator';

describe('CronParser', () => {
  let parser: CronParser;

  beforeEach(() => {
    const validator = new CronValidator();
    const fieldParser = new CronFieldParser(validator);
    parser = new CronParser(fieldParser, validator);
  });

  describe('parse', () => {
    it('should parse valid cron expression', () => {
      const result = parser.parse('*/15 0 1,15 * 1-5 /usr/bin/find');
      
      expect(result.minute).toEqual([0, 15, 30, 45]);
      expect(result.hour).toEqual([0]);
      expect(result.dayOfMonth).toEqual([1, 15]);
      expect(result.month).toHaveLength(12);
      expect(result.dayOfWeek).toEqual([1, 2, 3, 4, 5]);
      expect(result.command).toBe('/usr/bin/find');
    });

    it('should parse expression with all wildcards', () => {
      const result = parser.parse('* * * * * /usr/bin/command');
      
      expect(result.minute).toHaveLength(60);
      expect(result.hour).toHaveLength(24);
      expect(result.dayOfMonth).toHaveLength(31);
      expect(result.month).toHaveLength(12);
      expect(result.dayOfWeek).toHaveLength(7);
      expect(result.command).toBe('/usr/bin/command');
    });

    it('should parse expression with specific values', () => {
      const result = parser.parse('0 12 1 1 0 /backup.sh');
      
      expect(result.minute).toEqual([0]);
      expect(result.hour).toEqual([12]);
      expect(result.dayOfMonth).toEqual([1]);
      expect(result.month).toEqual([1]);
      expect(result.dayOfWeek).toEqual([0]);
      expect(result.command).toBe('/backup.sh');
    });

    it('should handle command with multiple words', () => {
      const result = parser.parse('0 0 * * * /usr/bin/find /home -name "*.log"');
      
      expect(result.command).toBe('/usr/bin/find /home -name "*.log"');
    });

    it('should handle command with spaces', () => {
      const result = parser.parse('0 0 * * * echo "hello world"');
      
      expect(result.command).toBe('echo "hello world"');
    });

    it('should throw error for empty cron string', () => {
      expect(() => parser.parse('')).toThrow('Cron expression cannot be empty');
    });

    it('should throw error for whitespace-only cron string', () => {
      expect(() => parser.parse('   ')).toThrow('Cron expression cannot be empty');
    });

    it('should throw error for invalid number of fields', () => {
      expect(() => parser.parse('* * * * *')).toThrow(
        'Invalid cron format. Expected 6 parts (minute hour day_of_month month day_of_week command), got 5'
      );
    });

    it('should throw error for invalid field values', () => {
      expect(() => parser.parse('60 0 1 1 0 /cmd')).toThrow(
        'Value 60 is out of range for minute. Expected 0-59'
      );
    });

    it('should parse complex expression', () => {
      const result = parser.parse('5,10,15 */2 1-15/3 1,6,12 0-4 /script.sh');
      
      expect(result.minute).toEqual([5, 10, 15]);
      expect(result.hour).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]);
      expect(result.dayOfMonth).toEqual([1, 4, 7, 10, 13]);
      expect(result.month).toEqual([1, 6, 12]);
      expect(result.dayOfWeek).toEqual([0, 1, 2, 3, 4]);
      expect(result.command).toBe('/script.sh');
    });

    it('should handle extra whitespace in cron string', () => {
      const result = parser.parse('  */15   0   1,15   *   1-5   /usr/bin/find  ');
      
      expect(result.minute).toEqual([0, 15, 30, 45]);
      expect(result.command).toBe('/usr/bin/find');
    });
  });
});
