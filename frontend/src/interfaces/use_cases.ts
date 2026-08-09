export interface CadastrarProdutoQuimico {
    executar(input: CadastrarProdutoQuimicoInput): Promise<void>;
};

export interface RegistrarCargaQuimica {
    executar(input: RegistrarCargaQuimicaInput): Promise<void>;
};

export interface AssociarCargaProduto {
    executar(input: AssociarCargaProdutoInput): Promise<void>;
};

export interface InformarClassificacaoRisco {
    executar(input: InformarClassificacaoRiscoInput): Promise<void>;
};

export interface RegistrarDocumentacao {
    executar(input: RegistrarDocumentacaoInput): Promise<void>;
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