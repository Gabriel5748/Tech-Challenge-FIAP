import { IExemploRepository } from "../../src/domain/interfaces/IExemploRepository";

export class CadastrarExemplo {
  constructor(private repository: IExemploRepository) {}
  async execute(nome: string, idade: number) {
    const nomeFormatado = nome.trim();

    if (!nomeFormatado) {
      throw new Error("Nome obrigatório");
    }

    return this.repository.salvar(nomeFormatado, idade);
  }
}
