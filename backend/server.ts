import cors from "cors";
import express from "express";
import swaggerUI from "swagger-ui-express";

import { generateOpenApiDocument } from "./infrastructure/frameworks/openapi";
import { settings } from "./infrastructure/frameworks/settings";
import { logger } from "./infrastructure/logger";

import errorHandler from "./interfaces/http/middlewares/errorHandler";
import httpLogger from "./interfaces/http/middlewares/httpLogger";
import cargaQuimicaRouter from "./interfaces/http/routers/cargaQuimica/cargaQuimicaRoute";
import produtoQuimicoRouter from "./interfaces/http/routers/produtoQuimico/produtoQuimicoRoute";
import routerUser from "./interfaces/http/routers/users/users";

const app = express();

const openApiDoc = generateOpenApiDocument();

// 1. Logger de requisições HTTP (pino-http)
app.use(httpLogger);

// 2. CORS
app.use(
  cors({
    origin: settings.app.allowedHosts,
  }),
);

// 3. Parser JSON
app.use(express.json());

// Documentação Swagger UI
app.use(
  "/api/docs",
  swaggerUI.serve,
  swaggerUI.setup(openApiDoc, {
    customSiteTitle: "QuimiPort - Documentação da API",
  }),
);

app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openApiDoc);
});

app.get("/", (_req, res) => {
  res.json({
    message: "Bem-vindo à API do QuimiPort!",
    status: "online",
    ambiente: settings.app.nodeEnv,
    documentacao: "/api/docs",
  });
});

// Rotas da aplicação
app.use("/api/usuarios", routerUser);
app.use("/api/cargas", cargaQuimicaRouter);
app.use("/api/produtos-quimicos", produtoQuimicoRouter);

// Middleware global de tratamento e log de erros
app.use(errorHandler);

const server = app.listen(settings.app.port, settings.app.host, () => {
  logger.info(
    `Servidor rodando em http://${settings.app.host}:${settings.app.port}`,
  );
  logger.info(
    `Documentação Swagger: http://${settings.app.host}:${settings.app.port}/api/docs`,
  );
  logger.info(
    `Especificação JSON: http://${settings.app.host}:${settings.app.port}/api/docs.json`,
  );
});

// Captura de exceções e rejeições não tratadas no processo
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Exceção não tratada capturada (uncaughtException)!");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(
    { reason },
    "Promessa rejeitada não tratada (unhandledRejection)!",
  );
});

export default app;
