"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.produtoQuimicoController = exports.cargaQuimicaController = exports.atribuirUsuarioGrupoUseCase = exports.grupoRepository = exports.usuarioRepository = void 0;
const atualizarStatusDaCarga_1 = require("../application/use-cases/cargaQuimica/atualizarStatusDaCarga");
const buscarCargaQuimicaPorIdentificador_1 = require("../application/use-cases/cargaQuimica/buscarCargaQuimicaPorIdentificador");
const registrarCargaQuimica_1 = require("../application/use-cases/cargaQuimica/registrarCargaQuimica");
const atualizarProdutoQuimico_1 = require("../application/use-cases/produtoQuimico/atualizarProdutoQuimico");
const buscarProdutoQuimicoPorIdentificador_1 = require("../application/use-cases/produtoQuimico/buscarProdutoQuimicoPorIdentificador");
const cadastrarProdutoQuimico_1 = require("../application/use-cases/produtoQuimico/cadastrarProdutoQuimico");
const inativarProdutoQuimico_1 = require("../application/use-cases/produtoQuimico/inativarProdutoQuimico");
const listarProdutoQuimico_1 = require("../application/use-cases/produtoQuimico/listarProdutoQuimico");
const cargaQuimicaRepository_1 = require("../infrastructure/repositories/cargaQuimica/cargaQuimicaRepository");
const produtoQuimicoRepository_1 = require("../infrastructure/repositories/produtoQuimico/produtoQuimicoRepository");
const cargaQuimicaController_1 = require("../interfaces/http/controllers/cargaQuimica/cargaQuimicaController");
const produtoQuimicoController_1 = require("../interfaces/http/controllers/produtoQuimico/produtoQuimicoController");
// Users & Grupos
const AtribuirUsuarioGrupo_1 = require("../application/use-cases/AtribuirUsuarioGrupo");
const bloquearCargaQuimica_1 = require("../application/use-cases/cargaQuimica/bloquearCargaQuimica");
const cancelarCargaQuimica_1 = require("../application/use-cases/cargaQuimica/cancelarCargaQuimica");
const liberarCargaQuimica_1 = require("../application/use-cases/cargaQuimica/liberarCargaQuimica");
const grupoRepository_1 = require("../infrastructure/repositories/grupoRepository");
const usuarioRepository_1 = require("../infrastructure/repositories/usuarioRepository");
const userController_1 = require("../interfaces/http/controllers/users/userController");
// Repositories
const cargaQuimicaRepository = new cargaQuimicaRepository_1.CargaQuimicaRepository();
const produtoQuimicoRepository = new produtoQuimicoRepository_1.ProdutoQuimicoRepository();
exports.usuarioRepository = new usuarioRepository_1.UsuarioRepository();
exports.grupoRepository = new grupoRepository_1.GrupoRepository();
// Use Cases
exports.atribuirUsuarioGrupoUseCase = new AtribuirUsuarioGrupo_1.AtribuirUsuarioGrupoUseCase(exports.usuarioRepository, exports.grupoRepository);
// Controllers
exports.cargaQuimicaController = new cargaQuimicaController_1.CargaQuimicaController(new registrarCargaQuimica_1.RegistrarCargaQuimica(cargaQuimicaRepository), new buscarCargaQuimicaPorIdentificador_1.BuscarCargaQuimicaPorIdentificador(cargaQuimicaRepository), new atualizarStatusDaCarga_1.AtualizarStatusDaCarga(cargaQuimicaRepository), new buscarCargaQuimicaPorIdentificador_1.BuscarCargaQuimicaPorIdentificador(cargaQuimicaRepository), new bloquearCargaQuimica_1.BloquearCargaQuimica(cargaQuimicaRepository), new liberarCargaQuimica_1.LiberarCargaQuimica(cargaQuimicaRepository), new cancelarCargaQuimica_1.CancelarCargaQuimica(cargaQuimicaRepository));
exports.produtoQuimicoController = new produtoQuimicoController_1.ProdutoQuimicoController(new cadastrarProdutoQuimico_1.CadastrarProdutoQuimico(produtoQuimicoRepository), new buscarProdutoQuimicoPorIdentificador_1.BuscarProdutoQuimicoPorIdentificador(produtoQuimicoRepository), new listarProdutoQuimico_1.ListarProdutosQuimicos(produtoQuimicoRepository), new atualizarProdutoQuimico_1.AtualizarProdutoQuimico(produtoQuimicoRepository), new inativarProdutoQuimico_1.InativarProdutoQuimico(produtoQuimicoRepository));
exports.userController = new userController_1.UserController(exports.usuarioRepository, exports.grupoRepository, exports.atribuirUsuarioGrupoUseCase);
