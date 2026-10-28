import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { registerAllRoutesDoc } from "./routes";
import { settings } from "../settings";

let cachedDocument: any = null;

export function generateOpenApiDocument() {
  if (cachedDocument) {
    return cachedDocument;
  }

  registerAllRoutesDoc();

  const generator = new OpenApiGeneratorV3(registry.definitions);

  cachedDocument = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "QuimiPort API",
      version: "1.0.0",
      description:
        "Documentação oficial da API QuimiPort gerada automaticamente a partir de schemas Zod e OpenAPI.",
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
        url: `http://${settings.app.host || "localhost"}:${settings.app.port || 3000}`,
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
        description: "Gerenciamento e controle de usuários",
      },
      {
        name: "Grupos",
        description: "Gerenciamento de grupos de acesso e permissões",
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

export * from "./registry";
export * from "./schemas";
