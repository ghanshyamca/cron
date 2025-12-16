#!/usr/bin/env node

import { CronParser } from './parsers/CronParser';
import { CronFieldParser } from './parsers/CronFieldParser';
import { CronValidator } from './validators/CronValidator';
import { OutputFormatter } from './formatters/OutputFormatter';

/**
 * Main entry point for the cron expression parser CLI
 */
function main(): void {
  const args = process.argv.slice(2);

  // Check if cron expression was provided
  if (args.length === 0) {
    console.error('Error: No cron expression provided');
    console.error('Usage: cron-parser "<cron-expression>"');
    console.error('Example: cron-parser "*/15 0 1,15 * 1-5 /usr/bin/find"');
    process.exit(1);
  }

  const cronExpression = args[0];

  try {
    // Dependency injection - following Dependency Inversion Principle
    const validator = new CronValidator();
    const fieldParser = new CronFieldParser(validator);
    const parser = new CronParser(fieldParser, validator);
    const formatter = new OutputFormatter();

    // Parse the cron expression
    const parsed = parser.parse(cronExpression);

    // Format and output the result
    const output = formatter.format(parsed);
    console.log(output);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}

// Run the main function
main();
