import { OutputFormatter } from '../../src/formatters/OutputFormatter';
import { CronExpression } from '../../src/models/CronExpression';

describe('OutputFormatter', () => {
  let formatter: OutputFormatter;

  beforeEach(() => {
    formatter = new OutputFormatter();
  });

  describe('format', () => {
    it('should format cron expression with proper field width', () => {
      const expression: CronExpression = {
        minute: [0, 15, 30, 45],
        hour: [0],
        dayOfMonth: [1, 15],
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        dayOfWeek: [1, 2, 3, 4, 5],
        command: '/usr/bin/find'
      };

      const result = formatter.format(expression);
      const lines = result.split('\n');

      expect(lines).toHaveLength(6);
      expect(lines[0]).toBe('minute        0 15 30 45');
      expect(lines[1]).toBe('hour          0');
      expect(lines[2]).toBe('day of month  1 15');
      expect(lines[3]).toBe('month         1 2 3 4 5 6 7 8 9 10 11 12');
      expect(lines[4]).toBe('day of week   1 2 3 4 5');
      expect(lines[5]).toBe('command       /usr/bin/find');
    });

    it('should format all wildcards expression', () => {
      const expression: CronExpression = {
        minute: Array.from({ length: 60 }, (_, i) => i),
        hour: Array.from({ length: 24 }, (_, i) => i),
        dayOfMonth: Array.from({ length: 31 }, (_, i) => i + 1),
        month: Array.from({ length: 12 }, (_, i) => i + 1),
        dayOfWeek: Array.from({ length: 7 }, (_, i) => i),
        command: '/script.sh'
      };

      const result = formatter.format(expression);
      const lines = result.split('\n');

      expect(lines[0]).toContain('minute');
      expect(lines[0]).toContain('0 1 2 3 4 5');
      expect(lines[5]).toBe('command       /script.sh');
    });

    it('should format single values', () => {
      const expression: CronExpression = {
        minute: [0],
        hour: [12],
        dayOfMonth: [1],
        month: [1],
        dayOfWeek: [0],
        command: '/backup.sh'
      };

      const result = formatter.format(expression);
      const lines = result.split('\n');

      expect(lines[0]).toBe('minute        0');
      expect(lines[1]).toBe('hour          12');
      expect(lines[2]).toBe('day of month  1');
      expect(lines[3]).toBe('month         1');
      expect(lines[4]).toBe('day of week   0');
      expect(lines[5]).toBe('command       /backup.sh');
    });

    it('should format command with spaces', () => {
      const expression: CronExpression = {
        minute: [0],
        hour: [0],
        dayOfMonth: [1],
        month: [1],
        dayOfWeek: [0],
        command: '/usr/bin/find /home -name "*.log"'
      };

      const result = formatter.format(expression);
      const lines = result.split('\n');

      expect(lines[5]).toBe('command       /usr/bin/find /home -name "*.log"');
    });

    it('should maintain field width of 14 characters', () => {
      const expression: CronExpression = {
        minute: [5],
        hour: [10],
        dayOfMonth: [15],
        month: [6],
        dayOfWeek: [3],
        command: '/test'
      };

      const result = formatter.format(expression);
      const lines = result.split('\n');

      // Each field name should be padded to 14 characters
      lines.slice(0, 5).forEach(line => {
        const fieldName = line.substring(0, 14);
        expect(fieldName).toHaveLength(14);
      });
    });

    it('should format empty arrays as empty strings', () => {
      const expression: CronExpression = {
        minute: [],
        hour: [],
        dayOfMonth: [],
        month: [],
        dayOfWeek: [],
        command: ''
      };

      const result = formatter.format(expression);
      const lines = result.split('\n');

      expect(lines[0]).toBe('minute        ');
      expect(lines[5]).toBe('command       ');
    });
  });
});
