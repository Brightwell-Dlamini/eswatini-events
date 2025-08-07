import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), // Structured JSON logs
    ),
    transports: [
        // Log to console (for development)
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // Rotate logs daily (for production)
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});

export default logger;