import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { intervaloSemana } from "./datas";
import type { Database } from "@/integrations/supabase/types";

export type Compromisso = Database["public"]["Tables"]["compromissos"]["Row"];
export type NovoCompromisso = Database["public"]["Tables"]["compromissos"]["Insert"];

export const semanaQuery = () =>
  queryOptions({
    queryKey: ["compromissos", "semana"],
    queryFn: async () => {
      const { inicio, fim } = intervaloSemana();
      const { data, error } = await supabase
        .from("compromissos")
        .select("*")
        .gte("data_hora", inicio.toISOString())
        .lt("data_hora", fim.toISOString())
        .order("data_hora");
      if (error) throw error;
      return data;
    },
  });

export async function salvarCompromisso(c: NovoCompromisso) {
  const { error } = c.id
    ? await supabase.from("compromissos").update(c).eq("id", c.id)
    : await supabase.from("compromissos").insert(c);
  if (error) throw error;
}

export async function excluirCompromisso(id: string) {
  const { error } = await supabase.from("compromissos").delete().eq("id", id);
  if (error) throw error;
}

export const OPCOES_AVISO = [
  { valor: 0, rotulo: "No horário" },
  { valor: 15, rotulo: "15 minutos antes" },
  { valor: 60, rotulo: "1 hora antes" },
  { valor: 1440, rotulo: "1 dia antes" },
];
