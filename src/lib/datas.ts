export type ComData = { data_hora: string };

const DIAS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function inicioDoDia(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function rotuloDoDia(dia: Date, hoje: Date): string {
  const diff = Math.round((inicioDoDia(dia).getTime() - inicioDoDia(hoje).getTime()) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  return DIAS[dia.getDay()] ?? "";
}

export function agruparPorDia<T extends ComData>(itens: T[], hoje = new Date()) {
  const grupos = new Map<string, { rotulo: string; data: Date; itens: T[] }>();
  [...itens]
    .sort((a, b) => a.data_hora.localeCompare(b.data_hora))
    .forEach((it) => {
      const d = new Date(it.data_hora);
      const chave = inicioDoDia(d).toISOString();
      if (!grupos.has(chave)) grupos.set(chave, { rotulo: rotuloDoDia(d, hoje), data: inicioDoDia(d), itens: [] });
      grupos.get(chave)!.itens.push(it);
    });
  return [...grupos.values()];
}

export function intervaloSemana(hoje = new Date()) {
  const inicio = inicioDoDia(hoje);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 7);
  return { inicio, fim };
}

export const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
