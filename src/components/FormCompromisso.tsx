import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  OPCOES_AVISO,
  excluirCompromisso,
  salvarCompromisso,
  type Compromisso,
} from "@/lib/compromissos";

const pad = (n: number) => String(n).padStart(2, "0");
const dataLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const horaLocal = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

type Props = { aberto: boolean; onFechar: () => void; compromisso: Compromisso | null };

export function FormCompromisso({ aberto, onFechar, compromisso }: Props) {
  const qc = useQueryClient();
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [horaV, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [aviso, setAviso] = useState(15);

  useEffect(() => {
    if (!aberto) return;
    const base = compromisso ? new Date(compromisso.data_hora) : new Date(Date.now() + 3600000);
    if (!compromisso) base.setMinutes(0);
    setTitulo(compromisso?.titulo ?? "");
    setData(dataLocal(base));
    setHora(horaLocal(base));
    setObs(compromisso?.observacao ?? "");
    setAviso(compromisso?.aviso_antes_minutos ?? 15);
  }, [aberto, compromisso]);

  const atualizar = () => qc.invalidateQueries({ queryKey: ["compromissos"] });

  const salvar = useMutation({
    mutationFn: salvarCompromisso,
    onSuccess: () => {
      atualizar();
      toast.success(compromisso ? "Compromisso atualizado 💜" : "Compromisso salvo 💜");
      onFechar();
    },
    onError: () => toast.error("Não consegui salvar. Tenta de novo?"),
  });

  const excluir = useMutation({
    mutationFn: excluirCompromisso,
    onSuccess: () => {
      atualizar();
      toast("Compromisso excluído");
      onFechar();
    },
  });

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.error("Dá um título pro compromisso 😊");
      return;
    }
    salvar.mutate({
      ...(compromisso ? { id: compromisso.id } : {}),
      titulo: titulo.trim(),
      data_hora: new Date(`${data}T${horaV}`).toISOString(),
      observacao: obs.trim() || null,
      aviso_antes_minutos: aviso,
    });
  }

  return (
    <Drawer open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DrawerContent className="mx-auto max-w-lg">
        <DrawerHeader>
          <DrawerTitle className="font-display text-2xl">
            {compromisso ? "Editar compromisso" : "Novo compromisso"}
          </DrawerTitle>
        </DrawerHeader>
        <form onSubmit={enviar} className="space-y-5 overflow-y-auto px-5 pb-safe">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Dentista" className="h-12 rounded-xl text-base" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" required value={data} onChange={(e) => setData(e.target.value)} className="h-12 rounded-xl text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input id="hora" type="time" required value={horaV} onChange={(e) => setHora(e.target.value)} className="h-12 rounded-xl text-base" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observação</Label>
            <Textarea id="obs" value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Opcional" className="rounded-xl text-base" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Avisar antes</Label>
            <div className="grid grid-cols-2 gap-2">
              {OPCOES_AVISO.map((o) => (
                <button
                  type="button"
                  key={o.valor}
                  onClick={() => setAviso(o.valor)}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                    aviso === o.valor ? "border-primary bg-secondary text-secondary-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  {o.rotulo}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={salvar.isPending} className="h-12 w-full rounded-xl text-base">
            Salvar
          </Button>
          {compromisso && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-xl"
                onClick={() => salvar.mutate({ ...compromisso, concluido: !compromisso.concluido })}
              >
                <Check /> {compromisso.concluido ? "Reabrir" : "Concluído"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-xl text-destructive"
                onClick={() => confirm("Excluir este compromisso?") && excluir.mutate(compromisso.id)}
              >
                <Trash2 /> Excluir
              </Button>
            </div>
          )}
        </form>
      </DrawerContent>
    </Drawer>
  );
}
