import fs from 'fs';
import path from 'path';
import pino, { Logger, StreamEntry } from 'pino';
import pretty from 'pino-pretty';
import { settings } from '../frameworks/settings';

const logsDir = path.isAbsolute(settings.logger.dir)
  ? settings.logger.dir
  : path.resolve(process.cwd(), settings.logger.dir);

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isProduction = settings.app.nodeEnv === 'production';
const logLevel = settings.logger.level;

const consoleStream = isProduction
  ? process.stdout
  : pretty({
      colorize: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname,env',
    });

const appLogStream = fs.createWriteStream(path.join(logsDir, 'app.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });

const streams: StreamEntry[] = [
  { stream: consoleStream, level: logLevel as pino.Level },
  { stream: appLogStream, level: logLevel as pino.Level },
  { stream: errorLogStream, level: 'error' },
];

export const logger: Logger = pino(
  {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        '*.password',
        '*.senha',
        '*.token',
        '*.secret',
      ],
      censor: '[OCULTO]',
    },
  },
  pino.multistream(streams)
);

export default logger;