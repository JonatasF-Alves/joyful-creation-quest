import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { semanaQuery, type Compromisso } from "@/lib/compromissos";
import { agruparPorDia, hora } from "@/lib/datas";
import { FormCompromisso } from "@/components/FormCompromisso";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minha semana — Agenda da Sabrina" },
      { name: "description", content: "Os compromissos da Sabrina para os próximos 7 dias." },
      { property: "og:title", content: "Minha semana — Agenda da Sabrina" },
      { property: "og:description", content: "Os compromissos da Sabrina para os próximos 7 dias." },
    ],
  }),
  component: MinhaSemana,
});

function MinhaSemana() {
  const { data, isLoading } = useQuery(semanaQuery());
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Compromisso | null>(null);
  const grupos = agruparPorDia(data ?? []);

  const abrir = (c: Compromisso | null) => {
    setEditando(c);
    setAberto(true);
  };

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 pt-safe pb-32">
      <header className="flex items-start justify-between animate-surgir">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Minha semana</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Oi, Sabrina 💜</h1>
        </div>
        <Link to="/configuracoes" aria-label="Configurações" className="mt-2 rounded-full bg-secondary p-3 text-secondary-foreground">
          <Bell className="size-5" />
        </Link>
      </header>

      {isLoading ? (
        <div className="mt-12 space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}
        </div>
      ) : grupos.length === 0 ? (
        <div className="mt-20 text-center animate-surgir">
          <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-suave text-4xl">🌸</div>
          <h2 className="font-display text-2xl">Semana livre!</h2>
          <p className="mt-2 text-muted-foreground">Nenhum compromisso por aqui. Aproveite, ou toque no + para adicionar.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {grupos.map((g, i) => (
            <section key={g.rotulo} className="animate-surgir" style={{ animationDelay: `${i * 60}ms` }}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">{g.rotulo}</h2>
              <ul className="space-y-2">
                {g.itens.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => abrir(c)}
                      className={`flex w-full gap-4 rounded-2xl bg-card p-4 text-left transition-transform active:scale-[0.98] ${c.concluido ? "opacity-50" : ""}`}
                    >
                      <span className="w-12 shrink-0 pt-0.5 font-bold text-primary">{hora(c.data_hora)}</span>
                      <span className="min-w-0">
                        <span className={`block font-semibold ${c.concluido ? "line-through" : ""}`}>{c.titulo}</span>
                        {c.observacao && <span className="mt-0.5 block text-sm text-muted-foreground">{c.observacao}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <button
        onClick={() => abrir(null)}
        aria-label="Adicionar compromisso"
        className="fixed right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-suave transition-transform active:scale-90"
      >
        <Plus className="size-7" />
      </button>

      <FormCompromisso aberto={aberto} onFechar={() => setAberto(false)} compromisso={editando} />
    </main>
  );
}
