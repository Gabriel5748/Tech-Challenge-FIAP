import { vi } from "vitest";

/**
 * Repositório de produtos químicos em memória.
 * Implementa só os métodos que os casos de uso chamam, todos como mocks (vi.fn),
 * para os testes verificarem se o repositório foi (ou não) acionado.
 */
export function criarProdutoRepoFake(produtos: any[] = []) {
  return {
    criar: vi.fn(async (dados: any) => ({ identificador: 1, ...dados })),
    listar: vi.fn(async () => produtos),
    buscarPorIdentificador: vi.fn(async (id: number) =>
      produtos.filter((p) => p.identificador === id),
    ),
    atualizar: vi.fn(async (dados: any, id: number) => [
      { identificador: id, ...dados },
    ]),
    inativar: vi.fn(async (id: number) => [{ identificador: id, ativo: false }]),
  };
}

/** Repositório de cargas químicas em memória (mesma ideia do de produtos). */
export function criarCargaRepoFake(cargas: any[] = []) {
  return {
    registrar: vi.fn(async (dados: any) => ({ identificador: 1, ...dados })),
    listar: vi.fn(async () => cargas),
    buscarPorIdentificador: vi.fn(async (id: number | string) =>
      cargas.filter((c) => c.identificador === Number(id)),
    ),
    atualizarStatus: vi.fn(async (id: number, status: string) => [
      { identificador: id, status },
    ]),
    bloquear: vi.fn(async (id: number) => [
      { identificador: id, status: "Bloqueada" },
    ]),
    liberar: vi.fn(async (id: number) => [
      { identificador: id, status: "Liberada" },
    ]),
    cancelar: vi.fn(async (id: number) => [
      { identificador: id, status: "Cancelada" },
    ]),
  };
}

export const DOC_VALIDADO = { tipo: "FICHA_DE_SEGURANCA", status: "validado" };
export const DOC_PENDENTE = {
  tipo: "AUTORIZACAO_DE_TRANSPORTE",
  status: "pendente",
};

/** Produto químico ativo, como o repositório devolveria. */
export function produtoFake(sobrescrever: Record<string, unknown> = {}) {
  return {
    identificador: 1,
    nome: "Ácido Sulfúrico",
    formula: "H2SO4",
    classeRisco: "CLASSE_8_CORROSIVOS",
    ativo: true,
    ...sobrescrever,
  };
}

/** Carga química no status informado, com documentação validada por padrão. */
export function cargaFake(
  status: string,
  sobrescrever: Record<string, unknown> = {},
) {
  return {
    identificador: 10,
    codigo: "CQ-2026-0001",
    produtoQuimicoId: 1,
    quantidade: 500,
    unidadeMedida: "L",
    responsavelTecnico: "Maria Souza",
    documentacaoObrigatoria: [DOC_VALIDADO],
    status,
    ...sobrescrever,
  };
}
