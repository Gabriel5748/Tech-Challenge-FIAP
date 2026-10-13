import { BuscarExemplo } from "../application/use-cases/BuscarExemplo";
import { CadastrarExemplo } from "../application/use-cases/CadastrarExemplo";
import { ExemploRepository } from "../infrastructure/repositories/ExemploRepository";
import { ExemploController } from "../interfaces/http/controllers/exemploController";

const repository = new ExemploRepository();

const cadastrarExemplo = new CadastrarExemplo(repository);
const buscarExemplo = new BuscarExemplo(repository);

export const exemploController = new ExemploController(
  cadastrarExemplo,
  buscarExemplo,
);
