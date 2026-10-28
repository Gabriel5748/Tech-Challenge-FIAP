"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllRoutesDoc = registerAllRoutesDoc;
const geral_routes_doc_1 = require("./geral.routes.doc");
const usuario_routes_doc_1 = require("./usuario.routes.doc");
const cargaQuimica_routes_doc_1 = require("./cargaQuimica.routes.doc");
const produtoQuimico_routes_doc_1 = require("./produtoQuimico.routes.doc");
function registerAllRoutesDoc() {
    (0, geral_routes_doc_1.registerGeralRoutesDoc)();
    (0, usuario_routes_doc_1.registerUsuarioRoutesDoc)();
    (0, cargaQuimica_routes_doc_1.registerCargaQuimicaRoutesDoc)();
    (0, produtoQuimico_routes_doc_1.registerProdutoQuimicoRoutesDoc)();
}
