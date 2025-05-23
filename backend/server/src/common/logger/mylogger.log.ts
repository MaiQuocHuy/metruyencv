import {
  createLogger,
  format,
  transports,
  Logform,
  LoggerOptions,
  Logger,
} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export class Logging {
  myFormat: Logform.Format = null;
  createLoggerConfig: LoggerOptions = null;
  logger: Logger = null;
  constructor() {
    this.myFormat = format.printf(
      ({
        level = 'info',
        message,
        timestamp,
        context,
        refCode,
        err,
        statusCode,
        metadata,
        option,
      }) => {
        let msg = `${timestamp} - ${level} - ${context} - ${refCode} - ${message} - ${JSON.stringify(metadata) || statusCode}${!option ? '' : ' - ' + option}`;
        if (err) {
          msg += ' - ' + (err as Error).stack || err;
        }
        return msg;
      },
    );

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        this.myFormat,
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true }), // Apply colorize only to console
            this.myFormat,
          ),
        }),
        new DailyRotateFile({
          level: 'error',
          dirname: 'src/logs',
          filename: 'application-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '1d',
        }),
        new DailyRotateFile({
          level: 'info',
          dirname: 'src/logs',
          filename: 'application-%DATE%.info.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '1d',
        }),
      ],
    });
  }

  public getLogger() {
    return this.logger;
  }
}
