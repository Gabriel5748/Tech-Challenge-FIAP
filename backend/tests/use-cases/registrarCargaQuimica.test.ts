import { describe, expect, it } from "vitest";
import { RegistrarCargaQuimica } from "../../application/use-cases/cargaQuimica/registrarCargaQuimica";
import {
  DOC_VALIDADO,
  criarCargaRepoFake,
  criarProdutoRepoFake,
  produtoFake,
} from "../helpers/fakes";

const entradaValida = {
  codigo: "CQ-2026-0001",
  produtoQuimicoId: 1,
  quantidade: 500,
  unidadeMedida: "L",
  origem: "Terminal Alamoa - Santos/SP",
  destino: "Polo Industrial - Cubatão/SP",
  responsavelTecnico: "Maria Souza",
  documentacaoObrigatoria: [DOC_VALIDADO],
  dataEntrada: "2026-10-20T08:00:00Z",
};

function montar(produtos: any[] = [produtoFake()]) {
  const cargaRepo = criarCargaRepoFake();
  const produtoRepo = criarProdutoRepoFake(produtos);
  const casoDeUso = new RegistrarCargaQuimica(
    cargaRepo as any,
    produtoRepo as any,
  );
  return { cargaRepo, produtoRepo, casoDeUso };
}

describe("RegistrarCargaQuimica", () => {
  describe("registro válido", () => {
    it("registra a carga com status inicial 'Registrada'", async () => {
      const { cargaRepo, casoDeUso } = montar();

      await casoDeUso.execute(entradaValida);

      expect(cargaRepo.registrar).toHaveBeenCalledTimes(1);
      expect(cargaRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          codigo: "CQ-2026-0001",
          produtoQuimicoId: 1,
          quantidade: 500,
          unidadeMedida: "L",
          origem: "Terminal Alamoa - Santos/SP",
          destino: "Polo Industrial - Cubatão/SP",
          responsavelTecnico: "Maria Souza",
          status: "Registrada",
        }),
      );
    });

    it("herda nome e fórmula do produto quando não informados", async () => {
      const { cargaRepo, casoDeUso } = montar();

      await casoDeUso.execute(entradaValida);

      expect(cargaRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ nome: "Ácido Sulfúrico", formula: "H2SO4" }),
      );
    });

    it("gera um código quando ele não é informado", async () => {
      const { cargaRepo, casoDeUso } = montar();

      await casoDeUso.execute({ ...entradaValida, codigo: undefined });

      const dados = cargaRepo.registrar.mock.calls[0]![0];
      expect(dados.codigo).toMatch(/^CRG-\d+$/);
    });

    it("converte quantidade enviada como texto numérico", async () => {
      const { cargaRepo, casoDeUso } = montar();

      await casoDeUso.execute({ ...entradaValida, quantidade: "250" as any });

      expect(cargaRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ quantidade: 250 }),
      );
    });

    it("aceita os nomes de campo em snake_case", async () => {
      const { cargaRepo, casoDeUso } = montar();

      await casoDeUso.execute({
        quantidade: 100,
        produto_quimico_id: 1,
        responsavel_tecnico: "Maria Souza",
        unidade_medida: "KG",
      });

      expect(cargaRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          produtoQuimicoId: 1,
          responsavelTecnico: "Maria Souza",
          unidadeMedida: "KG",
        }),
      );
    });
  });

  describe("produto químico", () => {
    it.each([[undefined], [0], [-1], ["abc"]])(
      "bloqueia carga sem produto químico associado (id = %j)",
      async (produtoQuimicoId) => {
        const { cargaRepo, casoDeUso } = montar();

        await expect(
          casoDeUso.execute({
            ...entradaValida,
            produtoQuimicoId: produtoQuimicoId as any,
          }),
        ).rejects.toThrow(/sem produto químico associado/);
        expect(cargaRepo.registrar).not.toHaveBeenCalled();
      },
    );

    it("a assinatura antiga (nome, fórmula) é rejeitada: falta o produto", async () => {
      const { cargaRepo, casoDeUso } = montar();

      await expect(casoDeUso.execute("Carga A", "H2SO4")).rejects.toThrow(
        /sem produto químico associado/,
      );
      expect(cargaRepo.registrar).not.toHaveBeenCalled();
    });

    it("bloqueia carga com produto que não existe", async () => {
      const { cargaRepo, casoDeUso } = montar([]);

      await expect(casoDeUso.execute(entradaValida)).rejects.toThrow(
        /não encontrado no sistema/,
      );
      expect(cargaRepo.registrar).not.toHaveBeenCalled();
    });

    it("bloqueia carga com produto químico inativo", async () => {
      const { cargaRepo, casoDeUso } = montar([produtoFake({ ativo: false })]);

      await expect(casoDeUso.execute(entradaValida)).rejects.toThrow(
        /produto químico inativo/,
      );
      expect(cargaRepo.registrar).not.toHaveBeenCalled();
    });
  });

  describe("quantidade", () => {
    it.each([[0], [-10], [undefined], [null], ["abc"]])(
      "bloqueia carga com quantidade inválida (%j)",
      async (quantidade) => {
        const { cargaRepo, casoDeUso } = montar();

        await expect(
          casoDeUso.execute({ ...entradaValida, quantidade: quantidade as any }),
        ).rejects.toThrow(/quantidade da carga deve ser maior que zero/);
        expect(cargaRepo.registrar).not.toHaveBeenCalled();
      },
    );
  });

  describe("responsável técnico", () => {
    it.each([[undefined], [""], ["   "]])(
      "bloqueia carga sem responsável técnico (%j)",
      async (responsavelTecnico) => {
        const { cargaRepo, casoDeUso } = montar();

        await expect(
          casoDeUso.execute({
            ...entradaValida,
            responsavelTecnico: responsavelTecnico as any,
          }),
        ).rejects.toThrow(/responsável técnico informado/);
        expect(cargaRepo.registrar).not.toHaveBeenCalled();
      },
    );
  });

  describe("status inicial", () => {
    it("rejeita um status inicial inexistente", async () => {
      const { cargaRepo, casoDeUso } = montar();

      await expect(
        casoDeUso.execute({ ...entradaValida, status: "xpto" }),
      ).rejects.toThrow(/Status inicial da carga inválido/);
      expect(cargaRepo.registrar).not.toHaveBeenCalled();
    });
  });

  // Lacunas encontradas na revisão. Viram testes de verdade quando forem implementadas.
  it.todo(
    "ignora o status enviado e sempre registra como 'Registrada' (hoje o cliente consegue registrar já como 'Liberada')",
  );
  it.todo(
    "rejeita código de carga duplicado (o openapi.yaml prevê 409 CONFLITO_DUPLICIDADE)",
  );
});
