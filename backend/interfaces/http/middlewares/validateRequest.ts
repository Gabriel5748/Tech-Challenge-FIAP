import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

interface RequestValidationSchema {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
}

export function validateRequest(schemas: RequestValidationSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          erro: "Dados de requisição inválidos",
          detalhes: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", "),
        });
      }
      return res.status(400).json({
        erro: "Falha na validação da requisição",
      });
    }
  };
}
