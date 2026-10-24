import cors from "cors";
import express from "express";
import swaggerUI from "swagger-ui-express";

import { generateOpenApiDocument } from "./infrastructure/frameworks/openapi";
import { settings } from "./infrastructure/frameworks/settings";

import cargaQuimicaRouter from "./interfaces/http/routers/cargaQuimica/cargaQuimicaRoute";
import produtoQuimicoRouter from "./interfaces/http/routers/produtoQuimico/produtoQuimicoRoute";
import routerUser from "./interfaces/http/routers/users/users";

const app = express();

const openApiDoc = generateOpenApiDocument();

// CORS
app.use(
  cors({
    origin: settings.app.allowedHosts,
  }),
);

// Middleware
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

app.listen(settings.app.port, settings.app.host, () => {
  console.log(
    `Servidor rodando em http://${settings.app.host}:${settings.app.port}`,
  );

  console.log(
    `Documentação Swagger: http://${settings.app.host}:${settings.app.port}/api/docs`,
  );
  console.log(
    `Especificação JSON: http://${settings.app.host}:${settings.app.port}/api/docs.json`,
  );
});
