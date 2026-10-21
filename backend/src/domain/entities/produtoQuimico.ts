export class ProdutoQuimico {
  constructor(
    public identificador: number,
    public nome: string,
    public descricao: string,
    public numeroONU: string,
    public classeRisco: string,
    public grupoCompatibilidade: string,
    public status: "ativo" | "inativo",
    public dataCriacao: Date,
    public dataAtualizacao: Date,
  ) {}
}
