export type StatusCarga = "pendente" | "bloqueado" | "liberado" | "cancelado";

export class Carga {
  constructor(
    public identificador: number,
    public nome: string,
    public formula: string,
    public produtoQuimicoId?: number,
    public quantidade?: number,
    public unidadeMedida?: string,
    public origem?: string,
    public destino?: string,
    public responsavelTecnico?: string,
    public documentacaoObrigatoria: any[] = [],
    public status: StatusCarga = "pendente",
    public dataEntrada: Date = new Date(),
  ) {
    // Regra 4.8: Quantidade da carga deve ser registrada com valor maior que zero
    if (quantidade !== undefined && quantidade <= 0) {
      throw new Error("Quantidade da carga deve ser registrada com valor maior que zero (Regra 4.8).");
    }
  }

  // Regra 4.20: Carga cancelada não pode ser liberada
  // Regra 4.4: Documentação obrigatória não pode estar pendente
  public validarParaLiberacao(): void {
    if (this.status === "cancelado") {
      throw new Error("Carga cancelada não pode ser liberada (Regra 4.20).");
    }

    if (this.documentacaoObrigatoria && this.documentacaoObrigatoria.length > 0) {
      const temPendente = this.documentacaoObrigatoria.some(
        (doc) => typeof doc === "object" && doc.status && doc.status !== "validado"
      );
      if (temPendente) {
        throw new Error(
          "Uma carga não pode ser liberada enquanto houver documentação obrigatória pendente ou não validada (Regra 4.4)."
        );
      }
    }
  }

  public bloquear(): void {
    if (this.status === "cancelado") {
      throw new Error("Carga cancelada não pode ser bloqueada.");
    }
    this.status = "bloqueado";
  }

  public cancelar(): void {
    if (this.status === "cancelado") {
      throw new Error("Carga química já se encontra cancelada.");
    }
    this.status = "cancelado";
  }
}
