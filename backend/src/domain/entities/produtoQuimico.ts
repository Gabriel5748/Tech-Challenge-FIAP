export class ProdutoQuimico {
  constructor(
    public identificador: number,
    public nome: string,
    public formula?: string,
    public descricao?: string,
    public numeroONU?: string,
    public classeRisco?: string,
    public grupoCompatibilidade?: string,
    public ativo: boolean = true,
    public dataCriacao: Date = new Date(),
    public dataAtualizacao: Date = new Date(),
  ) {
    // Regra 4.14: Produto químico não pode ser cadastrado sem nome
    if (!nome || nome.trim() === "") {
      throw new Error("Produto químico não pode ser cadastrado sem nome (Regra 4.14).");
    }
  }

  // Regra 4.16: Se produto químico estiver inativo, não pode ser associado a novas cargas
  public podeSerAssociado(): boolean {
    return this.ativo;
  }

  public inativar(): void {
    this.ativo = false;
    this.dataAtualizacao = new Date();
  }
}
