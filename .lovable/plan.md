# Agenda da Sabrina — app instalável no iPhone

## O que será construído
- **Minha semana** (página inicial): "Oi, Sabrina 💜", compromissos dos próximos 7 dias agrupados por dia (Hoje, Amanhã, Quarta-feira…), com horário, título e observação. Botão flutuante "+" e estado vazio carinhoso.
- **Novo / editar compromisso** (janela que sobe de baixo): título (obrigatório), data, hora, observação, "Avisar antes" (No horário, 15 min, 1 hora, 1 dia). Tocar num item abre a edição, com "Marcar como concluído" e "Excluir".
- **Configurações**: botão "Ativar lembretes" que só pede permissão após o toque, mostra o status (ativado / bloqueado / não ativado) e dispara a notificação de teste "Lembretes ativados! 💜".
- **Aviso iPhone**: se aberto no Safari (não instalado), mostra o passo a passo: "Toque em compartilhar → Adicionar à Tela de Início, depois abra o app pelo ícone e ative os lembretes". O botão de ativar fica desabilitado nesse caso.

## Visual
Minimalista, lilás/rosa claro, cantos arredondados, bastante espaço, modo escuro automático (segue o iPhone), animações discretas. Fontes: Fraunces (títulos) + Nunito (texto). Mobile-first, respeitando a área do notch.

## Dados (Lovable Cloud)
- Tabela `compromissos`: id, titulo, data_hora (timestamptz), observacao, aviso_antes_minutos, concluido, criado_em.
- Tabela `inscricoes_push`: id, endpoint, p256dh, auth, criado_em (uso futuro).
- Sem login, como pedido: qualquer pessoa com o link conseguiria ver/editar. Aceitável para uso pessoal; dá para adicionar login depois.

## Detalhes técnicos
- `public/manifest.json`: name "Agenda da Sabrina", display "standalone", start_url "/", theme/background lilás, ícones PNG 180x180 e 512x512 (gerados e salvos em `public/`).
- Head do `__root.tsx` (equivale ao index.html no TanStack Start): link manifest, `apple-mobile-web-app-capable`, `mobile-web-app-capable`, `apple-mobile-web-app-title`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon` (180), theme-color, viewport com `viewport-fit=cover`.
- `public/sw.js` escrito à mão (só push, sem cache): listeners `install`/`activate` (skipWaiting/claim), `push` (lê JSON {title, body} e chama `showNotification`), `notificationclick` (foca/abre o app). Sem cache offline, para não travar versões antigas.
- Registro do SW em `src/lib/notificacoes/registrar-sw.ts`, chamado num useEffect no root; não registra no preview do Lovable/iframe nem em dev (e remove registros antigos lá) — funciona no app publicado.
- Detecção de instalado: `navigator.standalone` ou `matchMedia('(display-mode: standalone)')`.
- Notificação de teste via `registration.showNotification` (exigido no iOS).
- Organização para a próxima etapa: `src/lib/notificacoes/` com `permissao.ts`, `registrar-sw.ts` e stub `inscrever-push.ts` (pushManager.subscribe + salvar em `inscricoes_push`, a ser ligado quando houver chave VAPID e envio agendado).
- Dados via TanStack Query + cliente do banco; funções de data em `src/lib/datas.ts` (agrupamento por dia, pt-BR) com teste unitário.
- Rotas: `/` (Minha semana) e `/configuracoes`, cada uma com título/descrição próprios.

Observação: notificações no iPhone só funcionam com o app publicado e aberto pelo ícone da tela inicial (iOS 16.4+).
