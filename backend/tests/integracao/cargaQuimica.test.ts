import "../helpers/ambienteTeste";
import { afterAll, describe, expect, it } from "vitest";
import { sequelize } from "../../infrastructure/frameworks/database";
import {
  CARGAS,
  DOCUMENTACAO_PENDENTE,
  PRODUTOS,
  api,
  cargaValida,
  criarCarga,
  criarProduto,
  levarCargaAte,
} from "../helpers/api";

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/cargas-quimicas", () => {
  it("registra uma carga química com status inicial 'Registrada'", async () => {
    const produto = await criarProduto();

    const resposta = await api.post(CARGAS).send(cargaValida(produto.id));

    expect(resposta.status).toBe(201);
    expect(resposta.body.carga).toMatchObject({
      produtoQuimicoId: produto.id,
      responsavelTecnico: "Maria Souza",
      status: "Registrada",
    });
    expect(Number(resposta.body.carga.quantidade)).toBe(500);

    const consulta = await api.get(`${CARGAS}/${resposta.body.carga.id}`);
    expect(consulta.status).toBe(200);
    expect(consulta.body.produtoQuimico.id).toBe(produto.id);
  });

  it("bloqueia o registro de carga com produto químico inativo", async () => {
    const produto = await criarProduto();
    await api.patch(`${PRODUTOS}/${produto.id}/inativar`);

    const resposta = await api.post(CARGAS).send(cargaValida(produto.id));

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe(
      "Uma carga química não pode ser registrada com produto químico inativo.",
    );
  });

  it.each([0, -10])(
    "bloqueia o registro de carga com quantidade %i",
    async (quantidade) => {
      const produto = await criarProduto();

      const resposta = await api
        .post(CARGAS)
        .send(cargaValida(produto.id, { quantidade }));

      expect(resposta.status).toBe(400);
      expect(resposta.body.erro).toBe(
        "A quantidade da carga deve ser maior que zero.",
      );
    },
  );

  it("bloqueia o registro de carga com produto inexistente", async () => {
    const resposta = await api.post(CARGAS).send(cargaValida(999999));

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe(
      "Produto químico associado não encontrado no sistema.",
    );
  });

  it("bloqueia o registro de carga sem responsável técnico", async () => {
    const produto = await criarProduto();

    const resposta = await api
      .post(CARGAS)
      .send(cargaValida(produto.id, { responsavelTecnico: "" }));

    expect(resposta.status).toBe(400);
  });
});

describe("consulta de cargas", () => {
  it("lista as cargas registradas", async () => {
    const carga = await criarCarga();

    const resposta = await api.get(CARGAS);

    expect(resposta.status).toBe(200);
    expect(resposta.body.map((c: any) => c.id)).toContain(carga.id);
  });

  it("devolve 404 para carga inexistente", async () => {
    const resposta = await api.get(`${CARGAS}/999999`);

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toBe("Carga química não encontrada");
  });
});

describe("PATCH /api/cargas-quimicas/:id/status", () => {
  it("atualiza o status da carga", async () => {
    const carga = await criarCarga();

    const resposta = await api
      .patch(`${CARGAS}/${carga.id}/status`)
      .send({ status: "Em análise" });

    expect(resposta.status).toBe(200);
    expect(resposta.body.status).toBe("Em análise");
  });

  it("aceita todas as transições do fluxo principal até 'Finalizada'", async () => {
    const carga = await criarCarga();
    const fluxo = [
      "Em análise",
      "Em inspeção",
      "Liberada",
      "Em movimentação",
      "Finalizada",
    ];

    for (const status of fluxo) {
      const resposta = await api
        .patch(`${CARGAS}/${carga.id}/status`)
        .send({ status });

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe(status);
    }
  });

  it.each([
    { de: "Registrada", caminho: [], para: "Finalizada" },
    { de: "Registrada", caminho: [], para: "Liberada" },
    {
      de: "Em inspeção",
      caminho: ["Em análise", "Em inspeção"],
      para: "Finalizada",
    },
    {
      de: "Liberada",
      caminho: ["Em análise", "Em inspeção", "Liberada"],
      para: "Registrada",
    },
  ])(
    "bloqueia a transição proibida $de → $para e mantém o status",
    async ({ de, caminho, para }) => {
      const carga = await criarCarga();
      await levarCargaAte(carga.id, ...caminho);

      const resposta = await api
        .patch(`${CARGAS}/${carga.id}/status`)
        .send({ status: para });

      expect(resposta.status).toBe(400);
      expect(resposta.body.erro).toBeTruthy();

      const consulta = await api.get(`${CARGAS}/${carga.id}`);
      expect(consulta.body.status).toBe(de);
    },
  );

  it("rejeita um status inexistente", async () => {
    const carga = await criarCarga();

    const resposta = await api
      .patch(`${CARGAS}/${carga.id}/status`)
      .send({ status: "Voando" });

    expect(resposta.status).toBe(400);
  });
});

describe("liberação da carga", () => {
  it("libera a carga em inspeção com documentação validada", async () => {
    const carga = await criarCarga();
    await levarCargaAte(carga.id, "Em análise", "Em inspeção");

    const resposta = await api.patch(`${CARGAS}/${carga.id}/liberar`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.status).toBe("Liberada");
  });

  it("bloqueia a liberação sem documentação obrigatória", async () => {
    const carga = await criarCarga({ documentacaoObrigatoria: null });
    await levarCargaAte(carga.id, "Em análise", "Em inspeção");

    const resposta = await api.patch(`${CARGAS}/${carga.id}/liberar`);

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe(
      "Uma carga não pode ser liberada sem documentação obrigatória.",
    );
  });

  it("bloqueia a liberação pela rota de status com documento pendente", async () => {
    const carga = await criarCarga({
      documentacaoObrigatoria: DOCUMENTACAO_PENDENTE,
    });
    await levarCargaAte(carga.id, "Em análise", "Em inspeção");

    const resposta = await api
      .patch(`${CARGAS}/${carga.id}/status`)
      .send({ status: "Liberada" });

    expect(resposta.status).toBe(400);

    const consulta = await api.get(`${CARGAS}/${carga.id}`);
    expect(consulta.body.status).toBe("Em inspeção");
  });
});

describe("cancelamento da carga", () => {
  it("cancela a carga sem removê-la do banco", async () => {
    const carga = await criarCarga();

    const resposta = await api.patch(`${CARGAS}/${carga.id}/cancelar`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.status).toBe("Cancelada");

    const consulta = await api.get(`${CARGAS}/${carga.id}`);
    expect(consulta.status).toBe(200);
    expect(consulta.body.status).toBe("Cancelada");
  });

  it("não altera uma carga já cancelada", async () => {
    const carga = await criarCarga();
    await api.patch(`${CARGAS}/${carga.id}/cancelar`);

    const resposta = await api
      .patch(`${CARGAS}/${carga.id}/status`)
      .send({ status: "Em análise" });

    expect(resposta.status).toBe(400);
  });
});

describe("carga bloqueada", () => {
  it("bloqueia a carga em inspeção", async () => {
    const carga = await criarCarga();
    await levarCargaAte(carga.id, "Em análise", "Em inspeção");

    const resposta = await api.patch(`${CARGAS}/${carga.id}/bloquear`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.status).toBe("Bloqueada");
  });

  it("não deixa movimentar uma carga bloqueada", async () => {
    const carga = await criarCarga();
    await levarCargaAte(carga.id, "Em análise", "Em inspeção");
    await api.patch(`${CARGAS}/${carga.id}/bloquear`);

    const resposta = await api
      .patch(`${CARGAS}/${carga.id}/status`)
      .send({ status: "Em movimentação" });

    expect(resposta.status).toBe(400);

    const consulta = await api.get(`${CARGAS}/${carga.id}`);
    expect(consulta.body.status).toBe("Bloqueada");
  });
});
