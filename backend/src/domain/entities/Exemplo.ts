export class Exemplo {
  constructor(
    public readonly nome: string,
    public readonly idade: number,
  ) {
    if (!nome.trim()) {
      throw new Error("Nome obrigatório");
    }

    if (!Number.isInteger(idade) || idade < 0 || idade > 120) {
      throw new Error("Idade inválida");
    }
  }
}
