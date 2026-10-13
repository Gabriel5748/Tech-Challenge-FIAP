export interface Notificador {
  enviarNotificacao(mensagem: string | string[]): string;
}
