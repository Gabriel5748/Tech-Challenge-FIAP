import "./ambienteTeste";
import request from "supertest";
import app from "../../server";

export const api = request(app);

export const PRODUTOS = "/api/produtos-quimicos";
export const CARGAS = "/api/cargas-quimicas";

export const DOCUMENTACAO_VALIDADA = [
  { tipo: "FICHA_DE_SEGURANCA", status: "validado" },
  { tipo: "AUTORIZACAO_DE_TRANSPORTE", status: "validado" },
];

export const DOCUMENTACAO_PENDENTE = [
  { tipo: "FICHA_DE_SEGURANCA", status: "validado" },
  { tipo: "AUTORIZACAO_DE_TRANSPORTE", status: "pendente" },
];

export function produtoValido(sobrescrever: Record<string, unknown> = {}) {
  return {
    nome: "Ácido Sulfúrico",
    formula: "H2SO4",
    numeroONU: "1830",
    classeRisco: "CLASSE_8_CORROSIVOS",
    ...sobrescrever,
  };
}

export function cargaValida(
  produtoQuimicoId: number,
  sobrescrever: Record<string, unknown> = {},
) {
  return {
    produtoQuimicoId,
    quantidade: 500,
    unidadeMedida: "L",
    origem: "Terminal Alamoa - Santos/SP",
    destino: "Polo Industrial - Cubatão/SP",
    responsavelTecnico: "Maria Souza",
    documentacaoObrigatoria: DOCUMENTACAO_VALIDADA,
    ...sobrescrever,
  };
}

export async function criarProduto(sobrescrever: Record<string, unknown> = {}) {
  const resposta = await api.post(PRODUTOS).send(produtoValido(sobrescrever));
  return resposta.body.produto;
}

export async function criarCarga(sobrescrever: Record<string, unknown> = {}) {
  const produto = await criarProduto();
  const resposta = await api
    .post(CARGAS)
    .send(cargaValida(produto.id, sobrescrever));
  return resposta.body.carga;
}

export async function levarCargaAte(id: number, ...status: string[]) {
  for (const proximo of status) {
    await api.patch(`${CARGAS}/${id}/status`).send({ status: proximo });
  }
}
