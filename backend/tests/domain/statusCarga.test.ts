import { describe, expect, it } from "vitest";
import {
  ESTADOS_TERMINAIS,
  STATUS_PERMITIDOS,
  normalizarStatusCarga,
  possuiDocumentacaoObrigatoriaValida,
  validarTransicaoDeStatus,
  type StatusCarga,
} from "../../src/domain/entities/statusCarga";

/**
 * Tabela de transições copiada do enunciado (Fase 2, seção 4), escrita de forma
 * independente da implementação. Se alguém alterar o domínio sem querer, a
 * matriz abaixo acusa a diferença.
 */
const PERMITIDAS: Record<StatusCarga, StatusCarga[]> = {
  Registrada: ["Em análise", "Cancelada"],
  "Em análise": ["Em inspeção", "Cancelada"],
  "Em inspeção": ["Liberada", "Bloqueada", "Cancelada"],
  Liberada: ["Em movimentação", "Cancelada"],
  Bloqueada: ["Cancelada"],
  "Em movimentação": ["Finalizada"],
  Finalizada: [],
  Cancelada: [],
};

describe("validarTransicaoDeStatus", () => {
  describe("matriz completa de transições (8 x 8)", () => {
    for (const de of STATUS_PERMITIDOS) {
      for (const para of STATUS_PERMITIDOS) {
        const permitida = PERMITIDAS[de].includes(para);

        it(`${de} → ${para} é ${permitida ? "permitida" : "proibida"}`, () => {
          if (permitida) {
            expect(validarTransicaoDeStatus(de, para)).toBe(para);
          } else {
            expect(() => validarTransicaoDeStatus(de, para)).toThrow();
          }
        });
      }
    }
  });

  describe("transições proibidas citadas no enunciado", () => {
    it("Cancelada → Liberada: estado terminal", () => {
      expect(() => validarTransicaoDeStatus("Cancelada", "Liberada")).toThrow(
        /estado terminal/,
      );
    });

    it("Finalizada → Em movimentação: estado terminal", () => {
      expect(() =>
        validarTransicaoDeStatus("Finalizada", "Em movimentação"),
      ).toThrow(/estado terminal/);
    });

    it("Bloqueada → Em movimentação: carga bloqueada não entra em movimentação", () => {
      expect(() =>
        validarTransicaoDeStatus("Bloqueada", "Em movimentação"),
      ).toThrow(/bloqueada não pode entrar em movimentação/);
    });

    it("Registrada → Finalizada: transição inválida", () => {
      expect(() =>
        validarTransicaoDeStatus("Registrada", "Finalizada"),
      ).toThrow(/Transição de status inválida/);
    });

    it("Em inspeção → Finalizada: exige passar por Liberada", () => {
      expect(() =>
        validarTransicaoDeStatus("Em inspeção", "Finalizada"),
      ).toThrow(/sem antes ser liberada/);
    });

    it("Liberada → Registrada: transição inválida", () => {
      expect(() =>
        validarTransicaoDeStatus("Liberada", "Registrada"),
      ).toThrow(/Transição de status inválida/);
    });
  });

  describe("estados terminais", () => {
    it.each(ESTADOS_TERMINAIS)(
      "%s não aceita nenhuma nova mudança de status",
      (terminal) => {
        for (const destino of STATUS_PERMITIDOS) {
          expect(() => validarTransicaoDeStatus(terminal, destino)).toThrow(
            /estado terminal/,
          );
        }
      },
    );
  });

  describe("normalização da entrada", () => {
    it("aceita status sem acento e em minúsculas e devolve o nome oficial", () => {
      expect(validarTransicaoDeStatus("registrada", "em analise")).toBe(
        "Em análise",
      );
      expect(validarTransicaoDeStatus("em inspecao", "liberada")).toBe(
        "Liberada",
      );
    });

    it("trata o status legado 'pendente' como Registrada", () => {
      expect(validarTransicaoDeStatus("pendente", "Em análise")).toBe(
        "Em análise",
      );
    });

    it("rejeita status de destino inexistente e lista os permitidos", () => {
      expect(() => validarTransicaoDeStatus("Registrada", "xpto")).toThrow(
        /Status inválido: "xpto"/,
      );
      expect(() => validarTransicaoDeStatus("Registrada", "")).toThrow(
        /Status inválido/,
      );
    });
  });
});

describe("normalizarStatusCarga", () => {
  it.each([
    ["pendente", "Registrada"],
    ["registrado", "Registrada"],
    ["liberado", "Liberada"],
    ["em movimentacao", "Em movimentação"],
    ["FINALIZADA", "Finalizada"],
    ["  Bloqueado  ", "Bloqueada"],
    ["cancelado", "Cancelada"],
  ])("'%s' vira '%s'", (entrada, esperado) => {
    expect(normalizarStatusCarga(entrada)).toBe(esperado);
  });

  it.each([[undefined], [""], ["   "], ["inexistente"], [123 as any]])(
    "devolve null para entrada inválida (%s)",
    (entrada) => {
      expect(normalizarStatusCarga(entrada as any)).toBeNull();
    },
  );
});

describe("possuiDocumentacaoObrigatoriaValida", () => {
  it.each([[undefined], [null], [[]], [""], ["   "], [{}], [42]])(
    "é inválida quando não há documentação (%j)",
    (doc) => {
      expect(possuiDocumentacaoObrigatoriaValida(doc)).toBe(false);
    },
  );

  it("é válida quando todos os documentos estão validados", () => {
    expect(
      possuiDocumentacaoObrigatoriaValida([
        { tipo: "FICHA", status: "validado" },
        { tipo: "LAUDO", status: "validado" },
      ]),
    ).toBe(true);
  });

  it.each(["pendente", "anexado"])(
    "é inválida se existir documento com status '%s'",
    (status) => {
      expect(
        possuiDocumentacaoObrigatoriaValida([
          { tipo: "FICHA", status: "validado" },
          { tipo: "LAUDO", status },
        ]),
      ).toBe(false);
    },
  );

  it("aceita lista de textos preenchidos e rejeita texto vazio na lista", () => {
    expect(possuiDocumentacaoObrigatoriaValida(["ficha.pdf"])).toBe(true);
    expect(possuiDocumentacaoObrigatoriaValida(["ficha.pdf", "  "])).toBe(
      false,
    );
  });

  it("aceita texto ou objeto preenchido", () => {
    expect(possuiDocumentacaoObrigatoriaValida("ficha.pdf")).toBe(true);
    expect(possuiDocumentacaoObrigatoriaValida({ ficha: "ok" })).toBe(true);
  });
});
