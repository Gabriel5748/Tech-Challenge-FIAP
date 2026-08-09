import type { CadastrarProdutoQuimicoInput } from "../../dtos/cadastrarProdutoQuimicoInput.js";
import type { RegistrarCargaQuimicaInput } from "../../dtos/registrarCargaQuimicaInput.js";
import type { AssociarCargaProdutoInput } from "../../dtos/associarCargaProdutoInput.js";
import type { RegistrarDocumentacaoInput } from "../../dtos/registrarDocumentacaoInput.js";


export interface CadastrarProdutoQuimicoUseCase {
    executar(input: CadastrarProdutoQuimicoInput): Promise<void>;
};

export interface RegistrarCargaQuimica {
    executar(input: RegistrarCargaQuimicaInput): Promise<void>;
};

export interface AssociarCargaProdutoUseCase {
    executar(input: AssociarCargaProdutoInput): Promise<void>;
};

export interface InformarClassificacaoRiscoUseCase {
    executar(input: InformarClassificacaoRiscoInput): Promise<void>;
};

export interface RegistrarDocumentacaoUseCase  {
    executar(input: RegistrarDocumentacaoInput): Promise<void>;
};

export interface DefinirResponsavelTecnicoUseCase  {
    executar(input: DefinirResponsavelTecnicoInput): Promise<void>;
};

export interface AcompanharStatusCargaUseCase  {
    executar(input: AcompanharStatusCargaInput): Promise<StatusCarga>;
};

export interface BloquearCargaUseCase  {
    executar(input: BloquearCargaInput): Promise<void>;
};

export interface LiberarCargaUseCase  {
    executar(input: LiberarCargaInput): Promise<void>;
};

export interface ValidarRegrasSegurancaUseCase {
    executar(input: ValidarRegrasSegurancaInput): Promise<ResultadoValidacao>;
};