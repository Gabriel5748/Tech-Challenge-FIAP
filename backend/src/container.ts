import { AtualizarStatusDaCarga } from "../application/use-cases/cargaQuimica/atualizarStatusDaCarga";
import { BuscarCargaQuimicaPorIdentificador } from "../application/use-cases/cargaQuimica/buscarCargaQuimicaPorIdentificador";
import { RegistrarCargaQuimica } from "../application/use-cases/cargaQuimica/registrarCargaQuimica";
import { CargaQuimicaRepository } from "../infrastructure/repositories/cargaQuimica/cargaQuimicaRepository";
import { AtualizarProdutoQuimico } from "../application/use-cases/produtoQuimico/atualizarProdutoQuimico";
import { BuscarProdutoQuimicoPorIdentificador } from "../application/use-cases/produtoQuimico/buscarProdutoQuimicoPorIdentificador";
import { CadastrarProdutoQuimico } from "../application/use-cases/produtoQuimico/cadastrarProdutoQuimico";
import { InativarProdutoQuimico } from "../application/use-cases/produtoQuimico/inativarProdutoQuimico";
import { ListarProdutosQuimicos } from "../application/use-cases/produtoQuimico/listarProdutoQuimico";
import { ProdutoQuimicoRepository } from "../infrastructure/repositories/produtoQuimico/produtoQuimicoRepository";
import { CargaQuimicaController } from "../interfaces/http/controllers/cargaQuimica/cargaQuimicaController";
import { ProdutoQuimicoController } from "../interfaces/http/controllers/produtoQuimico/produtoQuimicoController";

const cargaQuimicaRepository = new CargaQuimicaRepository();

export const cargaQuimicaController = new CargaQuimicaController(
  new RegistrarCargaQuimica(cargaQuimicaRepository),
  new BuscarCargaQuimicaPorIdentificador(cargaQuimicaRepository),
  new AtualizarStatusDaCarga(cargaQuimicaRepository),
);

const produtoQuimicoRepository = new ProdutoQuimicoRepository();

export const produtoQuimicoController = new ProdutoQuimicoController(
  new CadastrarProdutoQuimico(produtoQuimicoRepository),
  new BuscarProdutoQuimicoPorIdentificador(produtoQuimicoRepository),
  new ListarProdutosQuimicos(produtoQuimicoRepository),
  new AtualizarProdutoQuimico(produtoQuimicoRepository),
  new InativarProdutoQuimico(produtoQuimicoRepository),
);
