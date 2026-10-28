export type StatusCarga =
  | "Registrada"
  | "Em análise"
  | "Em inspeção"
  | "Liberada"
  | "Bloqueada"
  | "Em movimentação"
  | "Finalizada"
  | "Cancelada";

export const STATUS_PERMITIDOS: StatusCarga[] = [
  "Registrada",
  "Em análise",
  "Em inspeção",
  "Liberada",
  "Bloqueada",
  "Em movimentação",
  "Finalizada",
  "Cancelada",
];

export const ESTADOS_TERMINAIS: StatusCarga[] = ["Finalizada", "Cancelada"];

const TRANSICOES_PERMITIDAS: Record<StatusCarga, StatusCarga[]> = {
  "Registrada": ["Em análise", "Cancelada"],
  "Em análise": ["Em inspeção", "Cancelada"],
  "Em inspeção": ["Liberada", "Bloqueada", "Cancelada"],
  "Liberada": ["Em movimentação", "Cancelada"],
  "Bloqueada": ["Cancelada"],
  "Em movimentação": ["Finalizada"],
  "Finalizada": [],
  "Cancelada": [],
};

const MAPA_NORMALIZACAO: Record<string, StatusCarga> = {
  "registrada": "Registrada",
  "registrado": "Registrada",
  "pendente": "Registrada",
  "em analise": "Em análise",
  "em análise": "Em análise",
  "em inspecao": "Em inspeção",
  "em inspeção": "Em inspeção",
  "liberada": "Liberada",
  "liberado": "Liberada",
  "bloqueada": "Bloqueada",
  "bloqueado": "Bloqueada",
  "em movimentacao": "Em movimentação",
  "em movimentação": "Em movimentação",
  "finalizada": "Finalizada",
  "finalizado": "Finalizada",
  "cancelada": "Cancelada",
  "cancelado": "Cancelada",
};

export function normalizarStatusCarga(status?: string): StatusCarga | null {
  if (!status || typeof status !== "string") {
    return null;
  }
  const chave = status.trim().toLowerCase();
  return MAPA_NORMALIZACAO[chave] || null;
}

export function validarTransicaoDeStatus(statusAtualRaw: string, novoStatusRaw: string): StatusCarga {
  const statusAtual = normalizarStatusCarga(statusAtualRaw) || "Registrada";
  const novoStatus = normalizarStatusCarga(novoStatusRaw);

  if (!novoStatus) {
    throw new Error(
      `Status inválido: "${novoStatusRaw}". Status permitidos: ${STATUS_PERMITIDOS.join(", ")}.`
    );
  }

  if (ESTADOS_TERMINAIS.includes(statusAtual)) {
    throw new Error(
      `Uma carga com status "${statusAtual}" é um estado terminal e não pode sofrer novas alterações de status.`
    );
  }

  if (statusAtual === "Bloqueada" && novoStatus === "Em movimentação") {
    throw new Error("Uma carga bloqueada não pode entrar em movimentação.");
  }

  if (statusAtual === "Em inspeção" && novoStatus === "Finalizada") {
    throw new Error("Uma carga em inspeção não pode ser finalizada sem antes ser liberada.");
  }

  const permitidos = TRANSICOES_PERMITIDAS[statusAtual] || [];
  if (!permitidos.includes(novoStatus)) {
    throw new Error(
      `Transição de status inválida: não é permitido mudar de "${statusAtual}" para "${novoStatus}". Transições permitidas a partir de "${statusAtual}": ${
        permitidos.length > 0 ? permitidos.join(", ") : "nenhuma"
      }.`
    );
  }

  return novoStatus;
}

export function possuiDocumentacaoObrigatoriaValida(documentacao: any): boolean {
  if (!documentacao) {
    return false;
  }

  if (Array.isArray(documentacao)) {
    if (documentacao.length === 0) {
      return false;
    }

    const temPendente = documentacao.some(
      (doc: any) =>
        (typeof doc === "object" && doc !== null && doc.status && doc.status !== "validado") ||
        (typeof doc === "string" && !doc.trim())
    );

    return !temPendente;
  }

  if (typeof documentacao === "string") {
    return documentacao.trim().length > 0;
  }

  if (typeof documentacao === "object") {
    return Object.keys(documentacao).length > 0;
  }

  return false;
}
