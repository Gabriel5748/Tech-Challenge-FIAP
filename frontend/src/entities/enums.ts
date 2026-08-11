export enum StatusCarga {
    Registrada = "registrada",
    EmValidacao = "em_validacao",
    EmInspecao = "em_inspecao",
    Bloqueada = "bloqueada",
    Liberada = "liberada",
    Cancelada = "cancelada",
}

export enum ClasseRisco {
    Baixa = "baixa",
    Media = "media",
    Alta = "alta",
}

export enum StatusDocumento {
    Pendente = "pendente",
    Anexado = "anexado",
    Validado = "validado",
}

export enum ResultadoInspecao {
    Pendente = "pendente",
    Aprovado = "aprovado",
    Reprovado = "reprovado",
}

export enum StatusUsuario {
    Ativo = "ativo",
    Inativo = "inativo",
}
