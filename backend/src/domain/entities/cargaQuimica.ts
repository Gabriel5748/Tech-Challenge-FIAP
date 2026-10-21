export class Carga {
  constructor(
    public identificador: number,
    public codigoCarga: string,
    public produtoQuimicoId: number,
    public quantidade: number,
    public unidadeMedida: string,
    public origem: string,
    public destino: string,
    public responsavelTecnico: string,
    public documentacaoObrigatoria: string[],
    public status: "pendente" | "em_transito" | "entregue" | "cancelada",
    public dataEntrada: Date,
    public dataCriacao: Date,
    public dataAtualizacao: Date,
  ) {}
}
