import type associarCargaProdutoInput = require("../dtos/associarCargaProdutoInput");
import type cadastrarProdutoQuimicoInput = require("../dtos/cadastrarProdutoQuimicoInput");
import type { InformarClassificacaoRiscoInput } from "../dtos/informarClassificacaoRiscoInput.js";
import type registrarCargaQuimicaInput = require("../dtos/registrarCargaQuimicaInput");
import type registrarDocumentacaoInput = require("../dtos/registrarDocumentacaoInput");

export interface CadastrarProdutoQuimico {
    executar(input: cadastrarProdutoQuimicoInput.CadastrarProdutoQuimicoInput): Promise<void>;
};

export interface RegistrarCargaQuimica {
    executar(input: registrarCargaQuimicaInput.RegistrarCargaQuimicaInput): Promise<void>;
};

export interface AssociarCargaProduto {
    executar(input: associarCargaProdutoInput.AssociarCargaProdutoInput): Promise<void>;
};

export interface InformarClassificacaoRisco {
    executar(input: InformarClassificacaoRiscoInput): Promise<void>;
};

export interface RegistrarDocumentacao {
    executar(input: registrarDocumentacaoInput.RegistrarDocumentacaoInput): Promise<void>;
};

export interface DefinirResponsavelTecnico {
    executar(input: DefinirResponsavelTecnicoInput): Promise<void>;
};

export interface AcompanharStatusCarga {
    executar(input: AcompanharStatusCargaInput): Promise<StatusCarga>;
};

export interface BloquearCarga {
    executar(input: BloquearCargaInput): Promise<void>;
};

export interface LiberarCarga {
    executar(input: LiberarCargaInput): Promise<void>;
};

export interface ValidarRegrasSeguranca {
    executar(input: ValidarRegrasSegurancaInput): Promise<ResultadoValidacao>;
};