import { CronValidator } from '../../src/validators/CronValidator';
import { FIELD_CONSTRAINTS, CronField } from '../../src/models/CronExpression';

describe('CronValidator', () => {
  let validator: CronValidator;

  beforeEach(() => {
    validator = new CronValidator();
  });

  describe('validateCronFormat', () => {
    it('should accept valid cron format with 6 parts', () => {
      const parts = ['*', '0', '1', '*', '*', '/usr/bin/find'];
      expect(() => validator.validateCronFormat(parts)).not.toThrow();
    });

    it('should accept cron format with more than 6 parts (command with spaces)', () => {
      const parts = ['*', '0', '1', '*', '*', '/usr/bin/find', '-name', '"*.log"'];
      expect(() => validator.validateCronFormat(parts)).not.toThrow();
    });

    it('should reject cron format with fewer than 6 parts', () => {
      const parts = ['*', '0', '1', '*', '*'];
      expect(() => validator.validateCronFormat(parts)).toThrow(
        'Invalid cron format. Expected 6 parts (minute hour day_of_month month day_of_week command), got 5'
      );
    });
  });

  describe('validateFieldNotEmpty', () => {
    it('should accept non-empty field', () => {
      expect(() => validator.validateFieldNotEmpty('*', 'minute')).not.toThrow();
    });

    it('should reject empty string', () => {
      expect(() => validator.validateFieldNotEmpty('', 'minute')).toThrow(
        "Field 'minute' cannot be empty"
      );
    });

    it('should reject whitespace-only string', () => {
      expect(() => validator.validateFieldNotEmpty('   ', 'hour')).toThrow(
        "Field 'hour' cannot be empty"
      );
    });
  });

  describe('validateValueInRange', () => {
    it('should accept value within range', () => {
      const constraints = FIELD_CONSTRAINTS[CronField.MINUTE];
      expect(() => validator.validateValueInRange(30, constraints)).not.toThrow();
    });

    it('should accept minimum value', () => {
      const constraints = FIELD_CONSTRAINTS[CronField.MINUTE];
      expect(() => validator.validateValueInRange(0, constraints)).not.toThrow();
    });

    it('should accept maximum value', () => {
      const constraints = FIELD_CONSTRAINTS[CronField.MINUTE];
      expect(() => validator.validateValueInRange(59, constraints)).not.toThrow();
    });

    it('should reject value below minimum', () => {
      const constraints = FIELD_CONSTRAINTS[CronField.MINUTE];
      expect(() => validator.validateValueInRange(-1, constraints)).toThrow(
        'Value -1 is out of range for minute. Expected 0-59'
      );
    });

    it('should reject value above maximum', () => {
      const constraints = FIELD_CONSTRAINTS[CronField.MINUTE];
      expect(() => validator.validateValueInRange(60, constraints)).toThrow(
        'Value 60 is out of range for minute. Expected 0-59'
      );
    });
  });

  describe('validateStep', () => {
    it('should accept positive step value', () => {
      expect(() => validator.validateStep(15, 'minute')).not.toThrow();
    });

    it('should reject zero step value', () => {
      expect(() => validator.validateStep(0, 'minute')).toThrow(
        'Step value for minute must be greater than 0, got 0'
      );
    });

    it('should reject negative step value', () => {
      expect(() => validator.validateStep(-5, 'hour')).toThrow(
        'Step value for hour must be greater than 0, got -5'
      );
    });
  });
});
