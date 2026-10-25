"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificadorService = exports.SMSNotificador = exports.NotificadorService = exports.EmailNotificador = void 0;
class NotificadorService {
    notificador;
    constructor(notificador) {
        this.notificador = notificador;
    }
    enviar(mensagem) {
        return this.notificador.enviarNotificacao(mensagem);
    }
}
exports.NotificadorService = NotificadorService;
class EmailNotificador {
    enviarNotificacao(mensagem) {
        return `Enviando notificação por e-mail: ${mensagem}`;
    }
}
exports.EmailNotificador = EmailNotificador;
class SMSNotificador {
    enviarNotificacao(mensagem) {
        return `Enviando notificação por SMS: ${mensagem}`;
    }
}
exports.SMSNotificador = SMSNotificador;
exports.notificadorService = new NotificadorService(new SMSNotificador());
