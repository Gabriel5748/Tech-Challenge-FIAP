import { IExemploRepository } from "../../src/domain/interfaces/IExemploRepository";

export class BuscarExemplo {
  constructor(private repository: IExemploRepository) {}
  async execute(nome: string) {
    const nomeFormatado = nome.trim();

    if (!nomeFormatado) {
      throw new Error("Nome obrigatório");
    }

    return this.repository.buscar(nomeFormatado);
  }
}
