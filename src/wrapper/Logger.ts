
enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export type LoggerOptions = {
  logToConsole: boolean;
  /** If false or omitted only WARN and ERROR messages will be logged. If true, INFO and DEBUG will also be logged. */
  verbose?: boolean;
};

/**
 * A simple logger that logs to the console
 * If no options are provided, it will log to the console not verbosely (i.e. INFO and DEBUG messages will be ignored)
 */
export class Logger {
  private options: LoggerOptions;

  constructor(options?: LoggerOptions) {
    if (!options) {
      this.options = { logToConsole: true, verbose: false };
      return;
    }
    this.options = options;
  }

  private log(message: string, level: LogLevel): void {
    if (this.options.logToConsole) return;
    if (
      !this.options.verbose &&
      (level === LogLevel.DEBUG || level === LogLevel.INFO)
    )
      return;
    const timestamp = new Date().toISOString();
    const formattedMessage = `Bytebot SDK | ${timestamp} [${level}]: ${message}`;

    console.log(formattedMessage);
  }

  debug(message: string): void {
    this.log(message, LogLevel.DEBUG);
  }

  info(message: string): void {
    this.log(message, LogLevel.INFO);
  }

  warn(message: string): void {
    this.log(message, LogLevel.WARN);
  }

  error(message: string): void {
    this.log(message, LogLevel.ERROR);
  }
}
