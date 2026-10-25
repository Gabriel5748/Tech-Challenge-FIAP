"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_1 = require("./infrastructure/frameworks/openapi");
const settings_1 = require("./infrastructure/frameworks/settings");
const cargaQuimicaRoute_1 = __importDefault(require("./interfaces/http/routers/cargaQuimica/cargaQuimicaRoute"));
const produtoQuimicoRoute_1 = __importDefault(require("./interfaces/http/routers/produtoQuimico/produtoQuimicoRoute"));
const users_1 = __importDefault(require("./interfaces/http/routers/users/users"));
const app = (0, express_1.default)();
const openApiDoc = (0, openapi_1.generateOpenApiDocument)();
// CORS
app.use((0, cors_1.default)({
    origin: settings_1.settings.app.allowedHosts,
}));
// Middleware
app.use(express_1.default.json());
// Documentação Swagger UI
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiDoc, {
    customSiteTitle: "QuimiPort - Documentação da API",
}));
app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(openApiDoc);
});
app.get("/", (_req, res) => {
    res.json({
        message: "Bem-vindo à API do QuimiPort!",
        status: "online",
        ambiente: settings_1.settings.app.nodeEnv,
        documentacao: "/api/docs",
    });
});
// Rotas da aplicação
app.use("/api/usuarios", users_1.default);
app.use("/api/cargas", cargaQuimicaRoute_1.default);
app.use("/api/produtos-quimicos", produtoQuimicoRoute_1.default);
app.listen(settings_1.settings.app.port, settings_1.settings.app.host, () => {
    console.log(`Servidor rodando em http://${settings_1.settings.app.host}:${settings_1.settings.app.port}`);
    console.log(`Documentação Swagger: http://${settings_1.settings.app.host}:${settings_1.settings.app.port}/api/docs`);
    console.log(`Especificação JSON: http://${settings_1.settings.app.host}:${settings_1.settings.app.port}/api/docs.json`);
});
