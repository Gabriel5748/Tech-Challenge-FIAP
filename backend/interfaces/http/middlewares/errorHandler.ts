import type { Request, Response, NextFunction } from 'express';
import { logger } from '../../../infrastructure/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const reqLogger = (req as any).log || logger;

  reqLogger.error(
    {
      err,
      method: req.method,
      url: req.originalUrl || req.url,
      params: req.params,
      query: req.query,
      body: req.body,
    },
    'Erro interno não tratado capturado pelo errorHandler global'
  );

  const statusCode = err.status || err.statusCode || 500;
  const mensagem = err.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    erro: mensagem,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

export default errorHandler;
