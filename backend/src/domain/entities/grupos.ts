import { Permissoes } from "./permissoes";

export class Grupos {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly descricao: string,
    private permissoes: Permissoes[] = []
  ) {
    if (!nome || nome.trim() === '') {
      throw new Error('O grupo precisa ter um nome.');
    }
  }

  public adicionarPermissao(permissao: Permissoes): void {
    this.permissoes.push(permissao);
  }

  public getPermissoes(): Permissoes[] {
    return this.permissoes;
  }

  public possuiPermissoes(): boolean {
    return this.permissoes.length > 0;
  }
}