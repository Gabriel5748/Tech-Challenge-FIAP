import { AtualizarStatusDaCarga } from "../application/use-cases/cargaQuimica/atualizarStatusDaCarga";
import { BuscarCargaQuimicaPorIdentificador } from "../application/use-cases/cargaQuimica/buscarCargaQuimicaPorIdentificador";
import { RegistrarCargaQuimica } from "../application/use-cases/cargaQuimica/registrarCargaQuimica";
import { AtualizarProdutoQuimico } from "../application/use-cases/produtoQuimico/atualizarProdutoQuimico";
import { BuscarProdutoQuimicoPorIdentificador } from "../application/use-cases/produtoQuimico/buscarProdutoQuimicoPorIdentificador";
import { CadastrarProdutoQuimico } from "../application/use-cases/produtoQuimico/cadastrarProdutoQuimico";
import { InativarProdutoQuimico } from "../application/use-cases/produtoQuimico/inativarProdutoQuimico";
import { ListarProdutosQuimicos } from "../application/use-cases/produtoQuimico/listarProdutoQuimico";
import { CargaQuimicaRepository } from "../infrastructure/repositories/cargaQuimica/cargaQuimicaRepository";
import { ProdutoQuimicoRepository } from "../infrastructure/repositories/produtoQuimico/produtoQuimicoRepository";
import { CargaQuimicaController } from "../interfaces/http/controllers/cargaQuimica/cargaQuimicaController";
import { ProdutoQuimicoController } from "../interfaces/http/controllers/produtoQuimico/produtoQuimicoController";

// Users & Grupos
import { AtribuirUsuarioGrupoUseCase } from "../application/use-cases/AtribuirUsuarioGrupo";
import { BloquearCargaQuimica } from "../application/use-cases/cargaQuimica/bloquearCargaQuimica";
import { CancelarCargaQuimica } from "../application/use-cases/cargaQuimica/cancelarCargaQuimica";
import { LiberarCargaQuimica } from "../application/use-cases/cargaQuimica/liberarCargaQuimica";
import { GrupoRepository } from "../infrastructure/repositories/grupoRepository";
import { UsuarioRepository } from "../infrastructure/repositories/usuarioRepository";
import { UserController } from "../interfaces/http/controllers/users/userController";

// Repositories
const cargaQuimicaRepository = new CargaQuimicaRepository();
const produtoQuimicoRepository = new ProdutoQuimicoRepository();
export const usuarioRepository = new UsuarioRepository();
export const grupoRepository = new GrupoRepository();

// Use Cases
export const atribuirUsuarioGrupoUseCase = new AtribuirUsuarioGrupoUseCase(
  usuarioRepository,
  grupoRepository,
);

// Controllers
export const cargaQuimicaController = new CargaQuimicaController(
  new RegistrarCargaQuimica(cargaQuimicaRepository, produtoQuimicoRepository),
  new BuscarCargaQuimicaPorIdentificador(cargaQuimicaRepository),
  new AtualizarStatusDaCarga(cargaQuimicaRepository),
  new BuscarCargaQuimicaPorIdentificador(cargaQuimicaRepository),
  new BloquearCargaQuimica(cargaQuimicaRepository),
  new LiberarCargaQuimica(cargaQuimicaRepository),
  new CancelarCargaQuimica(cargaQuimicaRepository),
);

export const produtoQuimicoController = new ProdutoQuimicoController(
  new CadastrarProdutoQuimico(produtoQuimicoRepository),
  new BuscarProdutoQuimicoPorIdentificador(produtoQuimicoRepository),
  new ListarProdutosQuimicos(produtoQuimicoRepository),
  new AtualizarProdutoQuimico(produtoQuimicoRepository),
  new InativarProdutoQuimico(produtoQuimicoRepository),
);

export const userController = new UserController(
  usuarioRepository,
  grupoRepository,
  atribuirUsuarioGrupoUseCase,
);
