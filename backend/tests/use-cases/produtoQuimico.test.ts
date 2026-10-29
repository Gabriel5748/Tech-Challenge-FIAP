import { describe, expect, it } from "vitest";
import { AtualizarProdutoQuimico } from "../../application/use-cases/produtoQuimico/atualizarProdutoQuimico";
import { BuscarProdutoQuimicoPorIdentificador } from "../../application/use-cases/produtoQuimico/buscarProdutoQuimicoPorIdentificador";
import { CadastrarProdutoQuimico } from "../../application/use-cases/produtoQuimico/cadastrarProdutoQuimico";
import { InativarProdutoQuimico } from "../../application/use-cases/produtoQuimico/inativarProdutoQuimico";
import { ListarProdutosQuimicos } from "../../application/use-cases/produtoQuimico/listarProdutoQuimico";
import { criarProdutoRepoFake, produtoFake } from "../helpers/fakes";

describe("CadastrarProdutoQuimico", () => {
  const entradaValida = {
    nome: "Ácido Sulfúrico",
    formula: "H2SO4",
    descricao: "Líquido corrosivo",
    numeroONU: "UN1830",
    classeRisco: "CLASSE_8_CORROSIVOS",
    grupoCompatibilidade: "Ácidos",
  };

  it("cadastra um produto válido, ativo por padrão", async () => {
    const repo = criarProdutoRepoFake();
    const casoDeUso = new CadastrarProdutoQuimico(repo as any);

    await casoDeUso.execute(entradaValida);

    expect(repo.criar).toHaveBeenCalledTimes(1);
    expect(repo.criar).toHaveBeenCalledWith({
      nome: "Ácido Sulfúrico",
      formula: "H2SO4",
      descricao: "Líquido corrosivo",
      numeroONU: "UN1830",
      classeRisco: "CLASSE_8_CORROSIVOS",
      grupoCompatibilidade: "Ácidos",
      ativo: true,
    });
  });

  it("remove espaços das pontas dos textos", async () => {
    const repo = criarProdutoRepoFake();

    await new CadastrarProdutoQuimico(repo as any).execute({
      nome: "  Ácido Sulfúrico  ",
      classeRisco: "  CLASSE_8_CORROSIVOS ",
    });

    expect(repo.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "Ácido Sulfúrico",
        classeRisco: "CLASSE_8_CORROSIVOS",
      }),
    );
  });

  it("aceita os nomes de campo em snake_case", async () => {
    const repo = criarProdutoRepoFake();

    await new CadastrarProdutoQuimico(repo as any).execute({
      nome: "Amônia",
      classe_risco: "CLASSE_2_GASES",
      numero_onu: "UN1005",
      grupo_compatibilidade: "Bases",
    });

    expect(repo.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        classeRisco: "CLASSE_2_GASES",
        numeroONU: "UN1005",
        grupoCompatibilidade: "Bases",
      }),
    );
  });

  describe("bloqueia cadastro sem nome", () => {
    it.each([[undefined], [""], ["   "]])("nome = %j", async (nome) => {
      const repo = criarProdutoRepoFake();
      const casoDeUso = new CadastrarProdutoQuimico(repo as any);

      await expect(
        casoDeUso.execute({ ...entradaValida, nome: nome as any }),
      ).rejects.toThrow(/sem nome/);
      expect(repo.criar).not.toHaveBeenCalled();
    });
  });

  describe("bloqueia cadastro sem classe de risco", () => {
    it.each([[undefined], [""], ["   "]])(
      "classeRisco = %j",
      async (classeRisco) => {
        const repo = criarProdutoRepoFake();
        const casoDeUso = new CadastrarProdutoQuimico(repo as any);

        await expect(
          casoDeUso.execute({ ...entradaValida, classeRisco: classeRisco as any }),
        ).rejects.toThrow(/sem classe de risco/);
        expect(repo.criar).not.toHaveBeenCalled();
      },
    );

    it("a assinatura antiga (nome, fórmula) também é rejeitada, pois não informa a classe", async () => {
      const repo = criarProdutoRepoFake();

      await expect(
        new CadastrarProdutoQuimico(repo as any).execute("Ácido", "H2SO4"),
      ).rejects.toThrow(/sem classe de risco/);
      expect(repo.criar).not.toHaveBeenCalled();
    });
  });

  describe("status", () => {
    it.each([["pendente"], ["ligado"], [""]])(
      "bloqueia cadastro com status inválido (%j)",
      async (status) => {
        const repo = criarProdutoRepoFake();

        await expect(
          new CadastrarProdutoQuimico(repo as any).execute({
            ...entradaValida,
            status,
          }),
        ).rejects.toThrow(/status inválido/);
        expect(repo.criar).not.toHaveBeenCalled();
      },
    );

    it("bloqueia 'ativo' que não seja booleano", async () => {
      const repo = criarProdutoRepoFake();

      await expect(
        new CadastrarProdutoQuimico(repo as any).execute({
          ...entradaValida,
          ativo: "sim" as any,
        }),
      ).rejects.toThrow(/status inválido/);
    });

    it.each([
      [{ status: "inativo" }, false],
      [{ status: "INATIVO" }, false],
      [{ status: "Ativo" }, true],
      [{ ativo: false }, false],
      [{ ativo: true }, true],
    ])("cadastra com %j → ativo = %s", async (extra, ativoEsperado) => {
      const repo = criarProdutoRepoFake();

      await new CadastrarProdutoQuimico(repo as any).execute({
        ...entradaValida,
        ...extra,
      });

      expect(repo.criar).toHaveBeenCalledWith(
        expect.objectContaining({ ativo: ativoEsperado }),
      );
    });
  });
});

describe("AtualizarProdutoQuimico", () => {
  it("atualiza os campos informados e repassa o identificador", async () => {
    const repo = criarProdutoRepoFake();

    await new AtualizarProdutoQuimico(repo as any).execute(
      { nome: "  Ácido Sulfúrico 98%  ", classeRisco: "CLASSE_8_CORROSIVOS" },
      5,
    );

    expect(repo.atualizar).toHaveBeenCalledWith(
      { nome: "Ácido Sulfúrico 98%", classeRisco: "CLASSE_8_CORROSIVOS" },
      5,
    );
  });

  it("aceita a assinatura antiga (fórmula, id)", async () => {
    const repo = criarProdutoRepoFake();

    await new AtualizarProdutoQuimico(repo as any).execute("H2SO4", 5);

    expect(repo.atualizar).toHaveBeenCalledWith({ formula: "H2SO4" }, 5);
  });

  it("não deixa o nome ficar vazio", async () => {
    const repo = criarProdutoRepoFake();

    await expect(
      new AtualizarProdutoQuimico(repo as any).execute({ nome: "   " }, 5),
    ).rejects.toThrow(/nome do produto químico não pode ser vazio/);
    expect(repo.atualizar).not.toHaveBeenCalled();
  });

  it("não deixa a classe de risco ficar vazia", async () => {
    const repo = criarProdutoRepoFake();

    await expect(
      new AtualizarProdutoQuimico(repo as any).execute({ classeRisco: "" }, 5),
    ).rejects.toThrow(/classe de risco .* não pode ser vazia/);
    expect(repo.atualizar).not.toHaveBeenCalled();
  });

  it("rejeita status inválido", async () => {
    const repo = criarProdutoRepoFake();

    await expect(
      new AtualizarProdutoQuimico(repo as any).execute({ status: "talvez" }, 5),
    ).rejects.toThrow(/Status inválido/);
    expect(repo.atualizar).not.toHaveBeenCalled();
  });

  it("converte status em booleano e dá prioridade a 'status' sobre 'ativo'", async () => {
    const repo = criarProdutoRepoFake();
    const casoDeUso = new AtualizarProdutoQuimico(repo as any);

    await casoDeUso.execute({ status: "inativo" }, 5);
    expect(repo.atualizar).toHaveBeenLastCalledWith({ ativo: false }, 5);

    await casoDeUso.execute({ status: "ativo", ativo: false }, 5);
    expect(repo.atualizar).toHaveBeenLastCalledWith({ ativo: true }, 5);
  });

  it("rejeita 'ativo' que não seja booleano", async () => {
    const repo = criarProdutoRepoFake();

    await expect(
      new AtualizarProdutoQuimico(repo as any).execute({ ativo: "sim" as any }, 5),
    ).rejects.toThrow(/Status inválido/);
  });

  it("rejeita atualização sem nenhum dado", async () => {
    const repo = criarProdutoRepoFake();

    await expect(
      new AtualizarProdutoQuimico(repo as any).execute({}, 5),
    ).rejects.toThrow(/Nenhum dado válido/);
    expect(repo.atualizar).not.toHaveBeenCalled();
  });
});

describe("InativarProdutoQuimico", () => {
  it("inativa um produto existente", async () => {
    const repo = criarProdutoRepoFake([produtoFake({ identificador: 7 })]);

    const resultado = await new InativarProdutoQuimico(repo as any).execute(7);

    expect(repo.inativar).toHaveBeenCalledWith(7);
    expect(resultado).toEqual([{ identificador: 7, ativo: false }]);
  });

  it("falha se o produto não existe e não aciona a inativação", async () => {
    const repo = criarProdutoRepoFake([]);

    await expect(
      new InativarProdutoQuimico(repo as any).execute(99),
    ).rejects.toThrow(/não encontrado/);
    expect(repo.inativar).not.toHaveBeenCalled();
  });

  it.todo(
    "rejeita inativar um produto que já está inativo (o openapi.yaml prevê o erro PRODUTO_JA_INATIVO)",
  );
});

describe("BuscarProdutoQuimicoPorIdentificador e ListarProdutosQuimicos", () => {
  it("busca pelo identificador informado", async () => {
    const repo = criarProdutoRepoFake([
      produtoFake({ identificador: 1 }),
      produtoFake({ identificador: 2, nome: "Amônia" }),
    ]);

    const resultado = await new BuscarProdutoQuimicoPorIdentificador(
      repo as any,
    ).execute(2);

    expect(repo.buscarPorIdentificador).toHaveBeenCalledWith(2);
    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toMatchObject({ nome: "Amônia" });
  });

  it("lista todos os produtos", async () => {
    const repo = criarProdutoRepoFake([
      produtoFake({ identificador: 1 }),
      produtoFake({ identificador: 2 }),
    ]);

    const resultado = await new ListarProdutosQuimicos(repo as any).execute();

    expect(resultado).toHaveLength(2);
  });
});
