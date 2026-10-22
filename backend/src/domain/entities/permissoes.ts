export class Permissoes {
  constructor(
    public readonly id: string,
    public readonly nomePermissao: string,
    public readonly descricao: string
  ) {
    if (!nomePermissao || nomePermissao.trim() === '') {
      throw new Error('Uma permissão não pode ser cadastrada sem nome.'); // Regra 4.17
    }
  }
}