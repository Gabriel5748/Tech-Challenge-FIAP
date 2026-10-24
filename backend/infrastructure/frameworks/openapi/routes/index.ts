import { registerGeralRoutesDoc } from "./geral.routes.doc";
import { registerUsuarioRoutesDoc } from "./usuario.routes.doc";
import { registerCargaQuimicaRoutesDoc } from "./cargaQuimica.routes.doc";
import { registerProdutoQuimicoRoutesDoc } from "./produtoQuimico.routes.doc";

export function registerAllRoutesDoc() {
  registerGeralRoutesDoc();
  registerUsuarioRoutesDoc();
  registerCargaQuimicaRoutesDoc();
  registerProdutoQuimicoRoutesDoc();
}
