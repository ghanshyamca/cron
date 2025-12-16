import { CronFieldParser } from '../../src/parsers/CronFieldParser';
import { CronValidator } from '../../src/validators/CronValidator';
import { FIELD_CONSTRAINTS, CronField } from '../../src/models/CronExpression';

describe('CronFieldParser', () => {
  let parser: CronFieldParser;
  let validator: CronValidator;

  beforeEach(() => {
    validator = new CronValidator();
    parser = new CronFieldParser(validator);
  });

  describe('parseField - wildcard', () => {
    it('should parse "*" as all values in range', () => {
      const result = parser.parseField('*', FIELD_CONSTRAINTS[CronField.MINUTE]);
      expect(result).toHaveLength(60);
      expect(result[0]).toBe(0);
      expect(result[59]).toBe(59);
    });

    it('should parse "*/15" for minutes', () => {
      const result = parser.parseField('*/15', FIELD_CONSTRAINTS[CronField.MINUTE]);
      expect(result).toEqual([0, 15, 30, 45]);
    });

    it('should parse "*/5" for hours', () => {
      const result = parser.parseField('*/5', FIELD_CONSTRAINTS[CronField.HOUR]);
      expect(result).toEqual([0, 5, 10, 15, 20]);
    });

    it('should throw error for invalid wildcard format', () => {
      expect(() => parser.parseField('*abc', FIELD_CONSTRAINTS[CronField.MINUTE])).toThrow();
    });
  });

  describe('parseField - single value', () => {
    it('should parse single numeric value', () => {
      const result = parser.parseField('5', FIELD_CONSTRAINTS[CronField.MINUTE]);
      expect(result).toEqual([5]);
    });

    it('should throw error for value out of range', () => {
      expect(() => parser.parseField('60', FIELD_CONSTRAINTS[CronField.MINUTE])).toThrow(
        'Value 60 is out of range for minute. Expected 0-59'
      );
    });

    it('should throw error for non-numeric value', () => {
      expect(() => parser.parseField('abc', FIELD_CONSTRAINTS[CronField.MINUTE])).toThrow(
        'Invalid numeric value: abc'
      );
    });
  });

  describe('parseField - range', () => {
    it('should parse simple range "1-5"', () => {
      const result = parser.parseField('1-5', FIELD_CONSTRAINTS[CronField.DAY_OF_WEEK]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should parse range with step "1-10/2"', () => {
      const result = parser.parseField('1-10/2', FIELD_CONSTRAINTS[CronField.MONTH]);
      expect(result).toEqual([1, 3, 5, 7, 9]);
    });

    it('should parse range "0-23" for hours', () => {
      const result = parser.parseField('0-23', FIELD_CONSTRAINTS[CronField.HOUR]);
      expect(result).toHaveLength(24);
      expect(result[0]).toBe(0);
      expect(result[23]).toBe(23);
    });

    it('should throw error when start > end', () => {
      expect(() => parser.parseField('10-5', FIELD_CONSTRAINTS[CronField.MINUTE])).toThrow(
        'Invalid range for minute: start (10) is greater than end (5)'
      );
    });

    it('should throw error for invalid range format', () => {
      expect(() => parser.parseField('a-b', FIELD_CONSTRAINTS[CronField.MINUTE])).toThrow(
        'Invalid range expression: a-b'
      );
    });
  });

  describe('parseField - list', () => {
    it('should parse comma-separated values "1,15"', () => {
      const result = parser.parseField('1,15', FIELD_CONSTRAINTS[CronField.DAY_OF_MONTH]);
      expect(result).toEqual([1, 15]);
    });

    it('should parse mixed list "1,5,10,15"', () => {
      const result = parser.parseField('1,5,10,15', FIELD_CONSTRAINTS[CronField.MINUTE]);
      expect(result).toEqual([1, 5, 10, 15]);
    });

    it('should parse list with ranges "1-5,10,15-20"', () => {
      const result = parser.parseField('1-5,10,15-20', FIELD_CONSTRAINTS[CronField.MINUTE]);
      expect(result).toEqual([1, 2, 3, 4, 5, 10, 15, 16, 17, 18, 19, 20]);
    });

    it('should remove duplicates and sort values', () => {
      const result = parser.parseField('5,3,5,1', FIELD_CONSTRAINTS[CronField.MINUTE]);
      expect(result).toEqual([1, 3, 5]);
    });
  });

  describe('parseField - edge cases', () => {
    it('should handle whitespace in expressions', () => {
      const result = parser.parseField(' 1 - 5 ', FIELD_CONSTRAINTS[CronField.DAY_OF_WEEK]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should throw error for empty field', () => {
      expect(() => parser.parseField('', FIELD_CONSTRAINTS[CronField.MINUTE])).toThrow(
        "Field 'minute' cannot be empty"
      );
    });

    it('should validate day of month constraints', () => {
      const result = parser.parseField('1-31', FIELD_CONSTRAINTS[CronField.DAY_OF_MONTH]);
      expect(result).toHaveLength(31);
    });

    it('should validate month constraints', () => {
      const result = parser.parseField('1-12', FIELD_CONSTRAINTS[CronField.MONTH]);
      expect(result).toHaveLength(12);
    });
  });
});
