export interface Projeto {
  id: string;
  nome: string;
  cliente: string;
  fase: "Descoberta" | "Produção" | "Revisão" | "Concluído";
  faseCor: string;
  progresso: number;
  proximaEntrega: string;
  dataEntrega: string;
  valor: string;
  descricao: string;
  tags: string[];
}

export interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  whatsapp: string;
  status: "Ativo" | "Proposta" | "Lead Qualificado" | "Fechado";
  valorContrato: string;
  ultimoContato: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  projeto: string;
  horario: string;
  prioridade: "crítica" | "alta" | "média" | "baixa";
  concluida: boolean;
}

export interface Automacao {
  id: string;
  nome: string;
  status: "Ativa" | "Atenção" | "Pausada";
  statusCor: string;
  descricao: string;
  ultimaExecucao: string;
  totalExecucoes: number;
  gatilho: string;
  destino: string;
}

export interface ItemArsenal {
  id: string;
  titulo: string;
  tipo: "Prompt" | "Componente" | "Template" | "Agente";
  categoria: string;
  usos: number;
  descricao: string;
  conteudo: string;
  tags: string[];
}

export const PROJETOS_MOCK: Projeto[] = [
  {
    id: "proj-1",
    nome: "Portal Imobiliário Lux",
    cliente: "Prime Real Estate",
    fase: "Descoberta",
    faseCor: "bg-zinc-600",
    progresso: 15,
    proximaEntrega: "Kickoff 3D & Wireframe",
    dataEntrega: "15 Ago",
    valor: "R$ 18.500",
    descricao: "Portal imobiliário ultra-rápido com tours virtuais 3D e agendamento instantâneo via WhatsApp.",
    tags: ["Next.js", "Three.js", "Tailwind", "CRM Sync"]
  },
  {
    id: "proj-2",
    nome: "Landing Page Alpha AI",
    cliente: "Startup Venture",
    fase: "Revisão",
    faseCor: "bg-[#4ade80]",
    progresso: 92,
    proximaEntrega: "Aprovação final de copy e métricas",
    dataEntrega: "02 Jul",
    valor: "R$ 6.900",
    descricao: "Página de conversão focada em SaaS de inteligência artificial com micro-animações interativas.",
    tags: ["Next.js", "Framer Motion", "Stripe API"]
  },
  {
    id: "proj-3",
    nome: "Nexus OS — Rebranding & Sistema",
    cliente: "Nexus Systems",
    fase: "Produção",
    faseCor: "bg-[#fbbf24]",
    progresso: 65,
    proximaEntrega: "Draft v2 do site e dashboard",
    dataEntrega: "28 Jun",
    valor: "R$ 24.000",
    descricao: "Design system completo, plataforma web e painel de controle operacional de dados corporativos.",
    tags: ["React 19", "Tailwind v4", "PostgreSQL", "Auth"]
  }
];

export const CLIENTES_MOCK: Cliente[] = [
  {
    id: "cli-1",
    nome: "Rafael Nogueira",
    empresa: "Nortech Soluções",
    cargo: "CEO",
    email: "rafael@nortech.com.br",
    whatsapp: "+55 16 98214-1822",
    status: "Fechado",
    valorContrato: "R$ 14.900",
    ultimoContato: "Hoje, 11:30"
  },
  {
    id: "cli-2",
    nome: "Beatriz Miranda",
    empresa: "Prime Real Estate",
    cargo: "Diretora de Marketing",
    email: "b.miranda@primereal.com.br",
    whatsapp: "+55 11 99876-5432",
    status: "Ativo",
    valorContrato: "R$ 18.500",
    ultimoContato: "Ontem, 16:45"
  },
  {
    id: "cli-3",
    nome: "Lucas Silveira",
    empresa: "Startup Venture",
    cargo: "Founder & CTO",
    email: "lucas@ventureai.io",
    whatsapp: "+55 19 98711-2233",
    status: "Ativo",
    valorContrato: "R$ 6.900",
    ultimoContato: "Há 2 dias"
  },
  {
    id: "cli-4",
    nome: "Carla Mendes",
    empresa: "Nexus Systems",
    cargo: "Head de Produto",
    email: "carla@nexus.global",
    whatsapp: "+55 21 97654-3210",
    status: "Ativo",
    valorContrato: "R$ 24.000",
    ultimoContato: "Hoje, 09:15"
  },
  {
    id: "cli-5",
    nome: "Guilherme Prado",
    empresa: "Prado Capital",
    cargo: "Gestor",
    email: "prado@pradocapital.com",
    whatsapp: "+55 16 99123-8899",
    status: "Proposta",
    valorContrato: "R$ 12.000",
    ultimoContato: "18 Jun"
  }
];

export const TAREFAS_MOCK: Tarefa[] = [
  {
    id: "t-1",
    titulo: "Finalizar animação do hero Nexus",
    projeto: "Nexus OS",
    horario: "10:30",
    prioridade: "alta",
    concluida: false
  },
  {
    id: "t-2",
    titulo: "Debug Webhook Stripe → Discord",
    projeto: "Automação interna",
    horario: "12:00",
    prioridade: "crítica",
    concluida: false
  },
  {
    id: "t-3",
    titulo: "Revisar copy da Alpha AI",
    projeto: "Alpha AI",
    horario: "14:30",
    prioridade: "média",
    concluida: false
  },
  {
    id: "t-4",
    titulo: "Preparar proposta Portal Lux",
    projeto: "Prime Real Estate",
    horario: "17:00",
    prioridade: "alta",
    concluida: false
  }
];

export const AUTOMACOES_MOCK: Automacao[] = [
  {
    id: "auto-1",
    nome: "Backup diário de projetos",
    status: "Ativa",
    statusCor: "bg-[#4ade80]",
    descricao: "Snapshot de repositórios, banco de dados e arquivos de assets em nuvem secundária.",
    ultimaExecucao: "hoje, 03:00",
    totalExecucoes: 91,
    gatilho: "Cron diário (03:00 UTC)",
    destino: "S3 / Cloudflare R2"
  },
  {
    id: "auto-2",
    nome: "Lead Form → CRM Pipeline",
    status: "Ativa",
    statusCor: "bg-[#4ade80]",
    descricao: "Formulários do site público caem automaticamente no pipeline de clientes e disparam notificação.",
    ultimaExecucao: "há 3 min",
    totalExecucoes: 526,
    gatilho: "Webhook de Formulário",
    destino: "Victor Hub CRM + Telegram"
  },
  {
    id: "auto-3",
    nome: "Stripe Sync → Discord Notify",
    status: "Atenção",
    statusCor: "bg-[#fbbf24]",
    descricao: "Eventos de checkout pago e assinaturas enviam aviso para o canal #recebimentos.",
    ultimaExecucao: "há 12 min",
    totalExecucoes: 1842,
    gatilho: "Stripe Webhook (checkout.session.completed)",
    destino: "Discord Webhook Bot"
  },
  {
    id: "auto-4",
    nome: "Disparo Boas-Vindas WhatsApp",
    status: "Ativa",
    statusCor: "bg-[#4ade80]",
    descricao: "Envio de mensagem personalizada automática logo após fechamento de proposta.",
    ultimaExecucao: "ontem, 18:20",
    totalExecucoes: 134,
    gatilho: "Status de Cliente = Fechado",
    destino: "Z-API / WhatsApp"
  }
];

export const ARSENAL_MOCK: ItemArsenal[] = [
  {
    id: "ars-1",
    titulo: "Prompt: Copywriter VSL & Landing Page",
    tipo: "Prompt",
    categoria: "Copywriting",
    usos: 215,
    descricao: "Prompt de alta conversão para estruturar roteiro persuasivo de página ou pitch comercial.",
    conteudo: `Você é um copywriter de elite especializado em páginas de altíssima conversão para produtos de tecnologia e consultoria digital.
Crie a estrutura de mensagem focando em:
1. Dor latente e o custo da inação.
2. Contraste com as alternativas medíocres do mercado.
3. Demonstração de autoridade técnica sem jargão excessivo.
4. Oferta irresistível com redução drástica de risco percebido.`,
    tags: ["Copywriting", "Conversão", "Vendas"]
  },
  {
    id: "ars-2",
    titulo: "Shader: Red Glow Mesh 3D",
    tipo: "Componente",
    categoria: "Three.js / WebGL",
    usos: 15,
    descricao: "Mesh com gradiente dinâmico vermelho com distorção por noise e pulso suave para backgrounds.",
    conteudo: `// Red Glow Mesh Shader Material
const vertexShader = \`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
\`;

const fragmentShader = \`
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float dist = distance(vUv, vec2(0.5));
    float pulse = sin(uTime * 1.5) * 0.15 + 0.85;
    vec3 color = vec3(0.937, 0.137, 0.235); // #ef233c
    float alpha = smoothstep(0.5, 0.0, dist) * 0.4 * pulse;
    gl_FragColor = vec4(color, alpha);
  }
\`;`,
    tags: ["Three.js", "Shaders", "GLSL", "Visual"]
  },
  {
    id: "ars-3",
    titulo: "Landing Page: SaaS Minimal Dark",
    tipo: "Template",
    categoria: "Next.js",
    usos: 42,
    descricao: "Layout completo responsivo com grid de pontos, sombras volumétricas e micro-interações.",
    conteudo: `// Estrutura modular Next.js
export default function MinimalLanding() {
  return (
    <div className="dot-grid min-h-screen bg-[#050505] text-white">
      {/* Hero com iluminação difusa */}
      <div className="glow-top" />
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <PricingTable />
    </div>
  );
}`,
    tags: ["Next.js", "Tailwind", "Landing Page"]
  },
  {
    id: "ars-4",
    titulo: "Agente: Arquiteto Fullstack",
    tipo: "Agente",
    categoria: "Inteligência Artificial",
    usos: 128,
    descricao: "System prompt para agente programador encarregado de construir código limpo e padrões de ponta a ponta.",
    conteudo: `Você é o Arquiteto Fullstack Principal.
Diretrizes:
- Escreva código limpo, tipado e com tratamento de erro defensivo.
- Favoreça arquiteturas modulares orientadas a componentes reutilizáveis.
- Priorize a experiência do usuário com feedback instantâneo e estados de carregamento elegantes.`,
    tags: ["AI Agent", "System Prompt", "Engenharia"]
  }
];

export const FINANCEIRO_MOCK = {
  mrr: "R$ 14.500",
  faturamentoMes: "R$ 48.900",
  pipelineTotal: "R$ 84.500",
  recebidoConfirmado: "R$ 6.000",
  taxaFechamento: "42%",
  historicoMensal: [
    { mes: "Mai", valor: 28000 },
    { mes: "Jun", valor: 36000 },
    { mes: "Jul", valor: 42000 },
    { mes: "Ago", valor: 39000 },
    { mes: "Set", valor: 48900 }
  ]
};
