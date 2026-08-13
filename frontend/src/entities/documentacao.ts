import type { StatusDocumento } from "./enums.js";

export class DocumentoCarga {
    id: number;
    tipo: string;
    status: StatusDocumento;
    dataAnexacao?: Date;

    constructor(id: number, tipo: string, status: StatusDocumento = StatusDocumento.Pendente, dataAnexacao?: Date) {
        if (!tipo?.trim()) {
            throw new Error("Tipo de documento é obrigatório.");
        }

        this.id = id;
        this.tipo = tipo;
        this.status = status;
        this.dataAnexacao = dataAnexacao;
    }

    anexar(data: Date): void {
        if (!data) {
            throw new Error("Data de anexação deve ser informada.");
        }

        this.status = StatusDocumento.Anexado;
        this.dataAnexacao = data;
    }

    validar(): void {
        if (this.status !== StatusDocumento.Anexado) {
            throw new Error("Somente documentos anexados podem ser validados.");
        }

        this.status = StatusDocumento.Validado;
    }
}
