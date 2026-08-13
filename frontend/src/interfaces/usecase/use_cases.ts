import type { CadastrarProdutoQuimicoInput } from "../../dtos/cadastrarProdutoQuimicoInput.js";
import type { RegistrarCargaQuimicaInput } from "../../dtos/registrarCargaQuimicaInput.js";
import type { AssociarCargaProdutoInput } from "../../dtos/associarCargaProdutoInput.js";
import type { RegistrarDocumentacaoInput } from "../../dtos/registrarDocumentacaoInput.js";
import type { InformarClassificacaoRiscoInput } from "../../dtos/informarClassificacaoRiscoInput.js";
import type { DefinirResponsavelTecnicoInput } from "../../dtos/definirResponsavelTecnicoInput.js";
import type { AcompanharStatusCargaInput } from "../../dtos/acompanharStatusCargaInput.js";
import type { BloquearCargaInput } from "../../dtos/bloquearCargaInput.js";
import type { LiberarCargaInput } from "../../dtos/liberarCargaInput.js";
import type { ValidarRegrasSegurancaInput } from "../../dtos/validarRegrasSegurancaInput.js";
import type { ResultadoValidacao } from "../../dtos/resultadoValidacao.js";
import type { StatusCarga } from "../../entities/enums.js";

export interface CadastrarProdutoQuimicoUseCase {
    executar(input: CadastrarProdutoQuimicoInput): Promise<void>;
}

export interface RegistrarCargaQuimicaUseCase {
    executar(input: RegistrarCargaQuimicaInput): Promise<void>;
}

export interface AssociarCargaProdutoUseCase {
    executar(input: AssociarCargaProdutoInput): Promise<void>;
}

export interface InformarClassificacaoRiscoUseCase {
    executar(input: InformarClassificacaoRiscoInput): Promise<void>;
}

export interface RegistrarDocumentacaoUseCase {
    executar(input: RegistrarDocumentacaoInput): Promise<void>;
}

export interface DefinirResponsavelTecnicoUseCase {
    executar(input: DefinirResponsavelTecnicoInput): Promise<void>;
}

export interface AcompanharStatusCargaUseCase {
    executar(input: AcompanharStatusCargaInput): Promise<StatusCarga>;
}

export interface BloquearCargaUseCase {
    executar(input: BloquearCargaInput): Promise<void>;
}

export interface LiberarCargaUseCase {
    executar(input: LiberarCargaInput): Promise<void>;
}

export interface ValidarRegrasSegurancaUseCase {
    executar(input: ValidarRegrasSegurancaInput): Promise<ResultadoValidacao>;
}
