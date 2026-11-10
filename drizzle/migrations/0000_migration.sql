CREATE TABLE public.compromissos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  data_hora timestamptz NOT NULL,
  observacao text,
  aviso_antes_minutos integer NOT NULL DEFAULT 0,
  concluido boolean NOT NULL DEFAULT false,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compromissos TO anon, authenticated;
GRANT ALL ON public.compromissos TO service_role;
ALTER TABLE public.compromissos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acesso publico compromissos" ON public.compromissos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.inscricoes_push (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inscricoes_push TO anon, authenticated;
GRANT ALL ON public.inscricoes_push TO service_role;
ALTER TABLE public.inscricoes_push ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inserir inscricao" ON public.inscricoes_push FOR INSERT TO anon, authenticated WITH CHECK (true);