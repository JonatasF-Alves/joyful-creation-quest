import { obterRegistro } from "./registrar-sw";

export type StatusLembretes = "ativado" | "bloqueado" | "desativado" | "indisponivel";

export function estaInstalado(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
}

export function statusAtual(): StatusLembretes {
  if (!("Notification" in window)) return "indisponivel";
  if (Notification.permission === "granted") return "ativado";
  if (Notification.permission === "denied") return "bloqueado";
  return "desativado";
}

/** Deve ser chamada APENAS a partir de um toque do usuário. */
export async function ativarLembretes(): Promise<StatusLembretes> {
  if (!("Notification" in window)) return "indisponivel";
  const resultado = await Notification.requestPermission();
  if (resultado !== "granted") return statusAtual();
  const reg = await obterRegistro();
  const titulo = "Lembretes ativados! 💜";
  const opcoes = { body: "Vou te avisar dos seus compromissos.", icon: "/icon-192.png" };
  if (reg) await reg.showNotification(titulo, opcoes);
  else new Notification(titulo, opcoes);
  return "ativado";
}
