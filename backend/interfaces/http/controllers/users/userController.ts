import { Request, Response } from 'express';
import { IUsuarioRepository } from '../../../../src/domain/interfaces/usuarioRepository';
import { IGrupoRepository } from '../../../../src/domain/interfaces/grupoRepository';
import { Usuario } from '../../../../src/domain/entities/usuarios';
import { AtribuirUsuarioGrupoUseCase } from '../../../../application/use-cases/AtribuirUsuarioGrupo';
import { logger } from '../../../../infrastructure/logger';

export class UserController {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly grupoRepository?: IGrupoRepository,
    private readonly atribuirUsuarioGrupoUseCase?: AtribuirUsuarioGrupoUseCase
  ) {}

  private getLogger(req: Request) {
    return (req as any).log || logger;
  }

  // POST /api/usuarios - Cadastrar novo usuário
  async cadastrar(req: Request, res: Response): Promise<Response> {
    try {
      const { nomeCompleto, email, dataDeContratacao, periodoTurno, status, gruposIds } = req.body;

      // Validação de campos obrigatórios
      if (!nomeCompleto || typeof nomeCompleto !== 'string' || nomeCompleto.trim() === '') {
        return res.status(400).json({ erro: 'O campo "nomeCompleto" é obrigatório e deve ser uma string válida.' });
      }

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ erro: 'O campo "email" é obrigatório e deve conter um e-mail válido.' });
      }

      if (!dataDeContratacao) {
        return res.status(400).json({ erro: 'O campo "dataDeContratacao" é obrigatório.' });
      }

      const dataContratacaoParsed = new Date(dataDeContratacao);
      if (isNaN(dataContratacaoParsed.getTime())) {
        return res.status(400).json({ erro: 'O campo "dataDeContratacao" deve conter uma data válida.' });
      }

      if (!periodoTurno || typeof periodoTurno !== 'string') {
        return res.status(400).json({ erro: 'O campo "periodoTurno" é obrigatório.' });
      }

      const statusUsuario = status === 'inativo' ? 'inativo' : 'ativo';

      // Verificar unicidade de e-mail
      const emailExistente = await this.usuarioRepository.buscarPorEmail(email.trim());
      if (emailExistente) {
        return res.status(409).json({ erro: 'Já existe um usuário cadastrado com este e-mail.' });
      }

      // Buscar grupos vinculados se fornecidos
      let gruposDomain: any[] = [];
      if (Array.isArray(gruposIds) && gruposIds.length > 0 && this.grupoRepository) {
        gruposDomain = await this.grupoRepository.listarPorIds(gruposIds);
      }

      // Criar entidade de domínio Usuario (id gerado pelo banco ou crypto)
      const novoUsuario = new Usuario(
        '', // id gerado automaticamente pelo Sequelize (UUIDV4)
        nomeCompleto.trim(),
        email.trim().toLowerCase(),
        dataContratacaoParsed,
        periodoTurno.trim(),
        statusUsuario,
        gruposDomain
      );

      await this.usuarioRepository.salvar(novoUsuario);

      // Buscar o usuário recém-criado para retornar dados completos
      const usuarioCriado = await this.usuarioRepository.buscarPorEmail(email.trim().toLowerCase());

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso.',
        usuario: usuarioCriado || novoUsuario,
      });
    } catch (error: any) {
      this.getLogger(req).error({ error, body: req.body }, 'Erro ao cadastrar usuário');
      return res.status(500).json({
        erro: 'Erro interno ao cadastrar usuário',
        detalhes: error.message,
      });
    }
  }

  // GET /api/usuarios - Listar todos os usuários
  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await this.usuarioRepository.listarTodos();
      return res.status(200).json(usuarios);
    } catch (error: any) {
      this.getLogger(req).error({ error }, 'Erro ao listar usuários');
      return res.status(500).json({
        erro: 'Erro interno ao listar usuários',
        detalhes: error.message,
      });
    }
  }

  // Alias para retrocompatibilidade com a chamada userController.lstarUsuarios()
  async lstarUsuarios(req: Request, res: Response): Promise<Response> {
    return this.listar(req, res);
  }

  // Alias sem typo
  async listarUsuarios(req: Request, res: Response): Promise<Response> {
    return this.listar(req, res);
  }

  // GET /api/usuarios/:id - Buscar usuário por ID
  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);

      if (!id || id === 'undefined') {
        return res.status(400).json({ erro: 'ID do usuário não fornecido ou inválido.' });
      }

      const usuario = await this.usuarioRepository.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      return res.status(200).json(usuario);
    } catch (error: any) {
      this.getLogger(req).error({ error, id: req.params.id }, 'Erro ao buscar usuário por ID');
      return res.status(500).json({
        erro: 'Erro ao buscar usuário',
        detalhes: error.message,
      });
    }
  }

  // PUT /api/usuarios/:id - Atualizar dados do usuário
  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const { nomeCompleto, email, dataDeContratacao, periodoTurno, status, gruposIds } = req.body;

      if (!id || id === 'undefined') {
        return res.status(400).json({ erro: 'ID do usuário inválido.' });
      }

      const usuarioExistente = await this.usuarioRepository.buscarPorId(id);
      if (!usuarioExistente) {
        return res.status(404).json({ erro: 'Usuário não encontrado para atualização.' });
      }

      // Se o e-mail mudou, validar unicidade
      if (email && email.trim().toLowerCase() !== usuarioExistente.email.toLowerCase()) {
        const emailEmUso = await this.usuarioRepository.buscarPorEmail(email.trim().toLowerCase());
        if (emailEmUso && emailEmUso.id !== id) {
          return res.status(409).json({ erro: 'O e-mail informado já está em uso por outro usuário.' });
        }
      }

      // Buscar grupos vinculados se fornecidos
      let gruposDomain = usuarioExistente.getGrupos();
      if (Array.isArray(gruposIds) && this.grupoRepository) {
        gruposDomain = await this.grupoRepository.listarPorIds(gruposIds);
      }

      const dataContratacaoParsed = dataDeContratacao
        ? new Date(dataDeContratacao)
        : usuarioExistente.dataDeContratacao;

      const usuarioAtualizado = new Usuario(
        id,
        nomeCompleto ? nomeCompleto.trim() : usuarioExistente.nomeCompleto,
        email ? email.trim().toLowerCase() : usuarioExistente.email,
        dataContratacaoParsed,
        periodoTurno ? periodoTurno.trim() : usuarioExistente.periodoTurno,
        status === 'ativo' || status === 'inativo' ? status : usuarioExistente.status,
        gruposDomain
      );

      await this.usuarioRepository.atualizar(usuarioAtualizado);

      const resultadoFinal = await this.usuarioRepository.buscarPorId(id);

      return res.status(200).json({
        mensagem: 'Usuário atualizado com sucesso.',
        usuario: resultadoFinal || usuarioAtualizado,
      });
    } catch (error: any) {
      this.getLogger(req).error({ error, id: req.params.id, body: req.body }, 'Erro ao atualizar usuário');
      return res.status(500).json({
        erro: 'Erro ao atualizar usuário',
        detalhes: error.message,
      });
    }
  }

  // DELETE /api/usuarios/:id - Deletar usuário
  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);

      if (!id || id === 'undefined') {
        return res.status(400).json({ erro: 'ID do usuário inválido.' });
      }

      const usuarioExistente = await this.usuarioRepository.buscarPorId(id);
      if (!usuarioExistente) {
        return res.status(404).json({ erro: 'Usuário não encontrado para exclusão.' });
      }

      await this.usuarioRepository.deletar(id);
      return res.status(204).send();
    } catch (error: any) {
      this.getLogger(req).error({ error, id: req.params.id }, 'Erro ao deletar usuário');
      return res.status(500).json({
        erro: 'Erro ao deletar usuário',
        detalhes: error.message,
      });
    }
  }

  // POST /api/usuarios/:id/grupos - Atribuir grupo ao usuário
  async atribuirGrupo(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id);
      const { grupoId } = req.body;

      if (!id || id === 'undefined' || !grupoId) {
        return res.status(400).json({ erro: 'Os campos "id" e "grupoId" são obrigatórios.' });
      }

      const idGrupoString = String(grupoId);

      if (this.atribuirUsuarioGrupoUseCase) {
        await this.atribuirUsuarioGrupoUseCase.execute(id, idGrupoString);
      } else if (this.grupoRepository) {
        const usuario = await this.usuarioRepository.buscarPorId(id);
        const grupo = await this.grupoRepository.buscarPorId(idGrupoString);

        if (!usuario || !grupo) {
          return res.status(404).json({ erro: 'Usuário ou Grupo não encontrado.' });
        }

        usuario.adicionarGrupo(grupo);
        await this.usuarioRepository.atualizar(usuario);
      } else {
        return res.status(500).json({ erro: 'Dependência de grupos não configurada no controlador.' });
      }

      return res.status(200).json({ mensagem: 'Grupo atribuído com sucesso ao usuário.' });
    } catch (error: any) {
      this.getLogger(req).error({ error, id: req.params.id, body: req.body }, 'Erro ao atribuir grupo');
      return res.status(400).json({
        erro: 'Erro ao atribuir grupo ao usuário',
        detalhes: error.message,
      });
    }
  }
}

export default UserController;
