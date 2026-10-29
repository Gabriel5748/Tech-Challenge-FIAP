import { afterEach, describe, expect, it, vi } from "vitest";
import { Carga, type StatusCarga } from "../../src/domain/entities/cargaQuimica";
import { Grupos } from "../../src/domain/entities/grupos";
import { Permissoes } from "../../src/domain/entities/permissoes";
import { ProdutoQuimico } from "../../src/domain/entities/produtoQuimico";
import { Usuario } from "../../src/domain/entities/usuarios";

afterEach(() => {
  vi.useRealTimers();
});

describe("ProdutoQuimico", () => {
  it("não pode ser criado sem nome", () => {
    expect(() => new ProdutoQuimico(1, "")).toThrow(/sem nome/);
    expect(() => new ProdutoQuimico(1, "   ")).toThrow(/sem nome/);
  });

  it("nasce ativo e pode ser associado a novas cargas", () => {
    const produto = new ProdutoQuimico(1, "Ácido Sulfúrico");

    expect(produto.ativo).toBe(true);
    expect(produto.podeSerAssociado()).toBe(true);
  });

  it("produto inativo não pode ser associado a novas cargas", () => {
    const inativo = new ProdutoQuimico(
      1,
      "Ácido Sulfúrico",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      false,
    );

    expect(inativo.podeSerAssociado()).toBe(false);
  });

  it("inativar muda o status e atualiza a data de atualização", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-20T10:00:00Z"));
    const produto = new ProdutoQuimico(1, "Ácido Sulfúrico");

    vi.setSystemTime(new Date("2026-10-21T10:00:00Z"));
    produto.inativar();

    expect(produto.ativo).toBe(false);
    expect(produto.podeSerAssociado()).toBe(false);
    expect(produto.dataAtualizacao.toISOString()).toBe(
      "2026-10-21T10:00:00.000Z",
    );
  });
});

describe("Carga (entidade)", () => {
  function novaCarga(
    opcoes: {
      quantidade?: number | undefined;
      documentacao?: any[];
      status?: StatusCarga;
    } = {},
  ) {
    return new Carga(
      1,
      "Carga A",
      "H2SO4",
      1,
      "quantidade" in opcoes ? opcoes.quantidade : 500,
      "L",
      "Terminal Alamoa - Santos/SP",
      "Polo Industrial - Cubatão/SP",
      "Maria Souza",
      opcoes.documentacao ?? [],
      opcoes.status ?? "pendente",
    );
  }

  describe("quantidade", () => {
    it.each([0, -1, -250.5])("rejeita quantidade %s", (quantidade) => {
      expect(() => novaCarga({ quantidade })).toThrow(/maior que zero/);
    });

    it("aceita quantidade positiva", () => {
      expect(novaCarga({ quantidade: 0.5 }).quantidade).toBe(0.5);
    });
  });

  describe("validarParaLiberacao", () => {
    it("carga cancelada não pode ser liberada", () => {
      const carga = novaCarga({ status: "cancelado" });

      expect(() => carga.validarParaLiberacao()).toThrow(
        /cancelada não pode ser liberada/,
      );
    });

    it("não libera com documentação pendente ou não validada", () => {
      const carga = novaCarga({
        documentacao: [
          { tipo: "FICHA", status: "validado" },
          { tipo: "LAUDO", status: "pendente" },
        ],
      });

      expect(() => carga.validarParaLiberacao()).toThrow(
        /documentação obrigatória pendente/,
      );
    });

    it("libera quando toda a documentação está validada", () => {
      const carga = novaCarga({
        documentacao: [{ tipo: "FICHA", status: "validado" }],
      });

      expect(() => carga.validarParaLiberacao()).not.toThrow();
    });
  });

  describe("bloquear e cancelar", () => {
    it("bloquear muda o status para bloqueado", () => {
      const carga = novaCarga();

      carga.bloquear();

      expect(carga.status).toBe("bloqueado");
    });

    it("carga cancelada não pode ser bloqueada", () => {
      const carga = novaCarga({ status: "cancelado" });

      expect(() => carga.bloquear()).toThrow(/cancelada não pode ser bloqueada/);
    });

    it("cancelar muda o status para cancelado, e só uma vez", () => {
      const carga = novaCarga();

      carga.cancelar();

      expect(carga.status).toBe("cancelado");
      expect(() => carga.cancelar()).toThrow(/já se encontra cancelada/);
    });
  });
});

describe("Permissoes", () => {
  it("não pode ser cadastrada sem nome (regra 4.17)", () => {
    expect(() => new Permissoes("1", "", "descrição")).toThrow(/sem nome/);
    expect(() => new Permissoes("1", "   ", "descrição")).toThrow(/sem nome/);
  });

  it("é criada quando tem nome", () => {
    const permissao = new Permissoes("1", "liberar_carga", "Libera cargas");

    expect(permissao.nomePermissao).toBe("liberar_carga");
  });
});

describe("Grupos", () => {
  it("precisa ter nome", () => {
    expect(() => new Grupos("1", "", "sem nome")).toThrow(/precisa ter um nome/);
    expect(() => new Grupos("1", "  ", "sem nome")).toThrow(
      /precisa ter um nome/,
    );
  });

  it("começa sem permissões e passa a tê-las ao adicionar", () => {
    const grupo = new Grupos("1", "Gestor operacional", "Gestão das cargas");
    expect(grupo.possuiPermissoes()).toBe(false);

    grupo.adicionarPermissao(new Permissoes("p1", "liberar_carga", "Libera"));

    expect(grupo.possuiPermissoes()).toBe(true);
    expect(grupo.getPermissoes()).toHaveLength(1);
  });

  it("grupos diferentes não compartilham a lista de permissões", () => {
    const a = new Grupos("1", "A", "grupo A");
    const b = new Grupos("2", "B", "grupo B");

    a.adicionarPermissao(new Permissoes("p1", "cadastrar_produto", ""));

    expect(b.possuiPermissoes()).toBe(false);
  });
});

describe("Usuario", () => {
  function novoUsuario() {
    return new Usuario(
      "u1",
      "Renan Carlos",
      "renan@example.com",
      new Date("2026-01-10"),
      "manhã",
      "ativo",
    );
  }

  it("sem grupo, não pertence a nenhum grupo", () => {
    expect(novoUsuario().pertenceAoMenosUmGrupo()).toBe(false);
  });

  it("passa a pertencer a um grupo ao ser adicionado a ele (regra 4.12)", () => {
    const usuario = novoUsuario();

    usuario.adicionarGrupo(new Grupos("g1", "Administrador", "Acesso total"));

    expect(usuario.pertenceAoMenosUmGrupo()).toBe(true);
    expect(usuario.getGrupos()).toHaveLength(1);
  });

  it("pode pertencer a mais de um grupo (relação N:N)", () => {
    const usuario = novoUsuario();

    usuario.adicionarGrupo(new Grupos("g1", "Analista de qualidade", ""));
    usuario.adicionarGrupo(new Grupos("g2", "Analista de documentação", ""));

    expect(usuario.getGrupos()).toHaveLength(2);
  });
});
