import { describe, expect, it } from "vitest";
import { AtualizarStatusDaCarga } from "../../application/use-cases/cargaQuimica/atualizarStatusDaCarga";
import { BloquearCargaQuimica } from "../../application/use-cases/cargaQuimica/bloquearCargaQuimica";
import { BuscarCargaQuimicaPorIdentificador } from "../../application/use-cases/cargaQuimica/buscarCargaQuimicaPorIdentificador";
import { CancelarCargaQuimica } from "../../application/use-cases/cargaQuimica/cancelarCargaQuimica";
import { LiberarCargaQuimica } from "../../application/use-cases/cargaQuimica/liberarCargaQuimica";
import { ListarCargaQuimica } from "../../application/use-cases/cargaQuimica/listarCargaQuimica";
import {
  DOC_PENDENTE,
  DOC_VALIDADO,
  cargaFake,
  criarCargaRepoFake,
} from "../helpers/fakes";

/** Repositório já contendo uma carga (id 10) no status informado. */
function repoCom(status: string, sobrescrever: Record<string, unknown> = {}) {
  return criarCargaRepoFake([cargaFake(status, sobrescrever)]);
}

describe("AtualizarStatusDaCarga", () => {
  it("atualiza o status quando a transição é permitida", async () => {
    const repo = repoCom("Registrada");

    await new AtualizarStatusDaCarga(repo as any).execute(10, "Em análise");

    expect(repo.atualizarStatus).toHaveBeenCalledWith(10, "Em análise");
  });

  it("normaliza o status informado antes de gravar", async () => {
    const repo = repoCom("Em análise");

    await new AtualizarStatusDaCarga(repo as any).execute(10, "em inspecao");

    expect(repo.atualizarStatus).toHaveBeenCalledWith(10, "Em inspeção");
  });

  it("entende o status legado 'pendente' como Registrada", async () => {
    const repo = repoCom("pendente");

    await new AtualizarStatusDaCarga(repo as any).execute(10, "Em análise");

    expect(repo.atualizarStatus).toHaveBeenCalledWith(10, "Em análise");
  });

  it("falha se a carga não existe", async () => {
    const repo = criarCargaRepoFake([]);

    await expect(
      new AtualizarStatusDaCarga(repo as any).execute(99, "Em análise"),
    ).rejects.toThrow(/Carga química não encontrada/);
    expect(repo.atualizarStatus).not.toHaveBeenCalled();
  });

  it("rejeita um status inexistente", async () => {
    const repo = repoCom("Registrada");

    await expect(
      new AtualizarStatusDaCarga(repo as any).execute(10, "xpto"),
    ).rejects.toThrow(/Status inválido/);
    expect(repo.atualizarStatus).not.toHaveBeenCalled();
  });

  describe("bloqueia transições proibidas", () => {
    it("carga bloqueada não pode entrar em movimentação", async () => {
      const repo = repoCom("Bloqueada");

      await expect(
        new AtualizarStatusDaCarga(repo as any).execute(10, "Em movimentação"),
      ).rejects.toThrow(/bloqueada não pode entrar em movimentação/);
      expect(repo.atualizarStatus).not.toHaveBeenCalled();
    });

    it("carga em inspeção não pode ser finalizada sem antes ser liberada", async () => {
      const repo = repoCom("Em inspeção");

      await expect(
        new AtualizarStatusDaCarga(repo as any).execute(10, "Finalizada"),
      ).rejects.toThrow(/sem antes ser liberada/);
      expect(repo.atualizarStatus).not.toHaveBeenCalled();
    });

    it("carga finalizada ou cancelada não sofre novas alterações", async () => {
      for (const terminal of ["Finalizada", "Cancelada"]) {
        const repo = repoCom(terminal);

        await expect(
          new AtualizarStatusDaCarga(repo as any).execute(10, "Registrada"),
        ).rejects.toThrow(/estado terminal/);
        expect(repo.atualizarStatus).not.toHaveBeenCalled();
      }
    });

    it("Liberada → Registrada é inválida", async () => {
      const repo = repoCom("Liberada");

      await expect(
        new AtualizarStatusDaCarga(repo as any).execute(10, "Registrada"),
      ).rejects.toThrow(/Transição de status inválida/);
    });
  });

  describe("liberação por esta rota também exige documentação", () => {
    it("bloqueia a liberação com documentação pendente", async () => {
      const repo = repoCom("Em inspeção", {
        documentacaoObrigatoria: [DOC_VALIDADO, DOC_PENDENTE],
      });

      await expect(
        new AtualizarStatusDaCarga(repo as any).execute(10, "Liberada"),
      ).rejects.toThrow(/sem documentação obrigatória/);
      expect(repo.atualizarStatus).not.toHaveBeenCalled();
    });

    it("bloqueia a liberação sem nenhuma documentação", async () => {
      const repo = repoCom("Em inspeção", { documentacaoObrigatoria: [] });

      await expect(
        new AtualizarStatusDaCarga(repo as any).execute(10, "Liberada"),
      ).rejects.toThrow(/sem documentação obrigatória/);
    });

    it("libera quando a documentação está validada", async () => {
      const repo = repoCom("Em inspeção");

      await new AtualizarStatusDaCarga(repo as any).execute(10, "Liberada");

      expect(repo.atualizarStatus).toHaveBeenCalledWith(10, "Liberada");
    });
  });
});

describe("LiberarCargaQuimica", () => {
  it("libera carga em inspeção com documentação válida", async () => {
    const repo = repoCom("Em inspeção");

    const resultado = await new LiberarCargaQuimica(repo as any).execute(10);

    expect(repo.liberar).toHaveBeenCalledWith(10);
    expect(resultado).toEqual([{ identificador: 10, status: "Liberada" }]);
  });

  it("não libera sem documentação obrigatória", async () => {
    const repo = repoCom("Em inspeção", { documentacaoObrigatoria: [] });

    await expect(
      new LiberarCargaQuimica(repo as any).execute(10),
    ).rejects.toThrow(/sem documentação obrigatória/);
    expect(repo.liberar).not.toHaveBeenCalled();
  });

  it("não libera com documento pendente ou apenas anexado", async () => {
    for (const status of ["pendente", "anexado"]) {
      const repo = repoCom("Em inspeção", {
        documentacaoObrigatoria: [{ tipo: "LAUDO", status }],
      });

      await expect(
        new LiberarCargaQuimica(repo as any).execute(10),
      ).rejects.toThrow(/sem documentação obrigatória/);
      expect(repo.liberar).not.toHaveBeenCalled();
    }
  });

  it("carga cancelada não pode ser liberada", async () => {
    const repo = repoCom("Cancelada");

    await expect(
      new LiberarCargaQuimica(repo as any).execute(10),
    ).rejects.toThrow(/estado terminal/);
    expect(repo.liberar).not.toHaveBeenCalled();
  });

  it.each([["Registrada"], ["Em análise"], ["Bloqueada"], ["Liberada"]])(
    "não libera carga que está em '%s'",
    async (status) => {
      const repo = repoCom(status);

      await expect(
        new LiberarCargaQuimica(repo as any).execute(10),
      ).rejects.toThrow(/Transição de status inválida/);
      expect(repo.liberar).not.toHaveBeenCalled();
    },
  );

  it("falha se a carga não existe", async () => {
    const repo = criarCargaRepoFake([]);

    await expect(
      new LiberarCargaQuimica(repo as any).execute(99),
    ).rejects.toThrow(/Carga química não encontrada/);
  });
});

describe("BloquearCargaQuimica", () => {
  it("bloqueia carga que está em inspeção", async () => {
    const repo = repoCom("Em inspeção");

    const resultado = await new BloquearCargaQuimica(repo as any).execute(10);

    expect(repo.bloquear).toHaveBeenCalledWith(10);
    expect(resultado).toEqual([{ identificador: 10, status: "Bloqueada" }]);
  });

  it.each([["Registrada"], ["Em análise"], ["Liberada"], ["Bloqueada"]])(
    "não bloqueia carga que está em '%s'",
    async (status) => {
      const repo = repoCom(status);

      await expect(
        new BloquearCargaQuimica(repo as any).execute(10),
      ).rejects.toThrow(/Transição de status inválida/);
      expect(repo.bloquear).not.toHaveBeenCalled();
    },
  );

  it("não bloqueia carga em estado terminal", async () => {
    const repo = repoCom("Cancelada");

    await expect(
      new BloquearCargaQuimica(repo as any).execute(10),
    ).rejects.toThrow(/estado terminal/);
    expect(repo.bloquear).not.toHaveBeenCalled();
  });

  it("falha se a carga não existe", async () => {
    const repo = criarCargaRepoFake([]);

    await expect(
      new BloquearCargaQuimica(repo as any).execute(99),
    ).rejects.toThrow(/Carga química não encontrada/);
  });
});

describe("CancelarCargaQuimica", () => {
  it.each([
    ["Registrada"],
    ["Em análise"],
    ["Em inspeção"],
    ["Liberada"],
    ["Bloqueada"],
  ])("cancela carga que está em '%s'", async (status) => {
    const repo = repoCom(status);

    const resultado = await new CancelarCargaQuimica(repo as any).execute(10);

    expect(repo.cancelar).toHaveBeenCalledWith(10);
    expect(resultado).toEqual([{ identificador: 10, status: "Cancelada" }]);
  });

  it("não cancela carga que já está em movimentação", async () => {
    const repo = repoCom("Em movimentação");

    await expect(
      new CancelarCargaQuimica(repo as any).execute(10),
    ).rejects.toThrow(/Transição de status inválida/);
    expect(repo.cancelar).not.toHaveBeenCalled();
  });

  it.each([["Finalizada"], ["Cancelada"]])(
    "não cancela carga em estado terminal (%s)",
    async (status) => {
      const repo = repoCom(status);

      await expect(
        new CancelarCargaQuimica(repo as any).execute(10),
      ).rejects.toThrow(/estado terminal/);
      expect(repo.cancelar).not.toHaveBeenCalled();
    },
  );

  it("falha se a carga não existe", async () => {
    const repo = criarCargaRepoFake([]);

    await expect(
      new CancelarCargaQuimica(repo as any).execute(99),
    ).rejects.toThrow(/Carga química não encontrada/);
  });
});

describe("BuscarCargaQuimicaPorIdentificador e ListarCargaQuimica", () => {
  it("busca pelo identificador (número ou texto)", async () => {
    const repo = repoCom("Registrada");
    const casoDeUso = new BuscarCargaQuimicaPorIdentificador(repo as any);

    expect(await casoDeUso.execute(10)).toHaveLength(1);
    expect(await casoDeUso.execute("10")).toHaveLength(1);
    expect(await casoDeUso.execute(99)).toHaveLength(0);
  });

  it("lista todas as cargas", async () => {
    const repo = criarCargaRepoFake([
      cargaFake("Registrada", { identificador: 1 }),
      cargaFake("Liberada", { identificador: 2 }),
    ]);

    const resultado = await new ListarCargaQuimica(repo as any).execute();

    expect(resultado).toHaveLength(2);
  });
});

describe("fluxo completo da carga (Registrada → Finalizada)", () => {
  it("percorre o fluxo principal passo a passo, respeitando a documentação", async () => {
    // Simula o repositório guardando o status entre as chamadas
    const carga = cargaFake("Registrada");
    const repo = criarCargaRepoFake([carga]);
    repo.atualizarStatus.mockImplementation(async (id: number, status: string) => {
      carga.status = status;
      return [{ identificador: id, status }];
    });
    const atualizar = new AtualizarStatusDaCarga(repo as any);

    for (const proximo of [
      "Em análise",
      "Em inspeção",
      "Liberada",
      "Em movimentação",
      "Finalizada",
    ]) {
      await atualizar.execute(10, proximo);
      expect(carga.status).toBe(proximo);
    }

    // Depois de finalizada, nada mais muda
    await expect(atualizar.execute(10, "Cancelada")).rejects.toThrow(
      /estado terminal/,
    );
  });
});
