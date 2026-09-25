import { SistemaState } from "./types";

export const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function todayISO(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function ymd(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 86400000);
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function at(offsetDays: number, hh: number, mm: number): string {
  const day = ymd(offsetDays);
  return `${day}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00-03:00`;
}

export function shiftMin(mins: number): string {
  return new Date(Date.now() + mins * 60000).toISOString();
}

export function backupStamp(): string {
  try {
    const hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        hourCycle: "h23",
      }).format(new Date())
    );
    const day = hour < 3 ? ymd(-1) : ymd(0);
    return `${day}T03:00:00-03:00`;
  } catch {
    return `${ymd(0)}T03:00:00-03:00`;
  }
}

export function shortDate(iso?: string): string {
  if (!iso) return "—";
  const p = iso.split("-");
  if (p.length < 3) return iso;
  return `${p[2]} ${MONTHS[Number(p[1]) - 1]}`;
}

export function rel(iso?: string): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const min = Math.floor((Date.now() - t) / 60000);
  if (min < 1) return "agora";
  if (min < 60) return "há " + min + " min";
  const today = todayISO();
  const day = iso.slice(0, 10);
  const y = ymd(-1);
  if (day === today) return "há " + Math.floor(min / 60) + "h";
  if (day === y) return "ontem";
  const days = Math.max(
    1,
    Math.round(
      (new Date(today + "T12:00:00-03:00").getTime() -
        new Date(day + "T12:00:00-03:00").getTime()) /
        86400000
    )
  );
  return "há " + days + " dias";
}

export function weekday(iso?: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
  }).format(new Date(iso + "T12:00:00-03:00"));
}

export function headerDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export function clockNow(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function stamp(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
  })
    .format(d)
    .replace(".", "");
  const hm = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return day + " · " + hm;
}

export function buildSeed(): SistemaState {
  const today = todayISO();
  return {
    version: 1,
    seededAt: new Date().toISOString(),
    profile: {
      name: "Victor",
      workspace: "Victor Hub AI",
      role: "Owner",
      version: "v1.0",
      objective:
        "Entregar sistemas, interfaces e automações que vendem — com o estúdio inteiro no mesmo cockpit.",
      whatsapp: "5516982141822",
      city: "Franca, SP",
      domain: "",
    },
    prefs: {
      density: "operational",
      alerts: true,
      reduceMotion: false,
      mode: "operacional",
    },
    funnel: { qualificados: 8, propostas: 4, negociacoes: 3, fechamentos: 2 },
    integrations: {
      openai: { status: "pronta", hint: "" },
      github: { status: "operacional", hint: "Snapshot noturno ativo" },
      n8n: { status: "operacional", hint: "Stripe Sync monitorado" },
      stripe: { status: "requer", hint: "Webhook com assinatura inválida" },
    },
    clients: [
      {
        id: "camila",
        name: "Camila Rocha",
        initials: "CR",
        company: "Prime Real Estate",
        email: "camila@prime.com",
        phone: "+55 16 98810-2201",
        stage: "negociacao",
        value: 48000,
        contactAt: at(-3, 11, 20),
        nextAction:
          "Enviar a proposta do Portal Lux hoje, às 17:00 — tom sóbrio, hero 3D, sem estoque genérico.",
        projectId: "lux",
        notes:
          "Decide com o sócio. Quer referência de portal imobiliário de alto padrão, luz baixa e tipografia editorial. Sensível a prazo de kickoff.",
        timeline: [
          {
            at: at(-3, 11, 20),
            text: "Enviou referências de portais em Dubai e pediu um tom mais sóbrio no hero.",
          },
          {
            at: at(-6, 15, 0),
            text: "Call de descoberta: 40 unidades, prioridade no mapa e no tour 3D.",
          },
          {
            at: at(-12, 9, 40),
            text: "Lead qualificado entrou pelo formulário do site.",
          },
        ],
      },
      {
        id: "rafael",
        name: "Rafael Lima",
        initials: "RL",
        company: "Startup Venture",
        email: "rafael@startupventure.io",
        phone: "+55 11 97620-4410",
        stage: "proposta",
        value: 12000,
        contactAt: at(-1, 18, 40),
        nextAction:
          "Ajustar a objeção da dobra 2 e pedir a aprovação final até sexta.",
        projectId: "alpha",
        notes:
          "Pagou a primeira parcela. Trava em adjetivo vazio — quer resultado concreto, não 'revolucione'.",
        timeline: [
          {
            at: at(-1, 18, 40),
            text: "Pediu troca da frase da dobra 2 antes de aprovar.",
          },
          {
            at: at(-6, 10, 15),
            text: "Pagou R$ 6.000 da parcela inicial da landing.",
          },
          {
            at: at(-14, 16, 0),
            text: "Aprovou a direção visual da Alpha AI.",
          },
        ],
      },
      {
        id: "marina",
        name: "Marina Costa",
        initials: "MC",
        company: "Nexus Systems",
        email: "marina@nexussystems.com",
        phone: "+55 11 99104-7782",
        stage: "ativo",
        value: 24500,
        contactAt: shiftMin(-120),
        nextAction:
          "Fechar a animação do hero e mandar o draft v2 na segunda.",
        projectId: "nexus",
        notes:
          "Cliente ativo e exigente com motion. O glow vermelho não pode competir com a marca Nexus.",
        timeline: [
          {
            at: shiftMin(-120),
            text: "Cobrou o hero animado para liberar o draft v2 do site.",
          },
          {
            at: at(-4, 14, 10),
            text: "Validou paleta e tipografia do rebranding.",
          },
          {
            at: at(-16, 11, 0),
            text: "Kickoff Nexus OS — escopo de identidade + site v2.",
          },
        ],
      },
    ],
    projects: [
      {
        id: "lux",
        letter: "P",
        name: "Portal Imobiliário Lux",
        clientId: "camila",
        status: "descoberta",
        progress: 15,
        value: 48000,
        paid: 0,
        milestone: "Kickoff 3D",
        deadline: ymd(8),
        critical: false,
        stack: ["Next.js", "Three.js", "Figma"],
        brief:
          "Portal de alto padrão para a Prime Real Estate. Mapa de empreendimentos, ficha de unidade, tour e captação de lead qualificado. A descoberta ainda trava no tom: luz baixa, tipografia editorial, zero banco de imagem genérico.",
        notes:
          "Proposta sai hoje às 17:00. Não prometer o hero 3D completo no kickoff — prometer direção, enquadramento e uma cena de prova.",
        milestones: [
          { id: "l1", title: "Briefing comercial e inventário", done: true },
          { id: "l2", title: "Proposta e escopo fechado", done: false },
          { id: "l3", title: "Kickoff 3D", done: false },
          { id: "l4", title: "Mapa de empreendimentos", done: false },
          { id: "l5", title: "Captação de lead no portal", done: false },
        ],
      },
      {
        id: "alpha",
        letter: "L",
        name: "Landing Page Alpha AI",
        clientId: "rafael",
        status: "revisao",
        progress: 92,
        value: 12000,
        paid: 6000,
        milestone: "Aprovação final",
        deadline: ymd(2),
        critical: false,
        stack: ["Next.js", "Copy", "Motion"],
        brief:
          "Landing de conversão para a Startup Venture. Copy em revisão final, prova e CTA de demo. Falta a aprovação do Rafael e o ajuste de uma objeção na dobra 2.",
        notes:
          "Trocar 'revolucione sua operação' por um resultado numerado. Rafael responde melhor no fim da tarde.",
        milestones: [
          { id: "a1", title: "Wireframe de conversão", done: true },
          { id: "a2", title: "Copy v1", done: true },
          { id: "a3", title: "Design e motion", done: true },
          { id: "a4", title: "Ajuste da dobra 2", done: false },
          { id: "a5", title: "Aprovação final e publicação", done: false },
        ],
      },
      {
        id: "nexus",
        letter: "N",
        name: "Nexus OS — Rebranding",
        clientId: "marina",
        status: "producao",
        progress: 65,
        value: 24500,
        paid: 12250,
        milestone: "Draft v2 do site",
        deadline: ymd(4),
        critical: true,
        stack: ["Next.js", "Three.js", "Brand"],
        brief:
          "Rebranding do produto Nexus OS: identidade, sistema visual e site v2. O draft está bloqueado pela animação do hero. Marina quer presença, não espetáculo — o glow vermelho entra contido.",
        notes:
          "Crítico. Se o hero não fechar até sexta, o draft v2 escorrega e a parcela 2 fica desconfortável.",
        milestones: [
          { id: "n1", title: "Direção de marca", done: true },
          { id: "n2", title: "Design system", done: true },
          { id: "n3", title: "Hero animado", done: false },
          { id: "n4", title: "Draft v2 do site", done: false },
          { id: "n5", title: "Handoff e publicação", done: false },
        ],
      },
    ],
    tasks: [
      {
        id: "t-hero",
        title: "Finalizar animação do hero Nexus",
        projectId: "nexus",
        tag: "Nexus OS",
        priority: "alta",
        time: "10:30",
        block: "manha",
        date: today,
        done: false,
        order: 2,
        detail:
          "Glow contido, loop de 8s, peso leve o bastante para o hero não atrasar o LCP. Exportar mp4 de prova e o componente.",
      },
      {
        id: "t-stripe",
        title: "Debug Webhook Stripe → Discord",
        projectId: null,
        automationId: "stripe",
        tag: "Automação interna",
        priority: "critica",
        time: "12:00",
        block: "manha",
        date: today,
        done: false,
        order: 1,
        detail:
          "A assinatura do webhook está falhando por drift de timestamp. Conferir segredo no n8n, tolerância de 300s e o canal #pagamentos.",
      },
      {
        id: "t-copy",
        title: "Revisar copy da Alpha AI",
        projectId: "alpha",
        tag: "Alpha AI",
        priority: "media",
        time: "14:30",
        block: "tarde",
        date: today,
        done: false,
        order: 4,
        detail:
          "Dobra 2: tirar adjetivo vazio, colocar o resultado da demo em uma frase. Mandar para o Rafael ainda hoje.",
      },
      {
        id: "t-proposta",
        title: "Preparar proposta Portal Lux",
        projectId: "lux",
        tag: "Prime Real Estate",
        priority: "alta",
        time: "17:00",
        block: "tarde",
        date: today,
        done: false,
        order: 3,
        detail:
          "Escopo em três fases, investimento de R$ 48.000, kickoff 3D como marco — não como entrega final. Tom sóbrio.",
      },
      {
        id: "t-pub",
        title: "Publicar Alpha AI após aprovação",
        projectId: "alpha",
        tag: "Alpha AI",
        priority: "alta",
        time: "11:00",
        block: "manha",
        date: ymd(2),
        done: false,
        order: 5,
        detail:
          "Só publicar com o ok escrito do Rafael. Conferir meta, evento de lead e velocidade.",
      },
      {
        id: "t-draft",
        title: "Entregar draft v2 do Nexus",
        projectId: "nexus",
        tag: "Nexus OS",
        priority: "critica",
        time: "16:00",
        block: "tarde",
        date: ymd(4),
        done: false,
        order: 6,
        detail:
          "Site v2 com hero aprovado, páginas de produto e handoff comentado.",
      },
      {
        id: "t-kick",
        title: "Kickoff 3D Portal Lux",
        projectId: "lux",
        tag: "Prime Real Estate",
        priority: "alta",
        time: "10:00",
        block: "manha",
        date: ymd(8),
        done: false,
        order: 7,
        detail:
          "Uma cena de prova, enquadramento e lista do que a Prime precisa entregar de inventário.",
      },
    ],
    automations: [
      {
        id: "backup",
        name: "Backup diário de projetos",
        platform: "GitHub",
        status: "ativa",
        runs: 91,
        lastRun: backupStamp(),
        successRate: 100,
        avg: "42s",
        summary:
          "Fluxo operacional conectado ao seu ecossistema. Histórico e estado ficam registrados no Hub.",
        trigger: "Cron diário (03:00 UTC)",
        destination: "S3 / Cloudflare R2",
        nodes: [
          { icon: "bolt", label: "Agenda 03:00" },
          { icon: "box", label: "Snapshot GitHub" },
          { icon: "db", label: "Registro no Hub" },
        ],
        fixes: null,
        logs: [
          {
            at: backupStamp(),
            status: "ok",
            ok: true,
            text: "Snapshot concluído · 3 repositórios · main protegida",
            msg: "Snapshot concluído · 3 repositórios · main protegida",
          },
          {
            at: at(-1, 3, 0),
            status: "ok",
            ok: true,
            text: "Snapshot concluído · sem divergência",
            msg: "Snapshot concluído · sem divergência",
          },
          {
            at: at(-2, 3, 0),
            status: "ok",
            ok: true,
            text: "Snapshot concluído · tag noturna criada",
            msg: "Snapshot concluído · tag noturna criada",
          },
        ],
      },
      {
        id: "lead",
        name: "Lead Form → CRM Pipeline",
        platform: "Make",
        status: "ativa",
        runs: 526,
        lastRun: shiftMin(-21),
        successRate: 99.4,
        avg: "6s",
        summary:
          "Todo lead do site entra qualificado no radar, com origem, interesse e próxima ação.",
        trigger: "Webhook de Formulário",
        destination: "Victor Hub CRM + Telegram",
        nodes: [
          { icon: "form", label: "Formulário" },
          { icon: "filter", label: "Qualificar" },
          { icon: "users", label: "Card no CRM" },
        ],
        fixes: null,
        logs: [
          {
            at: shiftMin(-21),
            status: "ok",
            ok: true,
            text: "Lead qualificado · interesse em landing · origem Instagram",
            msg: "Lead qualificado · interesse em landing · origem Instagram",
          },
          {
            at: shiftMin(-46),
            status: "ok",
            ok: true,
            text: "Lead qualificado · interesse em sistema · origem indicação",
            msg: "Lead qualificado · interesse em sistema · origem indicação",
          },
          {
            at: at(-1, 21, 12),
            status: "ok",
            ok: true,
            text: "Lead descartado · fora de escopo, registrado mesmo assim",
            msg: "Lead descartado · fora de escopo, registrado mesmo assim",
          },
        ],
      },
      {
        id: "stripe",
        name: "Stripe Sync → Discord Notify",
        platform: "n8n",
        status: "atencao",
        runs: 1842,
        lastRun: shiftMin(-30),
        successRate: 97.1,
        avg: "3s",
        summary:
          "Pagamento confirmado deveria avisar o #pagamentos e lançar o recebimento no financeiro. A última leva falhou na assinatura.",
        trigger: "Stripe Webhook (checkout.session.completed)",
        destination: "Discord Webhook Bot",
        nodes: [
          { icon: "card", label: "Evento Stripe" },
          { icon: "shield", label: "Validar assinatura", warn: true },
          { icon: "chat", label: "Discord" },
        ],
        error:
          "Assinatura do webhook rejeitada · timestamp fora da tolerância de 300s.",
        fixes: { secret: false, tolerance: false, channel: false },
        logs: [
          {
            at: shiftMin(-30),
            status: "erro",
            ok: false,
            text: "401 · assinatura inválida · evt_3NexusParcel",
            msg: "401 · assinatura inválida · evt_3NexusParcel",
          },
          {
            at: shiftMin(-80),
            status: "erro",
            ok: false,
            text: "401 · timestamp drift +418s · evt_retry",
            msg: "401 · timestamp drift +418s · evt_retry",
          },
          {
            at: at(-1, 19, 4),
            status: "ok",
            ok: true,
            text: "invoice.paid notificado em #pagamentos",
            msg: "invoice.paid notificado em #pagamentos",
          },
        ],
      },
    ],
    arsenal: [
      {
        id: "vsl",
        type: "prompt",
        version: "v3.2",
        star: false,
        name: "Prompt: Copywriter VSL",
        summary: "Framework para roteiros de vendas de alta conversão.",
        tags: ["COPY", "AI"],
        uses: 215,
        body: `Você é o copywriter de estúdio do Victor Hub AI. Escreve em português do Brasil, sem jargão americano traduzido e sem promessa que o produto não sustenta.

Objetivo: roteiro de VSL ou página de vendas para {{oferta}}, público {{quem}}, transformação {{resultado}}.

Estrutura obrigatória:
1. Gancho de tensão — uma cena concreta, não um slogan.
2. Identificação — o leitor se reconhece em 4 linhas.
3. Problema ampliado — o custo de continuar igual, em operação e não em medo.
4. Virada — o que mudou na forma de resolver.
5. Mecanismo único — por que este método, com nome próprio.
6. Prova — número, antes/depois ou processo visível. Sem depoimento genérico.
7. Oferta — o que entra, o que não entra, em quanto tempo.
8. Objeções — preço, prazo, "já tentei". Resposta curta.
9. CTA — um verbo, um destino.
10. Urgência ética — só se for real (vaga, janela, lote).

Regras:
- Frases curtas. Uma ideia por bloco.
- Proibido: revolucione, disruptivo, solução completa, alavanque.
- Cada bloco termina com o que o leitor deve sentir, não com um adjetivo.
- Entregue o roteiro e, no fim, 3 variações de headline.`,
      },
      {
        id: "shader",
        type: "componente",
        version: "v0.8",
        star: false,
        name: "Shader: Red Glow Mesh",
        summary: "Fundo Three.js dinâmico com mesh noise e glow vermelho.",
        tags: ["THREE.JS"],
        uses: 15,
        body: `// Red Glow Mesh — fundo de marca Victor Hub
// Three.js ShaderMaterial · fragment
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 p = vUv - 0.5;
  float d = length(p - (uMouse - 0.5) * 0.25);
  float wave = sin(p.x * 14.0 + uTime) * cos(p.y * 10.0 - uTime * 0.7);
  float mesh = smoothstep(0.45, 0.0, abs(fract((p.y + wave * 0.04) * 18.0) - 0.5));
  vec3 base = vec3(0.02, 0.02, 0.02);
  vec3 red = vec3(0.937, 0.137, 0.235);
  float glow = exp(-d * 3.2) * 0.55;
  vec3 color = base + red * (glow + mesh * 0.18);
  gl_FragColor = vec4(color, 1.0);
}

Uso: plano 1.6x maior que o viewport, wireframe desligado, opacity no material se for overlay.
Não deixar o glow competir com headline branca — o pico fica atrás do terço direito.`,
      },
      {
        id: "saas",
        type: "template",
        version: "v1.0",
        star: false,
        name: "Landing Page: SaaS Minimal",
        summary: "Base premium de landing page focada em conversão.",
        tags: ["UI/UX"],
        uses: 42,
        body: `Arquitetura da landing — SaaS Minimal

1. Nav em pílula, uma ação: entrar ou falar.
2. Hero: prova de disponibilidade, headline de resultado, sub de quem faz, dois CTAs, faixa de stack.
3. Moldura do produto — o sistema aparece antes da lista de serviços.
4. Quatro serviços, não doze. Cada um com uma consequência comercial.
5. Como funciona em três passos, tempo visível.
6. Faixa de posicionamento e garantia técnica.
7. Três planos. O do meio é o caminho. Os lados existem para ancorar.
8. CTA final com o sistema e o WhatsApp. Sem formulário longo.
9. Footer de uma linha. Ano, marca, acesso.

Conversão:
- Um único verbo por dobra.
- Preço visível. Esconder preço empurra a conversa para quem não compra.
- Motion só no hero e em um estado de hover. O resto é silêncio.
- Mobile: CTA primário permanece alcançável sem menu.`,
      },
      {
        id: "agent",
        type: "agente",
        version: "v2.1",
        star: true,
        name: "Agente: Arquiteto Fullstack",
        summary: "Especialista em Next.js, arquitetura e sistemas escaláveis.",
        tags: ["AI", "DEV"],
        uses: 128,
        body: `Você é o arquiteto de software do Victor Hub AI. Revisa e desenha sistemas web em Next.js, com código que um estúdio de uma pessoa consegue operar com facilidade.

Quando receber um pedido:
1. Diga o que o sistema precisa ser — não a stack primeiro.
2. Separe superfície, domínio e integrações.
3. Escolha o caminho mais simples que ainda aguenta o dobro do uso atual.
4. Aponte o risco real: dado, dinheiro, prazo, acoplamento.
5. Entregue estrutura de pastas, contratos de dados e a primeira fatia implementável.

Padrões do estúdio:
- App Router, servidor na borda só quando há motivo.
- Estado de negócio explícito, não espalhado em componentes.
- Integração externa atrás de um adaptador com log.
- Nada de abstração para um segundo cliente que não existe.
- UI escura de cockpit só se o produto for operacional. Marketing respira.

Responda em português, direto, com decisões nomeadas e o que ficou de fora de propósito.`,
      },
      {
        id: "brief",
        type: "prompt",
        version: "v1.4",
        star: false,
        name: "Prompt: Briefing de Descoberta",
        summary: "Extrai escopo, risco e próxima ação de uma call comercial.",
        tags: ["COPY", "AI"],
        uses: 64,
        body: `Transforme a transcrição abaixo em um briefing de descoberta operacional.

Devolva:
- Cliente, empresa, decisor e quem mais opina
- O que ele quer que exista daqui a 30 dias
- O que ele disse que quer, mas na verdade está evitando
- Restrições: prazo, marca, inventário, política
- Escopo recomendado em fases
- O que não vender agora
- Próxima ação, dono e data
- Uma frase de proposta, sem adjetivo vazio

Transcrição:
{{colar aqui}}`,
      },
      {
        id: "proposta",
        type: "template",
        version: "v1.2",
        star: false,
        name: "Template: Proposta Comercial",
        summary: "Estrutura de proposta em três fases, com marco e investimento.",
        tags: ["COPY"],
        uses: 37,
        body: `Proposta — {{projeto}} · {{cliente}}

1. Leitura
O que entendi do negócio em 5 linhas. Sem repetir o site deles.

2. Direção
A decisão criativa. Uma só. O que isso muda na percepção.

3. Fases
Fase 1 — Descoberta e prova. Marco visível.
Fase 2 — Produção. O que entra no ar.
Fase 3 — Ajuste com dado real. Janela curta.

4. Investimento
Valor total: {{valor}}, parcelas, o que dispara cada uma.
O que não está incluso, em uma lista curta.

5. Próximo passo
Uma call de kickoff com pauta, não um "me avisa".

Tom: sóbrio, específico, seguro. Preço na mesma página do escopo.`,
      },
    ],
    movements: [
      {
        id: "m-tools",
        title: "Ferramentas e infraestrutura",
        kind: "saida",
        amount: 1380,
        status: "pago",
        cadence: "mensal",
        date: `${ymd(0).slice(0, 8)}01`,
        note: "Figma, hosting, domínio e APIs do estúdio.",
      },
      {
        id: "m-alpha",
        title: "Alpha AI — parcela 1",
        kind: "entrada",
        amount: 6000,
        status: "recebido",
        cadence: "pontual",
        date: ymd(-6),
        projectId: "alpha",
        note: "Entrada confirmada. Saldo na aprovação.",
      },
      {
        id: "m-nexus",
        title: "Nexus OS — parcela 2",
        kind: "entrada",
        amount: 12250,
        status: "previsto",
        cadence: "pontual",
        date: ymd(6),
        projectId: "nexus",
        note: "Dispara com o draft v2 aceito.",
      },
      {
        id: "m-alpha2",
        title: "Alpha AI — saldo de aprovação",
        kind: "entrada",
        amount: 6000,
        status: "previsto",
        cadence: "pontual",
        date: ymd(2),
        projectId: "alpha",
        note: "Segunda metade, após o ok do Rafael.",
      },
    ],
    pulse: [2400, 1800, 4200, 900, 3100, 5600, 2200, 6000],
    activity: [
      { at: shiftMin(-120), text: "Marina cobrou o hero do Nexus OS." },
      { at: shiftMin(-12), text: "Stripe Sync falhou na assinatura do webhook." },
      { at: at(-1, 18, 40), text: "Rafael devolveu a copy da Alpha AI." },
    ],
  };
}
