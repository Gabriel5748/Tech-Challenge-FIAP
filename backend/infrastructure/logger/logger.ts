import fs from 'fs';
import path from 'path';
import pino, { Logger, StreamEntry } from 'pino';
import pretty from 'pino-pretty';
import { settings } from '../frameworks/settings';

// Diretório de armazenamento dos logs
const logsDir = path.isAbsolute(settings.logger.dir)
  ? settings.logger.dir
  : path.resolve(process.cwd(), settings.logger.dir);

// Garante que a pasta de logs exista
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isProduction = settings.app.nodeEnv === 'production';
const logLevel = settings.logger.level;

// 1. Stream para o Console (formatado e colorido em desenvolvimento, JSON em produção)
const consoleStream = isProduction
  ? process.stdout
  : pretty({
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    });

// 2. Stream para todos os logs da aplicação (app.log)
const appLogStream = fs.createWriteStream(path.join(logsDir, 'app.log'), {
  flags: 'a',
});

// 3. Stream exclusivo para logs de erro (error.log)
const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), {
  flags: 'a',
});

// Configuração multi-stream do Pino
const streams: StreamEntry[] = [
  { stream: consoleStream, level: logLevel as pino.Level },
  { stream: appLogStream, level: logLevel as pino.Level },
  { stream: errorLogStream, level: 'error' },
];

export const logger: Logger = pino(
  {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      env: settings.app.nodeEnv,
    },
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'password',
        'senha',
        '*.password',
        '*.senha',
      ],
      censor: '[CONFIDENCIAL]',
    },
  },
  pino.multistream(streams)
);

export default logger;
