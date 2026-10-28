"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenApiDocument = generateOpenApiDocument;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const registry_1 = require("./registry");
const routes_1 = require("./routes");
const settings_1 = require("../settings");
let cachedDocument = null;
function generateOpenApiDocument() {
    if (cachedDocument) {
        return cachedDocument;
    }
    (0, routes_1.registerAllRoutesDoc)();
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry_1.registry.definitions);
    cachedDocument = generator.generateDocument({
        openapi: "3.0.0",
        info: {
            title: "QuimiPort API",
            version: "1.0.0",
            description: "Documentação oficial da API QuimiPort gerada automaticamente a partir de schemas Zod e OpenAPI.",
            contact: {
                name: "Equipe QuimiPort",
            },
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        servers: [
            {
                url: `http://${settings_1.settings.app.host || "localhost"}:${settings_1.settings.app.port || 3000}`,
                description: "Servidor local de desenvolvimento",
            },
            {
                url: "/",
                description: "Caminho relativo (Host atual)",
            },
        ],
        tags: [
            {
                name: "Geral",
                description: "Status e informações gerais da API",
            },
            {
                name: "Usuários",
                description: "Gerenciamento e controle de usuários e grupos",
            },
            {
                name: "Cargas Químicas",
                description: "Gerenciamento e controle de fluxo de cargas químicas",
            },
            {
                name: "Produtos Químicos",
                description: "Catálogo e manutenção de produtos químicos",
            },
        ],
    });
    return cachedDocument;
}
__exportStar(require("./registry"), exports);
__exportStar(require("./schemas"), exports);
