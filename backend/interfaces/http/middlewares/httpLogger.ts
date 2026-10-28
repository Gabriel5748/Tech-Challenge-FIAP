import crypto from 'crypto';
import pinoHttp from 'pino-http';
import { logger } from '../../../infrastructure/logger';

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const existingId = req.headers['x-request-id'] || req.headers['x-correlation-id'];
    if (typeof existingId === 'string' && existingId.trim()) {
      return existingId;
    }
    return crypto.randomUUID();
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} concluída com status ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} falhou com status ${res.statusCode} - ${err.message}`;
  },
  customReceivedMessage: (req) => {
    return `Requisição recebida: ${req.method} ${req.url}`;
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      remoteAddress: req.remoteAddress,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
        'x-request-id': req.headers['x-request-id'],
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: (err) => ({
      type: err.type || err.name,
      message: err.message,
      stack: err.stack,
    }),
  },
});

export default httpLogger;
