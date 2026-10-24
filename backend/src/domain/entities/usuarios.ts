import { Grupos } from "./grupos";

export class Usuario {
  constructor(
    public readonly id: string,
    public readonly nomeCompleto: string,
    public readonly email: string,
    public readonly dataDeContratacao: Date,
    public readonly periodoTurno: string,
    public readonly status: 'ativo' | 'inativo',
    private grupos: Grupos[] = []
  ) {}

  public adicionarGrupo(grupo: Grupos): void {
    this.grupos.push(grupo);
  }

  public getGrupos(): Grupos[] {
    return this.grupos;
  }

  public pertenceAoMenosUmGrupo(): boolean {
    return this.grupos.length > 0;
  }
}
