/* Estado do Victor Hub OS — persiste neste navegador. */
(function () {
  const KEY = (window.VHConfig && window.VHConfig.storageKey) || "victor-hub-os-v1";
  const listeners = new Set();
  let state = null;
  let undo = null;

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 1 && Array.isArray(parsed.projects)) {
          state = parsed;
          return state;
        }
      }
    } catch (err) {
      console.warn("Falha ao ler o armazenamento local", err);
    }
    state = window.VHData.buildSeed();
    persist();
    return state;
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.warn("Falha ao gravar", err);
      return false;
    }
  }

  function emit() {
    persist();
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function todayISO() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  function monthKey(date) {
    return (date || todayISO()).slice(0, 7);
  }

  function uid(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  }

  function clientById(id) {
    return state.clients.find((c) => c.id === id) || null;
  }
  function projectById(id) {
    return state.projects.find((p) => p.id === id) || null;
  }

  function daysUntil(date) {
    if (!date) return null;
    const a = new Date(todayISO() + "T12:00:00-03:00").getTime();
    const b = new Date(date + "T12:00:00-03:00").getTime();
    return Math.round((b - a) / 86400000);
  }

  function inCriticalPhase(p) {
    if (!p || p.status === "entregue") return false;
    if (p.critical) return true;
    const d = daysUntil(p.deadline);
    return d !== null && d <= 3;
  }

  function log(text) {
    state.activity.unshift({ at: new Date().toISOString(), text });
    state.activity = state.activity.slice(0, 40);
  }

  function guard() {
    if (state.prefs.mode === "publico") return false;
    return true;
  }

  function kpis() {
    const active = state.projects.filter((p) => p.status !== "entregue");
    const critical = active.filter(inCriticalPhase);
    const todayTasks = state.tasks.filter((t) => t.date === todayISO());
    const done = todayTasks.filter((t) => t.done).length;
    const pipeline = active.reduce((s, p) => s + Number(p.value || 0), 0);
    const mk = monthKey();
    const received = state.movements
      .filter((m) => m.kind === "entrada" && m.status === "recebido" && monthKey(m.date) === mk)
      .reduce((s, m) => s + Number(m.amount || 0), 0);
    const predicted = state.movements
      .filter((m) => m.kind === "entrada" && m.status === "previsto")
      .reduce((s, m) => s + Number(m.amount || 0), 0);
    const costs = state.movements
      .filter((m) => m.kind === "saida" && (m.cadence === "mensal" || monthKey(m.date) === mk))
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
  }

  function setMode(mode) {
    state.prefs.mode = mode === "publico" ? "publico" : "operacional";
    log(state.prefs.mode === "publico" ? "Ambiente colocado em visualização pública." : "Edição operacional desbloqueada.");
    emit();
  }

  function setPrefs(patch) {
    Object.assign(state.prefs, patch);
    emit();
  }

  function setProfile(patch) {
    if (!guard()) return { ok: false, reason: "publico" };
    Object.assign(state.profile, patch);
    log("Identidade do workspace atualizada.");
    emit();
    return { ok: true };
  }

  function toggleTask(id) {
    if (!guard()) return { ok: false, reason: "publico" };
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return { ok: false };
    const prev = task.done;
    task.done = !task.done;
    log(task.done ? `Tarefa concluída: ${task.title}` : `Tarefa reaberta: ${task.title}`);
    undo = () => {
      const t = state.tasks.find((x) => x.id === id);
      if (t) t.done = prev;
      log("Conclusão desfeita.");
      emit();
    };
    emit();
    return { ok: true, task };
  }

  function undoLast() {
    if (!undo) return false;
    const fn = undo;
    undo = null;
    fn();
    return true;
  }

  function addTask(data) {
    if (!guard()) return { ok: false, reason: "publico" };
    const task = {
      id: uid("t"),
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
    state.tasks.push(task);
    log(`Tarefa criada: ${task.title}`);
    emit();
    return { ok: true, task };
  }

  function addProject(data) {
    if (!guard()) return { ok: false, reason: "publico" };
    const project = {
      id: uid("p"),
      letter: (data.name || "P").trim().charAt(0).toUpperCase(),
      name: data.name.trim(),
      clientId: data.clientId || null,
      status: data.status || "descoberta",
      progress: Number(data.progress || 0),
      value: Number(data.value || 0),
      paid: 0,
      milestone: data.milestone || "Kickoff",
      deadline: data.deadline || todayISO(),
      critical: false,
      stack: (data.stack || "").split(",").map((s) => s.trim()).filter(Boolean),
      brief: data.brief || "",
      notes: "",
      milestones: [
        { id: uid("ms"), title: data.milestone || "Kickoff", done: false },
        { id: uid("ms"), title: "Entrega", done: false },
      ],
    };
    state.projects.push(project);
    log(`Projeto aberto: ${project.name}`);
    emit();
    return { ok: true, project };
  }

  function updateProject(id, patch) {
    if (!guard()) return { ok: false, reason: "publico" };
    const p = projectById(id);
    if (!p) return { ok: false };
    Object.assign(p, patch);
    if (patch.status === "entregue") p.progress = 100;
    emit();
    return { ok: true, project: p };
  }

  function toggleMilestone(projectId, milestoneId) {
    if (!guard()) return { ok: false, reason: "publico" };
    const p = projectById(projectId);
    if (!p) return { ok: false };
    const m = p.milestones.find((x) => x.id === milestoneId);
    if (!m) return { ok: false };
    m.done = !m.done;
    log(`${m.done ? "Marco concluído" : "Marco reaberto"}: ${m.title}`);
    emit();
    return { ok: true };
  }

  function rescheduleTask(id, date) {
    if (!guard()) return { ok: false, reason: "publico" };
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return { ok: false };
    task.date = date || todayISO();
    task.done = false;
    log("Tarefa puxada para hoje: " + task.title);
    emit();
    return { ok: true, task };
  }

  function scheduleClientAction(clientId) {
    if (!guard()) return { ok: false, reason: "publico" };
    const client = clientById(clientId);
    if (!client || !String(client.nextAction || "").trim()) return { ok: false, reason: "empty" };
    const title = client.nextAction.trim();
    const today = todayISO();
    const same = state.tasks.find((t) => !t.done && t.date === today && t.title === title);
    if (same) return { ok: true, task: same, same: true };
    return addTask({
      title: title,
      projectId: client.projectId || null,
      tag: client.company || "Relação",
      priority: "alta",
      time: "17:00",
      block: "tarde",
      date: today,
      detail: "Veio da próxima ação de " + client.name + ".",
    });
  }

  function deliveryBlockers(id) {
    const project = projectById(id);
    if (!project) return { milestones: [], tasks: [], balance: 0 };
    const balance = Math.max(0, Number(project.value || 0) - Number(project.paid || 0));
    return {
      milestones: (project.milestones || []).filter((m) => !m.done),
      tasks: state.tasks.filter((t) => t.projectId === project.id && !t.done),
      balance: balance,
    };
  }

  function addClient(data) {
    if (!guard()) return { ok: false, reason: "publico" };
    const name = data.name.trim();
    const parts = name.split(" ").filter(Boolean);
    const initials = ((parts[0] || "C")[0] + (parts[1] ? parts[1][0] : parts[0][1] || "")).toUpperCase();
    const client = {
      id: uid("c"),
      name,
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
    state.clients.unshift(client);
    if (client.stage === "qualificado") state.funnel.qualificados += 1;
    if (client.stage === "proposta") state.funnel.propostas += 1;
    if (client.stage === "negociacao") state.funnel.negociacoes += 1;
    if (client.stage === "ativo") state.funnel.fechamentos += 1;
    log(`Cliente no radar: ${client.name}`);
    emit();
    return { ok: true, client };
  }

  function updateClient(id, patch) {
    if (!guard()) return { ok: false, reason: "publico" };
    const c = clientById(id);
    if (!c) return { ok: false };
    Object.assign(c, patch);
    emit();
    return { ok: true, client: c };
  }

  function logContact(id, text) {
    if (!guard()) return { ok: false, reason: "publico" };
    const c = clientById(id);
    if (!c) return { ok: false };
    c.contactAt = new Date().toISOString();
    c.timeline.unshift({ at: c.contactAt, text: text || "Contato registrado." });
    log(`Contato com ${c.name}: ${text || "registrado"}`);
    emit();
    return { ok: true };
  }

  function cycleStage(id) {
    if (!guard()) return { ok: false, reason: "publico" };
    const order = ["lead", "qualificado", "proposta", "negociacao", "ativo"];
    const c = clientById(id);
    if (!c) return { ok: false };
    if (c.stage === "perdido") return { ok: false, reason: "lost" };
    const i = Math.max(0, order.indexOf(c.stage));
    const next = order[Math.min(order.length - 1, i + 1)];
    if (next === c.stage) return { ok: true, client: c, same: true };
    c.stage = next;
    if (next === "proposta") state.funnel.propostas += 1;
    if (next === "negociacao") state.funnel.negociacoes += 1;
    if (next === "ativo") state.funnel.fechamentos += 1;
    c.timeline.unshift({ at: new Date().toISOString(), text: `Etapa avançou para ${labelStage(next)}.` });
    log(`${c.name} foi para ${labelStage(next)}.`);
    emit();
    return { ok: true, client: c };
  }

  function labelStage(stage) {
    return (
      {
        lead: "Lead",
        qualificado: "Qualificado",
        proposta: "Proposta",
        negociacao: "Negociação",
        ativo: "Cliente ativo",
        perdido: "Perdido",
      }[stage] || stage
    );
  }

  function labelStatus(status) {
    return (
      {
        descoberta: "Descoberta",
        producao: "Produção",
        revisao: "Revisão",
        entregue: "Entregue",
      }[status] || status
    );
  }

  function runAutomation(id) {
    if (!guard()) return { ok: false, reason: "publico" };
    const a = state.automations.find((x) => x.id === id);
    if (!a) return { ok: false };
    const now = new Date().toISOString();
    let ok = true;
    let msg = "Execução manual concluída.";
    if (a.id === "stripe" && a.status === "atencao") {
      ok = false;
      msg = "401 · assinatura ainda inválida. Feche o runbook antes de reprocessar.";
    } else if (a.id === "stripe") {
      msg = "invoice.paid notificado em #pagamentos.";
    } else if (a.id === "backup") {
      msg = "Snapshot manual concluído.";
    } else if (a.id === "lead") {
      msg = "Varredura do formulário sem lead novo.";
    }
    a.runs += 1;
    a.lastRun = now;
    a.logs.unshift({ at: now, ok, msg });
    a.logs = a.logs.slice(0, 12);
    log(`${a.name}: ${msg}`);
    emit();
    return { ok: true, success: ok, automation: a, msg };
  }

  function toggleFix(id, key) {
    if (!guard()) return { ok: false, reason: "publico" };
    const a = state.automations.find((x) => x.id === id);
    if (!a || !a.fixes) return { ok: false };
    a.fixes[key] = !a.fixes[key];
    emit();
    return { ok: true };
  }

  function resolveAutomation(id) {
    if (!guard()) return { ok: false, reason: "publico" };
    const a = state.automations.find((x) => x.id === id);
    if (!a || !a.fixes) return { ok: false };
    const ready = Object.values(a.fixes).every(Boolean);
    if (!ready) return { ok: false, reason: "incomplete" };
    a.status = "ativa";
    a.error = "";
    a.nodes.forEach((n) => delete n.warn);
    const now = new Date().toISOString();
    a.lastRun = now;
    a.runs += 1;
    a.logs.unshift({ at: now, ok: true, msg: "Correção registrada · webhook aceito · Discord notificado." });
    if (state.integrations.stripe) {
      state.integrations.stripe.status = "operacional";
      state.integrations.stripe.hint = "Webhook aceito";
    }
    log("Stripe Sync voltou a operar.");
    emit();
    return { ok: true };
  }

  function addAutomation(data) {
    if (!guard()) return { ok: false, reason: "publico" };
    const a = {
      id: uid("au"),
      name: data.name.trim(),
      platform: data.platform || "n8n",
      status: "ativa",
      runs: 0,
      lastRun: new Date().toISOString(),
      successRate: 100,
      avg: "—",
      summary: data.summary || "Fluxo criado no workspace.",
      nodes: [
        { icon: "bolt", label: data.trigger || "Gatilho" },
        { icon: "filter", label: "Processar" },
        { icon: "db", label: "Registrar" },
      ],
      fixes: null,
      logs: [{ at: new Date().toISOString(), ok: true, msg: "Workflow registrado. Ainda sem execução externa." }],
    };
    state.automations.unshift(a);
    log(`Automação criada: ${a.name}`);
    emit();
    return { ok: true, automation: a };
  }

  function addArsenal(data) {
    if (!guard()) return { ok: false, reason: "publico" };
    const item = {
      id: uid("ar"),
      type: data.type || "prompt",
      version: data.version || "v1.0",
      star: false,
      name: data.name.trim(),
      summary: data.summary || "",
      tags: (data.tags || "").split(",").map((s) => s.trim()).filter(Boolean).map((s) => s.toUpperCase()),
      uses: 0,
      body: data.body || "",
    };
    state.arsenal.unshift(item);
    log(`Item no arsenal: ${item.name}`);
    emit();
    return { ok: true, item };
  }

  function bumpUse(id) {
    const item = state.arsenal.find((a) => a.id === id);
    if (!item) return;
    item.uses += 1;
    emit();
  }

  function confirmMovement(id) {
    if (!guard()) return { ok: false, reason: "publico" };
    const m = state.movements.find((x) => x.id === id);
    if (!m || m.status === "recebido" || m.status === "pago") return { ok: false };
    m.status = m.kind === "entrada" ? "recebido" : "pago";
    m.date = todayISO();
    if (m.projectId && m.kind === "entrada") {
      const p = projectById(m.projectId);
      if (p) p.paid = Number(p.paid || 0) + Number(m.amount || 0);
    }
    log(`Recebimento confirmado: ${m.title}`);
    emit();
    return { ok: true };
  }

  function addMovement(data) {
    if (!guard()) return { ok: false, reason: "publico" };
    const m = {
      id: uid("mv"),
      title: data.title.trim(),
      kind: data.kind || "entrada",
      amount: Number(data.amount || 0),
      status: data.status || "previsto",
      cadence: "unico",
      date: data.date || todayISO(),
      projectId: data.projectId || null,
      note: data.note || "",
    };
    state.movements.unshift(m);
    if (m.projectId && m.kind === "entrada" && m.status === "recebido") {
      const p = projectById(m.projectId);
      if (p) p.paid = Number(p.paid || 0) + m.amount;
    }
    log(`Lançamento: ${m.title}`);
    emit();
    return { ok: true, movement: m };
  }

  function setIntegration(name, hint) {
    if (!guard()) return { ok: false, reason: "publico" };
    if (!state.integrations[name]) return { ok: false };
    state.integrations[name].status = hint ? "operacional" : state.integrations[name].status;
    state.integrations[name].hint = hint ? "Chave salva só neste navegador" : state.integrations[name].hint;
    state.integrations[name].saved = Boolean(hint);
    emit();
    return { ok: true };
  }

  function markSeen(id) {
    if (!state.seen.includes(id)) state.seen.push(id);
    emit();
  }

  function markAllSeen(ids) {
    let changed = false;
    (ids || []).forEach((id) => {
      if (!state.seen.includes(id)) {
        state.seen.push(id);
        changed = true;
      }
    });
    if (changed) emit();
  }

  function markWelcomed() {
    state.welcomed = true;
    persist();
  }

  function reset() {
    state = window.VHData.buildSeed();
    state.welcomed = true;
    undo = null;
    log("Workspace restaurado para a semente recuperada.");
    emit();
  }

  function exportState() {
    return JSON.stringify({ exportedAt: new Date().toISOString(), product: "Victor Hub AI", state }, null, 2);
  }

  function importState(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    const next = data.state || data;
    if (!next || next.version !== 1 || !Array.isArray(next.projects)) {
      throw new Error("Backup inválido");
    }
    state = next;
    log("Backup importado.");
    emit();
  }

  function notifications() {
    const items = [];
    const stripe = state.automations.find((a) => a.id === "stripe");
    if (stripe && stripe.status === "atencao") {
      items.push({
        id: "n-stripe",
        tone: "yellow",
        title: "Stripe Sync em atenção",
        text: stripe.error || "Webhook sem notificar o Discord.",
        href: "/sistema/automacoes",
        focus: "stripe",
      });
    }
    state.projects.filter(inCriticalPhase).forEach((p) => {
      const d = daysUntil(p.deadline);
      items.push({
        id: "n-p-" + p.id,
        tone: p.critical ? "red" : "yellow",
        title: p.critical ? p.name + " está crítico" : p.name + " entra em fase crítica",
        text: d < 0 ? "Marco atrasado: " + p.milestone : p.milestone + " em " + d + " dia" + (d === 1 ? "" : "s") + ".",
        href: "/sistema/projetos",
        focus: p.id,
      });
    });
    if (state.prefs.alerts) {
      state.clients.forEach((c) => {
        if (c.stage === "perdido" || c.stage === "ativo") return;
        const hours = (Date.now() - new Date(c.contactAt).getTime()) / 36e5;
        if (hours >= 48) {
          items.push({
            id: "n-c-" + c.id,
            tone: "yellow",
            title: c.name + " sem contato",
            text: "Negociação ou proposta parada. Próxima ação: " + c.nextAction,
            href: "/sistema/clientes",
            focus: c.id,
          });
        }
      });
    }
    const pending = state.tasks.filter((t) => t.date === todayISO() && !t.done);
    if (pending.length) {
      const crit = pending.find((t) => t.priority === "critica");
      items.push({
        id: "n-tasks",
        tone: crit ? "red" : "zinc",
        title: pending.length + " no foco de hoje",
        text: crit ? "Comece pelo crítico: " + crit.title : "A agenda ainda tem bloco aberto.",
        href: "/sistema/tarefas",
      });
    }
    return items;
  }

  window.VH = {
    load,
    get: () => state,
    subscribe,
    todayISO,
    monthKey,
    daysUntil,
    inCriticalPhase,
    kpis,
    clientById,
    projectById,
    labelStage,
    labelStatus,
    setMode,
    setPrefs,
    setProfile,
    toggleTask,
    undoLast,
    addTask,
    rescheduleTask,
    scheduleClientAction,
    deliveryBlockers,
    addProject,
    updateProject,
    toggleMilestone,
    addClient,
    updateClient,
    logContact,
    cycleStage,
    runAutomation,
    toggleFix,
    resolveAutomation,
    addAutomation,
    addArsenal,
    bumpUse,
    addMovement,
    setIntegration,
    notifications,
    markSeen,
    markWelcomed,
    reset,
    exportState,
    importState,
    guard,
    log,
    emit,
  };
})();
