import { Notificador } from "../src/domain/interfaces/interfaceNotificador";

class NotificadorService {
  constructor(private notificador: Notificador) {}

  enviar(mensagem: string | string[]): string {
    return this.notificador.enviarNotificacao(mensagem);
  }
}

class EmailNotificador implements Notificador {
  enviarNotificacao(mensagem: string | string[]): string {
    return `Enviando notificação por e-mail: ${mensagem}`;
  }
}

class SMSNotificador implements Notificador {
  enviarNotificacao(mensagem: string | string[]): string {
    return `Enviando notificação por SMS: ${mensagem}`;
  }
}

export { EmailNotificador, NotificadorService, SMSNotificador };

export const notificadorService = new NotificadorService(new SMSNotificador());
