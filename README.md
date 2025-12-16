# Cron Expression Parser

A command-line application that parses cron expressions and expands each field to show the times at which it will run.

## Features

- ✅ Parses standard 5-field cron expressions (minute, hour, day of month, month, day of week) plus command
- ✅ Supports all standard cron syntax:
  - Wildcards (`*`)
  - Specific values (`5`)
  - Ranges (`1-5`)
  - Steps/intervals (`*/15`, `1-10/2`)
  - Lists (`1,15,30`)
  - Combinations (`1-5,10,15-20`)
- ✅ Built with TypeScript following OOP, SOLID, and DRY principles
- ✅ Comprehensive test coverage (80%+ coverage target)
- ✅ Clear error messages for invalid expressions
- ✅ No external cron parsing libraries used

## Architecture

The project follows SOLID principles with a clean, modular architecture:

```
src/
├── models/           # Data models and interfaces
│   └── CronExpression.ts
├── validators/       # Validation logic (SRP)
│   └── CronValidator.ts
├── parsers/          # Parsing logic (SRP)
│   ├── CronFieldParser.ts
│   └── CronParser.ts
├── formatters/       # Output formatting (SRP)
│   └── OutputFormatter.ts
└── index.ts         # CLI entry point (DIP)
```

### Design Principles Applied

- **Single Responsibility Principle (SRP)**: Each class has one clear responsibility
  - `CronValidator`: Validates input
  - `CronFieldParser`: Parses individual fields
  - `CronParser`: Orchestrates field parsing
  - `OutputFormatter`: Formats output

- **Open/Closed Principle (OCP)**: Classes are open for extension via dependency injection

- **Dependency Inversion Principle (DIP)**: High-level modules depend on abstractions through constructor injection

- **DRY Principle**: Common parsing logic is centralized and reused

## Requirements

- Node.js 16+ (recommended: Node.js 18 or 20)
- npm or yarn

## Installation

### For Development

```bash
# Clone or extract the project
cd cron

# Install dependencies
npm install

# Build the project
npm run build
```

### For Production Use

```bash
# Install dependencies
npm install

# Build and prepare for use
npm run prepare
```

## Usage

### Command Line

After building, run the parser with a cron expression:

```bash
# Using npm start
npm start "*/15 0 1,15 * 1-5 /usr/bin/find"

# Or using node directly
node dist/index.js "*/15 0 1,15 * 1-5 /usr/bin/find"

# Or if installed globally
cron-parser "*/15 0 1,15 * 1-5 /usr/bin/find"
```

### Example Output

```bash
$ npm start "*/15 0 1,15 * 1-5 /usr/bin/find"

minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
```

### More Examples

```bash
# Every minute
npm start "* * * * * /usr/bin/backup"

# At 12:00 PM on the 1st of January
npm start "0 12 1 1 * /backup.sh"

# Every 5 minutes on weekdays
npm start "*/5 * * * 1-5 /script.sh"

# Complex schedule
npm start "5,10,15 */2 1-15/3 1,6,12 0-4 /usr/bin/task"
```

## Cron Expression Format

The parser expects expressions in the format:

```
<minute> <hour> <day_of_month> <month> <day_of_week> <command>
```

### Field Constraints

| Field         | Required Values | Allowed Values |
|---------------|-----------------|----------------|
| minute        | Yes             | 0-59           |
| hour          | Yes             | 0-23           |
| day of month  | Yes             | 1-31           |
| month         | Yes             | 1-12           |
| day of week   | Yes             | 0-6 (0=Sunday) |
| command       | Yes             | Any string     |

### Supported Syntax

| Syntax      | Description                  | Example   | Result             |
|-------------|------------------------------|-----------|--------------------|
| `*`         | All values                   | `*`       | 0 1 2 ... (all)    |
| `*/n`       | Every nth value              | `*/15`    | 0 15 30 45         |
| `n`         | Specific value               | `5`       | 5                  |
| `n-m`       | Range of values              | `1-5`     | 1 2 3 4 5          |
| `n-m/s`     | Range with step              | `1-10/2`  | 1 3 5 7 9          |
| `a,b,c`     | List of values               | `1,15,30` | 1 15 30            |
| `a-b,c-d`   | Multiple ranges              | `1-5,10`  | 1 2 3 4 5 10       |

## Development

### Available Scripts

```bash
# Build the project
npm run build

# Run in development mode (with ts-node)
npm run dev "*/15 0 1,15 * 1-5 /usr/bin/find"

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for development
npm run test:watch
```

The project has comprehensive test coverage including:
- Unit tests for all components
- Edge case testing
- Error handling validation
- Integration tests

### Test Coverage

The project maintains high test coverage standards:
- Branches: 80%+
- Functions: 80%+
- Lines: 80%+
- Statements: 80%+

View detailed coverage reports:
```bash
npm run test:coverage
# Open coverage/index.html in a browser
```

## Project Structure

```
cron/
├── src/
│   ├── models/
│   │   └── CronExpression.ts       # Data models and field constraints
│   ├── validators/
│   │   └── CronValidator.ts        # Input validation logic
│   ├── parsers/
│   │   ├── CronFieldParser.ts      # Individual field parsing
│   │   └── CronParser.ts           # Main cron parser
│   ├── formatters/
│   │   └── OutputFormatter.ts      # Output table formatting
│   └── index.ts                    # CLI entry point
├── tests/
│   ├── validators/
│   │   └── CronValidator.test.ts
│   ├── parsers/
│   │   ├── CronFieldParser.test.ts
│   │   └── CronParser.test.ts
│   └── formatters/
│       └── OutputFormatter.test.ts
├── dist/                           # Compiled JavaScript (generated)
├── coverage/                       # Test coverage reports (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
├── .gitignore
└── README.md
```

## Error Handling

The parser provides clear error messages for common issues:

```bash
# Missing arguments
$ npm start
Error: No cron expression provided
Usage: cron-parser "<cron-expression>"

# Invalid format
$ npm start "* * * *"
Error: Invalid cron format. Expected 6 parts (...), got 4

# Out of range value
$ npm start "60 0 1 1 0 /cmd"
Error: Value 60 is out of range for minute. Expected 0-59

# Invalid syntax
$ npm start "abc 0 1 1 0 /cmd"
Error: Invalid numeric value: abc
```

## Implementation Notes

### What's Supported

✅ All standard cron field syntax (wildcards, ranges, steps, lists)  
✅ All five time fields plus command  
✅ Commands with spaces and special characters  
✅ Comprehensive validation and error messages  
✅ Full test coverage  

### What's Not Supported

❌ Special time strings (@yearly, @monthly, @daily, @hourly, @reboot)  
❌ Extended cron formats (6 or 7 field formats with seconds/year)  
❌ Named months or days (JAN, MON, etc.)  
❌ Last day of month (L)  
❌ Weekday nearest to a date (W)  
❌ Nth occurrence of weekday (#)  

These limitations are intentional to keep the implementation focused on the core requirements.

## Building for Production

```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build

# Test the build
node dist/index.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

## Troubleshooting

### Common Issues

**Issue**: `Cannot find module` errors  
**Solution**: Run `npm install` to install dependencies

**Issue**: TypeScript compilation errors  
**Solution**: Ensure you're using TypeScript 5.x: `npm install`

**Issue**: Tests failing  
**Solution**: Run `npm test` to see detailed error messages

**Issue**: Permission denied when running the script  
**Solution**: Make sure the script is built: `npm run build`

## License

MIT

## Author

Created as a technical assessment demonstrating TypeScript, OOP principles, and test-driven development.

## Contributing

This is a demonstration project. For improvements:
1. Write tests first (TDD)
2. Follow existing code style
3. Maintain SOLID principles
4. Ensure all tests pass
5. Update documentation

---

**Note**: This parser was built from scratch without using existing cron parsing libraries to demonstrate core programming skills and understanding of the cron format.
