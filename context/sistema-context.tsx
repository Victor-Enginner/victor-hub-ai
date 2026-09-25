"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  SistemaState,
  Project,
  Client,
  Task,
  Automation,
  ArsenalItem,
  Movement,
  KPIs,
  DeliveryBlockers,
} from "@/lib/types";
import { buildSeed, todayISO } from "@/lib/seed-data";

const STORAGE_KEY = "victor-hub-os-v1";

interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "warn" | "error";
}

interface SistemaContextType {
  state: SistemaState;
  loaded: boolean;
  kpis: KPIs;
  daysUntil: (date?: string) => number | null;
  clientById: (id: string | null | undefined) => Client | null;
  projectById: (id: string | null | undefined) => Project | null;
  deliveryBlockers: (projectId: string) => DeliveryBlockers;
  toggleTask: (id: string) => boolean;
  addTask: (data: {
    title: string;
    projectId?: string | null;
    automationId?: string | null;
    tag?: string;
    priority?: "critica" | "alta" | "media" | "baixa";
    time?: string;
    block?: "manha" | "tarde" | "noite";
    date?: string;
    detail?: string;
  }) => Task | null;
  rescheduleTask: (id: string, date?: string) => boolean;
  undoLast: () => boolean;
  addProject: (data: {
    name: string;
    clientId?: string | null;
    status?: "descoberta" | "producao" | "revisao" | "entregue";
    progress?: number;
    value?: number;
    milestone?: string;
    deadline?: string;
    stack?: string;
    brief?: string;
  }) => Project | null;
  updateProject: (id: string, patch: Partial<Project>) => boolean;
  toggleMilestone: (projectId: string, milestoneId: string) => boolean;
  saveProjectNote: (projectId: string, notes: string) => boolean;
  toggleCritical: (projectId: string) => boolean;
  forceDeliver: (projectId: string) => boolean;
  addClient: (data: {
    name: string;
    company: string;
    email?: string;
    phone?: string;
    stage?: Client["stage"];
    value?: number;
    nextAction?: string;
    projectId?: string | null;
    notes?: string;
  }) => Client | null;
  updateClient: (id: string, patch: Partial<Client>) => boolean;
  cycleStage: (id: string) => boolean;
  logContact: (id: string, text: string) => boolean;
  scheduleClientAction: (clientId: string) => { ok: boolean; task?: Task };
  runAutomation: (id: string) => boolean;
  composeAsset: (assetId: string, projectId?: string) => string;
  addMovement: (data: {
    title: string;
    kind: "entrada" | "saida";
    amount: number;
    status?: "recebido" | "previsto" | "pago";
    cadence?: "pontual" | "mensal";
    date?: string;
    projectId?: string | null;
    note?: string;
  }) => Movement | null;
  deleteMovement: (id: string) => boolean;
  receiveMovement: (id: string) => boolean;
  setMode: (mode: "operacional" | "publico") => void;
  setProfile: (patch: Partial<import("@/lib/types").Profile>) => void;
  setPrefs: (patch: Partial<import("@/lib/types").Prefs>) => void;
  exportBackup: () => void;
  importBackup: (jsonString: string) => { ok: boolean; error?: string };
  resetToSeed: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  novoModalOpen: boolean;
  setNovoModalOpen: (open: boolean) => void;
  clientDrawerId: string | null;
  setClientDrawerId: (id: string | null) => void;
  deliveryBlockerProject: Project | null;
  setDeliveryBlockerProject: (p: Project | null) => void;
  composeModal: { assetId: string; projectId?: string } | null;
  setComposeModal: (data: { assetId: string; projectId?: string } | null) => void;
  focus: { taskId: string; title: string; ends: number } | null;
  startFocus: (taskId: string, title: string) => void;
  stopFocus: () => void;
}

const SistemaContext = createContext<SistemaContextType | null>(null);

export function SistemaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SistemaState>(() => buildSeed());
  const [loaded, setLoaded] = useState(false);
  const [undo, setUndo] = useState<(() => void) | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [clientDrawerId, setClientDrawerId] = useState<string | null>(null);
  const [deliveryBlockerProject, setDeliveryBlockerProject] = useState<Project | null>(null);
  const [composeModal, setComposeModal] = useState<{ assetId: string; projectId?: string } | null>(null);
  const [focus, setFocus] = useState<{ taskId: string; title: string; ends: number } | null>(null);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = "t_" + Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startFocus = useCallback((taskId: string, title: string) => {
    const ends = Date.now() + 25 * 60 * 1000;
    const f = { taskId, title, ends };
    setFocus(f);
    try {
      sessionStorage.setItem("vh-focus", JSON.stringify(f));
    } catch {}
    addToast("Foco de 25 minutos iniciado · " + title, "info");
  }, [addToast]);

  const stopFocus = useCallback(() => {
    setFocus(null);
    try {
      sessionStorage.removeItem("vh-focus");
    } catch {}
    addToast("Bloco de foco encerrado.", "info");
  }, [addToast]);

  // Focus timer tick
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("vh-focus");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.ends > Date.now()) {
          setFocus(parsed);
        }
      }
    } catch {}

    const timer = setInterval(() => {
      setFocus((prev) => {
        if (!prev) return null;
        if (Date.now() >= prev.ends) {
          try {
            sessionStorage.removeItem("vh-focus");
          } catch {}
          addToast("Bloco de 25 minutos encerrado · " + prev.title, "info");
          return null;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [addToast]);

  // Load from localStorage on client mount & show recovery toast
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 1 && Array.isArray(parsed.projects)) {
          setState(parsed);
          setLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Falha ao ler localStorage", e);
    }
    const seed = buildSeed();
    setState(seed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (!sessionStorage.getItem("vh-welcomed")) {
        sessionStorage.setItem("vh-welcomed", "1");
        setTimeout(() => {
          addToast("Sistema recuperado neste navegador. Exporte um backup em Configurações — a pasta não se perde de novo.", "info");
        }, 600);
      }
    } catch {}
  }, [loaded, addToast]);

  // Persist state to localStorage on state change
  const persistState = useCallback((newState: SistemaState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Falha ao salvar no localStorage", e);
    }
  }, []);

  const logActivity = useCallback((text: string, currentState: SistemaState): SistemaState => {
    const activity = [{ at: new Date().toISOString(), text }, ...currentState.activity.slice(0, 39)];
    return { ...currentState, activity };
  }, []);

  const daysUntil = useCallback((date?: string): number | null => {
    if (!date) return null;
    const a = new Date(todayISO() + "T12:00:00-03:00").getTime();
    const b = new Date(date + "T12:00:00-03:00").getTime();
    return Math.round((b - a) / 86400000);
  }, []);

  const clientById = useCallback(
    (id: string | null | undefined): Client | null => {
      if (!id) return null;
      return state.clients.find((c) => c.id === id) || null;
    },
    [state.clients]
  );

  const projectById = useCallback(
    (id: string | null | undefined): Project | null => {
      if (!id) return null;
      return state.projects.find((p) => p.id === id) || null;
    },
    [state.projects]
  );

  const deliveryBlockers = useCallback(
    (projectId: string): DeliveryBlockers => {
      const project = state.projects.find((p) => p.id === projectId);
      if (!project) return { milestones: [], tasks: [], balance: 0 };
      const balance = Math.max(0, Number(project.value || 0) - Number(project.paid || 0));
      return {
        milestones: (project.milestones || []).filter((m) => !m.done),
        tasks: state.tasks.filter((t) => t.projectId === project.id && !t.done),
        balance,
      };
    },
    [state.projects, state.tasks]
  );

  const kpis: KPIs = useMemo(() => {
    const active = state.projects.filter((p) => p.status !== "entregue");
    const critical = active.filter((p) => {
      if (p.critical) return true;
      const d = daysUntil(p.deadline);
      return d !== null && d <= 3;
    });
    const today = todayISO();
    const todayTasks = state.tasks.filter((t) => t.date === today);
    const done = todayTasks.filter((t) => t.done).length;
    const pipeline = active.reduce((s, p) => s + Number(p.value || 0), 0);
    const mk = today.slice(0, 7);

    const received = state.movements
      .filter((m) => m.kind === "entrada" && m.status === "recebido" && m.date.slice(0, 7) === mk)
      .reduce((s, m) => s + Number(m.amount || 0), 0);

    const predicted = state.movements
      .filter((m) => m.kind === "entrada" && m.status === "previsto")
      .reduce((s, m) => s + Number(m.amount || 0), 0);

    const costs = state.movements
      .filter((m) => m.kind === "saida" && (m.cadence === "mensal" || m.date.slice(0, 7) === mk))
      .reduce((s, m) => s + Number(m.amount || 0), 0);

    return {
      active: active.length,
      critical: critical.length,
      tasks: todayTasks.length,
      done,
      pending: todayTasks.length - done,
      pipeline,
      received,
      predicted,
      costs,
      result: predicted - costs,
      realized: received - costs,
    };
  }, [state.projects, state.tasks, state.movements, daysUntil]);

  const guard = useCallback(() => {
    if (state.prefs.mode === "publico") {
      addToast("O sistema está em modo público de visualização. Edições travadas.", "warn");
      return false;
    }
    return true;
  }, [state.prefs.mode, addToast]);

  const toggleTask = useCallback(
    (id: string) => {
      if (!guard()) return false;
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return false;
      const prev = task.done;
      const newDone = !prev;

      const updatedTasks = state.tasks.map((t) => (t.id === id ? { ...t, done: newDone } : t));
      let nextState: SistemaState = { ...state, tasks: updatedTasks };
      nextState = logActivity(
        newDone ? `Tarefa concluída: ${task.title}` : `Tarefa reaberta: ${task.title}`,
        nextState
      );
      persistState(nextState);

      setUndo(() => () => {
        setState((current) => {
          const undoneTasks = current.tasks.map((t) => (t.id === id ? { ...t, done: prev } : t));
          const restoredState = logActivity("Conclusão desfeita.", { ...current, tasks: undoneTasks });
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredState));
          } catch {}
          return restoredState;
        });
        addToast("Conclusão de tarefa revertida com sucesso.");
      });

      addToast(newDone ? `Concluída: ${task.title}` : `Reaberta: ${task.title}`);
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const undoLast = useCallback(() => {
    if (!undo) return false;
    undo();
    setUndo(null);
    return true;
  }, [undo]);

  const addTask = useCallback(
    (data: {
      title: string;
      projectId?: string | null;
      automationId?: string | null;
      tag?: string;
      priority?: "critica" | "alta" | "media" | "baixa";
      time?: string;
      block?: "manha" | "tarde" | "noite";
      date?: string;
      detail?: string;
    }) => {
      if (!guard()) return null;
      const id = "t_" + Math.random().toString(36).slice(2, 8);
      const newTask: Task = {
        id,
        title: data.title.trim(),
        projectId: data.projectId || null,
        automationId: data.automationId || null,
        tag: data.tag || "Estúdio",
        priority: data.priority || "media",
        time: data.time || "09:00",
        block: data.block || "manha",
        date: data.date || todayISO(),
        done: false,
        order: Date.now(),
        detail: data.detail || "",
      };
      let nextState: SistemaState = {
        ...state,
        tasks: [...state.tasks, newTask],
      };
      nextState = logActivity(`Tarefa criada: ${newTask.title}`, nextState);
      persistState(nextState);
      addToast(`Tarefa criada: ${newTask.title}`, "success");
      return newTask;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const rescheduleTask = useCallback(
    (id: string, date?: string) => {
      if (!guard()) return false;
      const targetDate = date || todayISO();
      const updatedTasks = state.tasks.map((t) =>
        t.id === id ? { ...t, date: targetDate, done: false } : t
      );
      let nextState: SistemaState = { ...state, tasks: updatedTasks };
      const task = state.tasks.find((t) => t.id === id);
      nextState = logActivity(`Tarefa puxada para hoje: ${task?.title || id}`, nextState);
      persistState(nextState);
      addToast(`Tarefa puxada para hoje: ${task?.title || ""}`, "success");
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const addProject = useCallback(
    (data: {
      name: string;
      clientId?: string | null;
      status?: "descoberta" | "producao" | "revisao" | "entregue";
      progress?: number;
      value?: number;
      milestone?: string;
      deadline?: string;
      stack?: string;
      brief?: string;
    }) => {
      if (!guard()) return null;
      const id = "p_" + Math.random().toString(36).slice(2, 8);
      const newProj: Project = {
        id,
        letter: data.name.trim().charAt(0).toUpperCase() || "P",
        name: data.name.trim(),
        clientId: data.clientId || null,
        status: data.status || "descoberta",
        progress: Number(data.progress || 0),
        value: Number(data.value || 0),
        paid: 0,
        milestone: data.milestone || "Kickoff",
        deadline: data.deadline || todayISO(),
        critical: false,
        stack: (data.stack || "Next.js, Tailwind")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        brief: data.brief || "",
        notes: "",
        milestones: [
          { id: "ms_1", title: data.milestone || "Kickoff", done: false },
          { id: "ms_2", title: "Entrega Final", done: false },
        ],
      };
      let nextState: SistemaState = {
        ...state,
        projects: [...state.projects, newProj],
      };
      nextState = logActivity(`Projeto aberto: ${newProj.name}`, nextState);
      persistState(nextState);
      addToast(`Projeto aberto: ${newProj.name}`, "success");
      return newProj;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) => {
      if (!guard()) return false;
      const proj = state.projects.find((p) => p.id === id);
      if (!proj) return false;

      // Se tentar marcar como entregue e houver bloqueadores
      if (patch.status === "entregue" && proj.status !== "entregue") {
        const blockers = deliveryBlockers(id);
        const hasBlockers = blockers.milestones.length > 0 || blockers.tasks.length > 0 || blockers.balance > 0;
        if (hasBlockers) {
          setDeliveryBlockerProject(proj);
          return false;
        }
      }

      const updatedProjects = state.projects.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...patch };
        if (patch.status === "entregue") updated.progress = 100;
        return updated;
      });

      let nextState: SistemaState = { ...state, projects: updatedProjects };
      if (patch.status && patch.status !== proj.status) {
        nextState = logActivity(`Projeto ${proj.name}: status mudou para ${patch.status}`, nextState);
      }
      persistState(nextState);
      addToast(`Projeto ${proj.name} atualizado`);
      return true;
    },
    [state, guard, deliveryBlockers, logActivity, persistState, addToast]
  );

  const forceDeliver = useCallback(
    (projectId: string) => {
      if (!guard()) return false;
      const proj = state.projects.find((p) => p.id === projectId);
      if (!proj) return false;

      const updatedProjects = state.projects.map((p) =>
        p.id === projectId ? { ...p, status: "entregue" as const, progress: 100 } : p
      );
      let nextState: SistemaState = { ...state, projects: updatedProjects };
      nextState = logActivity(`Projeto entregue com ressalvas: ${proj.name}`, nextState);
      persistState(nextState);
      setDeliveryBlockerProject(null);
      addToast(`Projeto entregue: ${proj.name}`, "success");
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const toggleMilestone = useCallback(
    (projectId: string, milestoneId: string) => {
      if (!guard()) return false;
      const proj = state.projects.find((p) => p.id === projectId);
      if (!proj) return false;

      let changedTitle = "";
      let newDone = false;
      const updatedMilestones = proj.milestones.map((m) => {
        if (m.id === milestoneId) {
          changedTitle = m.title;
          newDone = !m.done;
          return { ...m, done: newDone };
        }
        return m;
      });

      const updatedProjects = state.projects.map((p) =>
        p.id === projectId ? { ...p, milestones: updatedMilestones } : p
      );
      let nextState: SistemaState = { ...state, projects: updatedProjects };
      nextState = logActivity(
        `${newDone ? "Marco concluído" : "Marco reaberto"}: ${changedTitle} (${proj.name})`,
        nextState
      );
      persistState(nextState);
      addToast(`${newDone ? "Marco concluído" : "Marco reaberto"}: ${changedTitle}`);
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const saveProjectNote = useCallback(
    (projectId: string, notes: string) => {
      if (!guard()) return false;
      const updatedProjects = state.projects.map((p) =>
        p.id === projectId ? { ...p, notes } : p
      );
      const nextState: SistemaState = { ...state, projects: updatedProjects };
      persistState(nextState);
      addToast("Nota de produção salva com sucesso!", "success");
      return true;
    },
    [state, guard, persistState, addToast]
  );

  const toggleCritical = useCallback(
    (projectId: string) => {
      if (!guard()) return false;
      const proj = state.projects.find((p) => p.id === projectId);
      if (!proj) return false;
      const newCritical = !proj.critical;
      const updatedProjects = state.projects.map((p) =>
        p.id === projectId ? { ...p, critical: newCritical } : p
      );
      let nextState: SistemaState = { ...state, projects: updatedProjects };
      nextState = logActivity(
        newCritical ? `Marcado como crítico: ${proj.name}` : `Removido status crítico: ${proj.name}`,
        nextState
      );
      persistState(nextState);
      addToast(newCritical ? "Marcado como crítico" : "Status crítico removido");
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const addClient = useCallback(
    (data: {
      name: string;
      company: string;
      email?: string;
      phone?: string;
      stage?: Client["stage"];
      value?: number;
      nextAction?: string;
      projectId?: string | null;
      notes?: string;
    }) => {
      if (!guard()) return null;
      const parts = data.name.trim().split(" ").filter(Boolean);
      const initials = (
        (parts[0] || "C")[0] + (parts[1] ? parts[1][0] : parts[0][1] || "")
      ).toUpperCase();

      const newCli: Client = {
        id: "c_" + Math.random().toString(36).slice(2, 8),
        name: data.name.trim(),
        initials,
        company: data.company.trim(),
        email: data.email || "",
        phone: data.phone || "",
        stage: data.stage || "qualificado",
        value: Number(data.value || 0),
        contactAt: new Date().toISOString(),
        nextAction: data.nextAction || "Definir a próxima conversa.",
        projectId: data.projectId || null,
        notes: data.notes || "",
        timeline: [{ at: new Date().toISOString(), text: "Cliente registrado no radar." }],
      };

      const updatedFunnel = { ...state.funnel };
      if (newCli.stage === "qualificado") updatedFunnel.qualificados += 1;
      if (newCli.stage === "proposta") updatedFunnel.propostas += 1;
      if (newCli.stage === "negociacao") updatedFunnel.negociacoes += 1;
      if (newCli.stage === "ativo") updatedFunnel.fechamentos += 1;

      let nextState: SistemaState = {
        ...state,
        clients: [newCli, ...state.clients],
        funnel: updatedFunnel,
      };
      nextState = logActivity(`Cliente no radar: ${newCli.name}`, nextState);
      persistState(nextState);
      addToast(`Cliente cadastrado: ${newCli.name}`, "success");
      return newCli;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const updateClient = useCallback(
    (id: string, patch: Partial<Client>) => {
      if (!guard()) return false;
      const updatedClients = state.clients.map((c) => (c.id === id ? { ...c, ...patch } : c));
      const nextState: SistemaState = { ...state, clients: updatedClients };
      persistState(nextState);
      addToast("Dados do cliente atualizados");
      return true;
    },
    [state, guard, persistState, addToast]
  );

  const cycleStage = useCallback(
    (id: string) => {
      if (!guard()) return false;
      const stages: Client["stage"][] = ["lead", "qualificado", "proposta", "negociacao", "ativo"];
      const cli = state.clients.find((c) => c.id === id);
      if (!cli || cli.stage === "perdido") return false;

      const idx = stages.indexOf(cli.stage);
      const nextStage = stages[Math.min(stages.length - 1, idx + 1)];
      if (nextStage === cli.stage) return true;

      const updatedTimeline = [
        { at: new Date().toISOString(), text: `Etapa avançou para ${nextStage}.` },
        ...cli.timeline,
      ];

      const updatedFunnel = { ...state.funnel };
      if (nextStage === "proposta") updatedFunnel.propostas += 1;
      if (nextStage === "negociacao") updatedFunnel.negociacoes += 1;
      if (nextStage === "ativo") updatedFunnel.fechamentos += 1;

      const updatedClients = state.clients.map((c) =>
        c.id === id ? { ...c, stage: nextStage, timeline: updatedTimeline } : c
      );

      let nextState: SistemaState = {
        ...state,
        clients: updatedClients,
        funnel: updatedFunnel,
      };
      nextState = logActivity(`Cliente ${cli.name} avançou para ${nextStage}`, nextState);
      persistState(nextState);
      addToast(`Etapa de ${cli.name} avançou para ${nextStage.toUpperCase()}`, "success");
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const logContact = useCallback(
    (id: string, text: string) => {
      if (!guard()) return false;
      const cli = state.clients.find((c) => c.id === id);
      if (!cli) return false;

      const now = new Date().toISOString();
      const updatedTimeline = [{ at: now, text: text || "Contato registrado." }, ...cli.timeline];
      const updatedClients = state.clients.map((c) =>
        c.id === id ? { ...c, contactAt: now, timeline: updatedTimeline } : c
      );

      let nextState: SistemaState = { ...state, clients: updatedClients };
      nextState = logActivity(`Contato com ${cli.name}: ${text}`, nextState);
      persistState(nextState);
      addToast("Contato registrado no histórico!", "success");
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const scheduleClientAction = useCallback(
    (clientId: string) => {
      if (!guard()) return { ok: false };
      const client = state.clients.find((c) => c.id === clientId);
      if (!client || !client.nextAction.trim()) return { ok: false };

      const title = client.nextAction.trim();
      const today = todayISO();
      const existing = state.tasks.find((t) => !t.done && t.date === today && t.title === title);
      if (existing) {
        addToast("Essa ação já está na sua agenda de hoje!");
        return { ok: true, task: existing };
      }

      const newTask = addTask({
        title,
        projectId: client.projectId || null,
        tag: client.company || "Relação",
        priority: "alta",
        time: "17:00",
        block: "tarde",
        date: today,
        detail: `Veio da próxima ação de ${client.name}.`,
      });

      if (newTask) {
        addToast(`Ação colocada na agenda de hoje!`, "success");
        return { ok: true, task: newTask };
      }
      return { ok: false };
    },
    [state.clients, state.tasks, guard, addTask, addToast]
  );

  const runAutomation = useCallback(
    (id: string) => {
      if (!guard()) return false;
      const auto = state.automations.find((a) => a.id === id);
      if (!auto) return false;

      const now = new Date().toISOString();
      const newLog = {
        at: now,
        status: "ok" as const,
        text: `Disparo manual executado com sucesso · nó final respondendo 200 OK.`,
      };

      const updatedAutomations = state.automations.map((a) =>
        a.id === id
          ? {
              ...a,
              runs: a.runs + 1,
              lastRun: now,
              status: "ativa" as const,
              logs: [newLog, ...(a.logs || []).slice(0, 9)],
            }
          : a
      );

      let nextState: SistemaState = { ...state, automations: updatedAutomations };
      nextState = logActivity(`Automação disparada: ${auto.name}`, nextState);
      persistState(nextState);
      addToast(`Automação '${auto.name}' disparada!`, "success");
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const composeAsset = useCallback(
    (assetId: string, projectId?: string): string => {
      const asset = state.arsenal.find((a) => a.id === assetId);
      if (!asset) return "";
      const p = projectId ? state.projects.find((x) => x.id === projectId) : state.projects[0];
      const client = p?.clientId ? state.clients.find((c) => c.id === p.clientId) : null;

      const projName = p ? p.name : "Projeto Exemplo";
      const clientName = client ? client.name : "Cliente Exemplo";
      const company = client ? client.company : "Empresa Exemplo";
      const valor = p ? `R$ ${p.value.toLocaleString("pt-BR")}` : "R$ 15.000";
      const milestone = p ? p.milestone : "Entrega Inicial";

      let out = asset.body
        .replaceAll("{{projeto}}", projName)
        .replaceAll("{{cliente}}", clientName)
        .replaceAll("{{oferta}}", projName)
        .replaceAll("{{quem}}", company)
        .replaceAll("{{resultado}}", milestone)
        .replaceAll("{{valor}}", valor);

      if (p) {
        out += `\n\n---\nContexto aplicado\nProjeto: ${p.name}\nCliente: ${company}\nValor: ${valor}\nBrief: ${p.brief || "—"}`;
      }
      return out;
    },
    [state.arsenal, state.projects, state.clients]
  );

  const addMovement = useCallback(
    (data: {
      title: string;
      kind: "entrada" | "saida";
      amount: number;
      status?: "recebido" | "previsto" | "pago";
      cadence?: "pontual" | "mensal";
      date?: string;
      projectId?: string | null;
      note?: string;
    }) => {
      if (!guard()) return null;
      const newMov: Movement = {
        id: "m_" + Math.random().toString(36).slice(2, 8),
        title: data.title.trim(),
        kind: data.kind,
        amount: Number(data.amount || 0),
        status: data.status || (data.kind === "saida" ? "pago" : "previsto"),
        cadence: data.cadence || "pontual",
        date: data.date || todayISO(),
        projectId: data.projectId || null,
        note: data.note || "",
      };

      let nextState: SistemaState = {
        ...state,
        movements: [newMov, ...state.movements],
      };
      nextState = logActivity(
        `Movimentação financeira: ${newMov.kind === "entrada" ? "+" : "-"}R$ ${newMov.amount} (${newMov.title})`,
        nextState
      );
      persistState(nextState);
      addToast(`Lançamento financeiro registrado: ${newMov.title}`, "success");
      return newMov;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const deleteMovement = useCallback(
    (id: string) => {
      if (!guard()) return false;
      const updated = state.movements.filter((m) => m.id !== id);
      const nextState: SistemaState = { ...state, movements: updated };
      persistState(nextState);
      addToast("Lançamento removido");
      return true;
    },
    [state, guard, persistState, addToast]
  );

  const receiveMovement = useCallback(
    (id: string) => {
      if (!guard()) return false;
      const mov = state.movements.find((m) => m.id === id);
      if (!mov) return false;
      const updated = state.movements.map((m) =>
        m.id === id ? { ...m, status: "recebido" as const } : m
      );
      let nextState: SistemaState = { ...state, movements: updated };
      nextState = logActivity(
        `Recebimento confirmado: +R$ ${mov.amount} (${mov.title})`,
        nextState
      );
      persistState(nextState);
      addToast(
        `Recebimento de R$ ${mov.amount.toLocaleString("pt-BR")} confirmado com sucesso!`,
        "success"
      );
      return true;
    },
    [state, guard, logActivity, persistState, addToast]
  );

  const setMode = useCallback(
    (mode: "operacional" | "publico") => {
      const nextPrefs = { ...state.prefs, mode };
      let nextState: SistemaState = { ...state, prefs: nextPrefs };
      nextState = logActivity(
        mode === "publico"
          ? "Ambiente colocado em modo de visualização pública."
          : "Edição operacional desbloqueada.",
        nextState
      );
      persistState(nextState);
      addToast(
        mode === "publico"
          ? "Modo de visualização ativado"
          : "Modo operacional desbloqueado com sucesso!",
        "success"
      );
    },
    [state, logActivity, persistState, addToast]
  );

  const setProfile = useCallback(
    (patch: Partial<import("@/lib/types").Profile>) => {
      const nextProfile = { ...state.profile, ...patch };
      let nextState: SistemaState = { ...state, profile: nextProfile };
      nextState = logActivity("Perfil e identidade atualizados no cockpit.", nextState);
      persistState(nextState);
      addToast("Identidade salva com sucesso!", "success");
    },
    [state, logActivity, persistState, addToast]
  );

  const setPrefs = useCallback(
    (patch: Partial<import("@/lib/types").Prefs>) => {
      const nextPrefs = { ...state.prefs, ...patch };
      let nextState: SistemaState = { ...state, prefs: nextPrefs };
      persistState(nextState);
      addToast("Preferências salvas com sucesso!", "success");
    },
    [state, persistState, addToast]
  );

  const exportBackup = useCallback(() => {
    try {
      const json = JSON.stringify(state, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `victor-hub-os-backup-${todayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast("Backup exportado com sucesso!", "success");
    } catch (e) {
      addToast("Erro ao exportar backup", "error");
    }
  }, [state, addToast]);

  const importBackup = useCallback(
    (jsonString: string): { ok: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.projects)) {
          return { ok: false, error: "Arquivo de backup inválido ou versão incompatível." };
        }
        persistState(parsed);
        addToast("Backup importado com sucesso! Dados restaurados.", "success");
        return { ok: true };
      } catch (err: any) {
        return { ok: false, error: err.message || "JSON corrompido." };
      }
    },
    [persistState, addToast]
  );

  const resetToSeed = useCallback(() => {
    const seed = buildSeed();
    persistState(seed);
    addToast("Cockpit resetado para os dados originais de fábrica!", "success");
  }, [persistState, addToast]);

  return (
    <SistemaContext.Provider
      value={{
        state,
        loaded,
        kpis,
        daysUntil,
        clientById,
        projectById,
        deliveryBlockers,
        toggleTask,
        addTask,
        rescheduleTask,
        undoLast,
        addProject,
        updateProject,
        toggleMilestone,
        saveProjectNote,
        toggleCritical,
        forceDeliver,
        addClient,
        updateClient,
        cycleStage,
        logContact,
        scheduleClientAction,
        runAutomation,
        composeAsset,
        addMovement,
        deleteMovement,
        receiveMovement,
        setMode,
        setProfile,
        setPrefs,
        exportBackup,
        importBackup,
        resetToSeed,
        toasts,
        addToast,
        removeToast,
        paletteOpen,
        setPaletteOpen,
        novoModalOpen,
        setNovoModalOpen,
        clientDrawerId,
        setClientDrawerId,
        deliveryBlockerProject,
        setDeliveryBlockerProject,
        composeModal,
        setComposeModal,
        focus,
        startFocus,
        stopFocus,
      }}
    >
      {children}
    </SistemaContext.Provider>
  );
}

export function useSistema() {
  const context = useContext(SistemaContext);
  if (!context) {
    throw new Error("useSistema deve ser usado dentro de um SistemaProvider");
  }
  return context;
}
