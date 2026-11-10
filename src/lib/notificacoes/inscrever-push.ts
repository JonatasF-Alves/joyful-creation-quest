import { supabase } from "@/integrations/supabase/client";
import { obterRegistro } from "./registrar-sw";

// Próxima etapa: chamar após ativarLembretes() quando houver chave VAPID pública
// e um envio agendado no servidor.
export async function inscreverPush(chaveVapidPublica: string) {
  const reg = await obterRegistro();
  if (!reg) return null;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ParaUint8(chaveVapidPublica),
  });
  const json = sub.toJSON();
  await supabase.from("inscricoes_push").insert({
    endpoint: sub.endpoint,
    p256dh: json.keys?.["p256dh"] ?? "",
    auth: json.keys?.["auth"] ?? "",
  });
  return sub;
}

function base64ParaUint8(base64: string) {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
