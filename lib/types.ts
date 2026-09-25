export interface Profile {
  name: string;
  workspace: string;
  role: string;
  version: string;
  objective: string;
  whatsapp: string;
  city: string;
  domain: string;
}

export interface Prefs {
  density: "operational" | "compact";
  alerts: boolean;
  reduceMotion: boolean;
  mode: "operacional" | "publico";
}

export interface Funnel {
  qualificados: number;
  propostas: number;
  negociacoes: number;
  fechamentos: number;
}

export interface Integration {
  status: "pronta" | "operacional" | "requer" | "inativa";
  hint: string;
}

export interface ClientTimelineItem {
  at: string;
  text: string;
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  company: string;
  email: string;
  phone: string;
  stage: "lead" | "qualificado" | "proposta" | "negociacao" | "ativo" | "perdido";
  value: number;
  contactAt: string;
  nextAction: string;
  projectId: string | null;
  notes: string;
  timeline: ClientTimelineItem[];
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Project {
  id: string;
  letter: string;
  name: string;
  clientId: string | null;
  status: "descoberta" | "producao" | "revisao" | "entregue";
  progress: number;
  value: number;
  paid: number;
  milestone: string;
  deadline: string;
  critical: boolean;
  stack: string[];
  brief: string;
  notes: string;
  milestones: Milestone[];
}

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  automationId?: string | null;
  tag: string;
  priority: "critica" | "alta" | "media" | "baixa";
  time: string;
  block: "manha" | "tarde" | "noite";
  date: string;
  done: boolean;
  order: number;
  detail: string;
}

export interface AutomationLog {
  at: string;
  text?: string;
  msg?: string;
  ok?: boolean;
  status?: "ok" | "erro" | "alerta";
}

export interface AutomationNode {
  icon?: string;
  label: string;
  warn?: boolean;
}

export interface Automation {
  id: string;
  name: string;
  platform: string;
  status: "ativa" | "atencao" | "pausada";
  runs: number;
  lastRun: string;
  successRate: number;
  avg: string;
  summary: string;
  error?: string;
  trigger?: string;
  destination?: string;
  nodes?: (string | AutomationNode)[];
  fixes?: string | { secret?: boolean; tolerance?: boolean; channel?: boolean } | null;
  logs?: AutomationLog[];
}

export interface ArsenalItem {
  id: string;
  type: "prompt" | "componente" | "template" | "agente" | "script";
  version: string;
  name: string;
  summary: string;
  tags: string[];
  uses: number;
  body: string;
  star?: boolean;
  niche?: string;
}

export interface Movement {
  id: string;
  title: string;
  kind: "entrada" | "saida";
  amount: number;
  status: "recebido" | "previsto" | "pago";
  cadence: "pontual" | "mensal";
  date: string;
  projectId?: string | null;
  note?: string;
}

export interface Activity {
  at: string;
  text: string;
}

export interface SistemaState {
  version: 1;
  seededAt: string;
  profile: Profile;
  prefs: Prefs;
  funnel: Funnel;
  integrations: Record<string, Integration>;
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  automations: Automation[];
  arsenal: ArsenalItem[];
  movements: Movement[];
  pulse: number[];
  activity: Activity[];
}

export interface KPIs {
  active: number;
  critical: number;
  tasks: number;
  done: number;
  pending: number;
  pipeline: number;
  received: number;
  predicted: number;
  costs: number;
  result: number;
  realized: number;
}

export interface DeliveryBlockers {
  milestones: Milestone[];
  tasks: Task[];
  balance: number;
}
