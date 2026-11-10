import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ativarLembretes, estaInstalado, statusAtual, type StatusLembretes } from "@/lib/notificacoes/permissao";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Agenda da Sabrina" },
      { name: "description", content: "Ative os lembretes da Agenda da Sabrina." },
      { property: "og:title", content: "Configurações — Agenda da Sabrina" },
      { property: "og:description", content: "Ative os lembretes da Agenda da Sabrina." },
    ],
  }),
  component: Configuracoes,
});

const TEXTOS: Record<StatusLembretes, string> = {
  ativado: "Ativados 💜",
  bloqueado: "Bloqueados nos Ajustes do iPhone",
  desativado: "Desativados",
  indisponivel: "Indisponíveis neste navegador",
};

function Configuracoes() {
  const [instalado, setInstalado] = useState<boolean | null>(null);
  const [status, setStatus] = useState<StatusLembretes>("desativado");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setInstalado(estaInstalado());
    setStatus(statusAtual());
  }, []);

  async function aoTocar() {
    setCarregando(true);
    try {
      setStatus(await ativarLembretes());
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 pt-safe pb-safe">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <ArrowLeft className="size-4" /> Minha semana
      </Link>
      <h1 className="mt-4 font-display text-4xl font-semibold">Configurações</h1>

      <section className="mt-8 rounded-3xl bg-card p-6 animate-surgir">
        <h2 className="font-display text-xl">Lembretes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Status: <strong className="text-foreground">{TEXTOS[status]}</strong>
        </p>

        {instalado === false && (
          <div className="mt-5 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
            <p className="font-semibold">Para receber lembretes no iPhone:</p>
            <p className="mt-1 leading-relaxed">
              Toque em compartilhar <Share className="inline size-4 align-text-bottom" /> → Adicionar à Tela de Início,
              depois abra o app pelo ícone e ative os lembretes.
            </p>
          </div>
        )}

        <Button
          onClick={aoTocar}
          disabled={!instalado || carregando || status === "ativado" || status === "indisponivel"}
          className="mt-5 h-12 w-full rounded-xl text-base"
        >
          {status === "ativado" ? "Lembretes ativados" : "Ativar lembretes"}
        </Button>
      </section>
    </main>
  );
}
