"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenApiDocumentation = void 0;
const openapi_1 = require("./openapi");
exports.getOpenApiDocumentation = openapi_1.generateOpenApiDocument;
exports.default = (0, openapi_1.generateOpenApiDocument)();
