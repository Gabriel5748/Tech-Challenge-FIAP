import { notificadorService } from "../../services/NotificadorService.ts";

export class EnviarMensagem {
  execute(conteudo: string) {
    return notificadorService.enviar(conteudo);
  }
}
