import "../helpers/ambienteTeste";
import { afterAll, describe, expect, it } from "vitest";
import { sequelize } from "../../infrastructure/frameworks/database";
import { PRODUTOS, api, criarProduto, produtoValido } from "../helpers/api";

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/produtos-quimicos", () => {
  it("cadastra um produto químico e o grava no banco", async () => {
    const resposta = await api.post(PRODUTOS).send(produtoValido());

    expect(resposta.status).toBe(201);
    expect(resposta.body.produto).toMatchObject({
      nome: "Ácido Sulfúrico",
      classeRisco: "CLASSE_8_CORROSIVOS",
      ativo: true,
    });

    const consulta = await api.get(`${PRODUTOS}/${resposta.body.produto.id}`);
    expect(consulta.status).toBe(200);
    expect(consulta.body.nome).toBe("Ácido Sulfúrico");
  });

  it("bloqueia o cadastro de produto sem nome", async () => {
    const resposta = await api
      .post(PRODUTOS)
      .send(produtoValido({ nome: "" }));

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBeTruthy();
  });

  it("bloqueia o cadastro de produto sem classe de risco", async () => {
    const { classeRisco, ...semClasse } = produtoValido();

    const resposta = await api.post(PRODUTOS).send(semClasse);

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBeTruthy();
  });
});

describe("consulta, atualização e inativação de produto", () => {
  it("lista os produtos cadastrados", async () => {
    const produto = await criarProduto({ nome: "Hidróxido de Sódio" });

    const resposta = await api.get(PRODUTOS);

    expect(resposta.status).toBe(200);
    expect(resposta.body.map((p: any) => p.id)).toContain(produto.id);
  });

  it("devolve 404 para produto inexistente", async () => {
    const resposta = await api.get(`${PRODUTOS}/999999`);

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toBe("Produto químico não encontrado");
  });

  it("devolve 400 para identificador inválido", async () => {
    const resposta = await api.get(`${PRODUTOS}/abc`);

    expect(resposta.status).toBe(400);
  });

  it("atualiza os dados do produto", async () => {
    const produto = await criarProduto();

    const resposta = await api
      .put(`${PRODUTOS}/${produto.id}`)
      .send({ descricao: "Uso industrial" });

    expect(resposta.status).toBe(200);
    expect(resposta.body.descricao).toBe("Uso industrial");
  });

  it("inativa o produto sem removê-lo do banco", async () => {
    const produto = await criarProduto();

    const resposta = await api.patch(`${PRODUTOS}/${produto.id}/inativar`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.ativo).toBe(false);

    const consulta = await api.get(`${PRODUTOS}/${produto.id}`);
    expect(consulta.status).toBe(200);
    expect(consulta.body.ativo).toBe(false);
  });
});
