Winston Logger Explanation
This note explains a Winston logger setup for a Node.js/Express/TypeScript backend with MongoDB. The logger tracks application events, errors, and more, with output to the console and files.
Code
import winston from 'winston';
import fs from 'fs';

// Ensure logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

export default logger;

Breakdown

Importing Winston:

import winston from 'winston': Imports Winston, a logging library for Node.js.
Purpose: Logs messages at different levels (e.g., info, error) to various outputs (console, files).
TypeScript: Needs @types/winston for type safety (npm install --save-dev @types/winston).


Creating Logs Directory:

import fs from 'fs': Imports Node.js File System module.
const logDir = 'logs'; if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }:
Checks if logs/ directory exists using fs.existsSync.
Creates it with fs.mkdirSync if missing.


Purpose: Ensures Winston can write to logs/error.log and logs/combined.log without errors.
TypeScript: fs types come from @types/node (npm install --save-dev @types/node).


Creating the Logger:

winston.createLogger({ ... }): Initializes a logger with configuration.
level: 'info': Logs info and higher severity (e.g., info, warn, error, but not debug).
Study Tip: Use debug in development for detailed logs, info or warn in production.


Log Format:

format: winston.format.combine(...): Combines multiple formatters.
winston.format.timestamp(): Adds a timestamp (e.g., 2025-04-16T12:34:56.789Z).
winston.format.printf(({ timestamp, level, message }) => ...): Formats logs as: 2025-04-16T12:34:56.789Z [INFO]: Message.
Purpose: Makes logs human-readable with timestamp and severity.
TypeScript: Can explicitly type the printf parameter for clarity:({ timestamp, level, message }: { timestamp: string; level: string; message: string })




Transports:

transports: [...]: Defines where logs are sent.
new winston.transports.Console(): Outputs logs to the terminal (great for development).
new winston.transports.File({ filename: 'logs/error.log', level: 'error' }): Writes error logs to logs/error.log.
new winston.transports.File({ filename: 'logs/combined.log' }): Writes all logs (info and above) to logs/combined.log.
Purpose: Separates error logs from general logs for easier debugging.


Exporting:

export default logger: Makes the logger reusable in other files (e.g., Express routes, MongoDB operations).
TypeScript: logger is typed as winston.Logger, enabling autocompletion for methods like logger.info().



Usage Examples

Express: Log requests in middleware:app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});


MongoDB: Log database operations:mongoose.connect('mongodb://localhost:27017/mydb')
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error(`MongoDB connection error: ${err.message}`));



Best Practices

Environment-Based Config: Use debug in development, info in production:level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'


Log Rotation: Use winston-daily-rotate-file to prevent log files from growing too large:new DailyRotateFile({ filename: 'logs/combined-%DATE%.log', datePattern: 'YYYY-MM-DD', maxFiles: '14d' })


Structured Logging: Use winston.format.json() in production for tools like ELK Stack.
Error Handling: Catch transport errors:logger.on('error', (err) => console.error('Logger error:', err));



Pitfalls to Avoid

Missing Logs Directory: Fixed by fs.mkdirSync. Without it, Winston fails to write files.
Overlogging: Avoid debug in production to prevent performance issues.
TypeScript: Ensure @types/winston and @types/node are installed to avoid any types.

Study Tips

Experiment: Try logging a message (logger.info('Test')) in your app and check combined.log.
Extend: Add a custom transport (e.g., to a cloud service like AWS CloudWatch).
Review: Revisit Winston’s docs (https://github.com/winstonjs/winston) for advanced features like custom levels.

