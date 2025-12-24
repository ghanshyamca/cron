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
    console.error('Usage: cron-parser "<cron-expression>" [additional-expressions...]');
    console.error('Example: cron-parser "*/15 0 1,15 * 1-5 /usr/bin/find"');
    process.exit(1);
  }

  // Dependency injection - following Dependency Inversion Principle
  const validator = new CronValidator();
  const fieldParser = new CronFieldParser(validator);
  const parser = new CronParser(fieldParser, validator);
  const formatter = new OutputFormatter();

  // Process each cron expression
  for (let i = 0; i < args.length; i++) {
    const cronExpression = args[i];
    
    try {
      if (args.length > 1) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Cron Expression ${i + 1} of ${args.length}: ${cronExpression}`);
        console.log('='.repeat(80));
      } else {
        console.log(`Cron Expression Parser: ${cronExpression}`);
      }

      // Parse the cron expression
      const parsed = parser.parse(cronExpression);

      // Format and output the result
      const output = formatter.format(parsed);
      console.log(output);

    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error processing expression ${i + 1}: ${error.message}`);
      } else {
        console.error(`An unexpected error occurred processing expression ${i + 1}`);
      }
      if (args.length === 1) {
        process.exit(1);
      }
      // Continue processing remaining expressions if there are multiple
    }
  }
}

// Run the main function
main();
