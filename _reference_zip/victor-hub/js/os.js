/* Victor Hub OS — cockpit operacional. */
(function () {
  const VH = window.VH;
  const MONTHS = window.VHData.MONTHS;

  const PATHS = {
    bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
    command: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>',
    projects: '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 12h18"></path>',
    clients: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    tasks: '<path d="m5 12 4 4L19 6"></path>',
    autos: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M9 2v2M15 2v2M9 20v2M15 20v2M20 9h2M20 15h2M2 9h2M2 15h2"></path>',
    arsenal: '<ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>',
    finance: '<path d="M19 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"></path><path d="M16 13h4"></path>',
    settings: '<circle cx="12" cy="12" r="3"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>',
    search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3-3"></path>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"></path><path d="M10 21a2 2 0 0 0 4 0"></path>',
    plus: '<path d="M12 5v14M5 12h14"></path>',
    back: '<path d="M19 12H5"></path><path d="m11 18-6-6 6-6"></path>',
    close: '<path d="M6 6l12 12M18 6 6 18"></path>',
    trend: '<path d="M3 17l6-6 4 4 8-8"></path><path d="M14 7h7v7"></path>',
    box: '<path d="M21 8 12 3 3 8l9 5 9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8L4 5z"></path>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"></path>',
    chat: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0z"></path>',
    spark: '<path d="m12 3 1.6 4.8L18 9.5l-4.4 1.6L12 16l-1.6-4.9L6 9.5l4.4-1.7L12 3z"></path>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path>',
    play: '<polygon points="8 5 19 12 8 19 8 5"></polygon>',
  };

  const NAV = [
    { href: "/sistema", id: "comando", label: "Comando", icon: "command" },
    { href: "/sistema/projetos", id: "projetos", label: "Projetos", icon: "projects", badge: "projects" },
    { href: "/sistema/clientes", id: "clientes", label: "Clientes", icon: "clients" },
    { href: "/sistema/tarefas", id: "tarefas", label: "Tarefas", icon: "tasks", badge: "tasks" },
    { href: "/sistema/automacoes", id: "automacoes", label: "Automações", icon: "autos" },
    { href: "/sistema/arsenal", id: "arsenal", label: "Arsenal", icon: "arsenal" },
    { href: "/sistema/financeiro", id: "financeiro", label: "Financeiro", icon: "finance" },
    { href: "/sistema/configuracoes", id: "configuracoes", label: "Configurações", icon: "settings" },
  ];

  const ui = {
    palette: false,
    q: "",
    pi: 0,
    notify: false,
    novo: false,
    more: false,
    modal: null,
    drawer: null,
    filter: "todos",
    assetFilter: "todos",
    clientId: null,
    autoId: "backup",
    projectView: "tabela",
    clientView: "radar",
    room: null,
    toasts: [],
    focus: null,
  };
  let resetScroll = false;
  let focusPalette = false;

  function icon(name, size) {
    const s = size || 17;
    return '<svg aria-hidden="true" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (PATHS[name] || "") + "</svg>";
  }
  function logo(size) {
    const s = size || 18;
    return '<svg aria-hidden="true" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
  }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function money(n) {
    return "R$ " + Math.round(Number(n) || 0).toLocaleString("pt-BR");
  }
  function shortDate(iso) {
    if (!iso) return "—";
    const p = iso.split("-");
    return p[2] + " " + MONTHS[Number(p[1]) - 1];
  }
  function weekday(iso) {
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "long" }).format(new Date(iso + "T12:00:00-03:00"));
  }
  function headerDate() {
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "long", day: "numeric", month: "long" }).format(new Date());
  }
  function clockNow() {
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).format(new Date());
  }
  function dayKey(iso) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date(iso));
  }
  function rel(iso) {
    if (!iso) return "—";
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return "—";
    const min = Math.floor((Date.now() - t) / 60000);
    if (min < 1) return "agora";
    if (min < 60) return "há " + min + " min";
    const day = dayKey(iso);
    const today = VH.todayISO();
    const y = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date(Date.now() - 86400000));
    if (day === today) return "há " + Math.floor(min / 60) + "h";
    if (day === y) return "ontem";
    const days = Math.max(1, Math.round((new Date(today + "T12:00:00-03:00") - new Date(day + "T12:00:00-03:00")) / 86400000));
    return "há " + days + " dias";
  }
  function whenRun(iso) {
    if (!iso) return "—";
    const hm = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
    const day = dayKey(iso);
    if (hm === "03:00" && day === VH.todayISO()) return "hoje, 03:00";
    if (hm === "03:00" && day === dayKey(new Date(Date.now() - 86400000).toISOString())) return "ontem, 03:00";
    return rel(iso);
  }
  function stamp(iso) {
    const d = new Date(iso);
    const day = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "short" }).format(d).replace(".", "");
    const hm = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).format(d);
    return day + " · " + hm;
  }
  function fmtLeft(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }
  function prioLabel(p) {
    return { critica: "crítica", alta: "alta", media: "média", baixa: "baixa" }[p] || p;
  }
  function dotOf(status) {
    return { descoberta: "zinc", producao: "yellow", revisao: "green", entregue: "green", ativa: "green", atencao: "yellow", negociacao: "yellow", proposta: "yellow", ativo: "green", perdido: "red", qualificado: "zinc", lead: "zinc" }[status] || "zinc";
  }
  function path() {
    let p = location.pathname;
    if (p.endsWith("sistema.html")) p = "/sistema";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  }
  function current() {
    const p = path();
    const hit = NAV.find((n) => n.href !== "/sistema" && p.startsWith(n.href));
    return hit ? hit.id : "comando";
  }
  function state() { return VH.get(); }
  function clientOf(id) { return VH.clientById(id); }
  function projectOf(id) { return VH.projectById(id); }
  function typing(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }
  function locked() {
    if (VH.guard()) return false;
    toast("Ambiente público. Ative Operacional no cabeçalho para editar.");
    return true;
  }

  function toast(msg, canUndo) {
    const id = Date.now() + Math.random();
    ui.toasts.push({ id, msg, canUndo: !!canUndo });
    renderToasts();
    setTimeout(() => {
      ui.toasts = ui.toasts.filter((t) => t.id !== id);
      renderToasts();
    }, canUndo ? 6400 : 4200);
  }
  function renderToasts() {
    const root = document.getElementById("toasts");
    if (!root) return;
    root.innerHTML = ui.toasts.map((t) =>
      '<div class="toast" role="status"><span>' + esc(t.msg) + "</span>" +
      (t.canUndo ? '<button data-act="undo">Desfazer</button>' : "") + "</div>"
    ).join("");
  }

  function shell() {
    const s = state();
    return (
      '<div class="os' + (s.prefs.density === "compact" ? " compact" : "") + '" id="os">' +
      '<aside class="sidebar"><div class="brand"><div class="logo">' + logo(18) + '</div><div><div class="brand-name">Victor Hub AI</div><div class="brand-kicker">Production OS</div></div></div>' +
      '<nav class="nav" id="sidenav">' + navHTML("side") + "</nav>" +
      '<div class="side-foot"><div class="health" id="health"></div>' +
      '<div class="user"><div class="avatar">V</div><div><p class="user-name">' + esc(s.profile.name) + '</p><p class="user-meta">Owner · ' + esc(s.profile.version) + '</p></div>' +
      '<button class="icon-btn" style="margin-left:auto" aria-label="Abrir configurações" data-act="go" data-href="/sistema/configuracoes">' + icon("settings", 16) + "</button></div>" +
      '<a class="back-link" href="/">' + icon("back", 14) + " Voltar ao site</a></div></aside>" +
      '<div class="workspace"><header class="topbar">' +
      '<div class="live-date"><div class="when" id="when"></div><div class="live-flag"><i></i>Operação ao vivo · <span id="clock"></span></div></div>' +
      '<div class="search"><button class="search-fake" data-act="palette" aria-label="Buscar, criar ou executar">' + icon("search", 16) + "<span>Buscar, criar ou executar...</span><kbd class=\"kbd\">Ctrl K</kbd></button></div>" +
      '<div class="top-actions"><button class="focus-pill" id="focus-pill" data-act="focus-stop" title="Encerrar foco">' + icon("spark", 14) + "<b>25:00</b></button>" +
      '<button class="icon-btn bell" data-act="notify" aria-label="Notificações">' + icon("bell", 18) + '<span class="ping" id="bell-ping"></span></button>' +
      '<button class="mode-btn" id="mode-btn" data-act="toggle-mode"></button>' +
      '<button class="primary" data-act="novo" aria-label="Novo">' + icon("plus", 16) + '<span class="label">Novo</span></button></div></header>' +
      '<main class="main" id="main"></main></div>' +
      '<nav class="bottom-nav" id="bottom"></nav>' +
      '<div id="overlays"></div><div class="toasts" id="toasts" aria-live="polite"></div></div>'
    );
  }

  function navHTML(kind) {
    return NAV.map((n) => {
      const badge = n.badge === "projects" ? '<span class="count" data-badge="projects"></span>' : n.badge === "tasks" ? '<span class="count hot" data-badge="tasks"></span>' : "";
      if (kind === "bottom") return "";
      return '<button class="nav-link" data-act="go" data-href="' + n.href + '" data-nav="' + n.id + '">' + icon(n.icon) + '<span class="label">' + n.label + "</span>" + badge + "</button>";
    }).join("");
  }

  function updateChrome() {
    const s = state();
    const k = VH.kpis();
    const id = current();
    document.querySelectorAll("[data-nav]").forEach((el) => el.classList.toggle("is-active", el.dataset.nav === id));
    document.querySelectorAll('[data-badge="projects"]').forEach((el) => { el.textContent = String(k.active); });
    document.querySelectorAll('[data-badge="tasks"]').forEach((el) => {
      el.textContent = String(k.pending);
      el.style.display = k.pending ? "" : "none";
    });
    const when = document.getElementById("when");
    if (when) when.textContent = headerDate();
    const clock = document.getElementById("clock");
    if (clock) clock.textContent = clockNow();
    const mode = document.getElementById("mode-btn");
    if (mode) {
      const live = s.prefs.mode !== "publico";
      mode.classList.toggle("is-live", live);
      mode.innerHTML = '<span class="dot ' + (live ? "green" : "yellow") + '"></span>' + (live ? "Operacional" : "Público");
    }
    const health = document.getElementById("health");
    if (health) {
      if (s.prefs.mode === "publico") {
        health.innerHTML = '<div class="health-top"><span class="kicker">System health</span><span class="dot yellow beat"></span></div><div class="health-label">Modo de visualização</div><div class="bar yellow"><i style="width:72%"></i></div>';
      } else {
        health.innerHTML = '<div class="health-top"><span class="kicker">System health</span><span class="dot green beat"></span></div><div class="health-label">Banco sincronizado</div><div class="bar"><i class="ok" style="width:100%"></i></div>';
      }
    }
    const notes = VH.notifications();
    const unread = notes.filter((n) => !s.seen.includes(n.id)).length;
    const ping = document.getElementById("bell-ping");
    if (ping) ping.style.display = unread && s.prefs.alerts ? "" : "none";
    const bottom = document.getElementById("bottom");
    if (bottom) {
      const items = NAV.slice(0, 4).map((n) =>
        '<button data-act="go" data-href="' + n.href + '" class="' + (id === n.id ? "is-on" : "") + '">' + icon(n.icon, 16) + "<span>" + n.label + "</span></button>"
      ).join("") + '<button data-act="more" class="' + (id === "arsenal" || id === "financeiro" || id === "configuracoes" ? "is-on" : "") + '">' + icon("command", 16) + "<span>Mais</span></button>";
      bottom.innerHTML = items;
    }
    const pill = document.getElementById("focus-pill");
    if (pill) {
      pill.classList.toggle("show", !!ui.focus);
      if (ui.focus) {
        const b = pill.querySelector("b");
        if (b) b.textContent = fmtLeft(ui.focus.ends - Date.now());
      }
    }
    document.title = ({ comando: "Sistema — Comando", projetos: "Sistema — Projetos", clientes: "Sistema — Clientes", tarefas: "Sistema — Tarefas", automacoes: "Sistema — Automações", arsenal: "Sistema — Arsenal", financeiro: "Sistema — Financeiro", configuracoes: "Sistema — Configurações" }[id] || "Sistema") + " — Victor Hub AI";
    document.getElementById("os").classList.toggle("compact", s.prefs.density === "compact");
    document.documentElement.classList.toggle("reduce-motion", !!s.prefs.reduceMotion);
    const name = document.querySelector(".user-name");
    if (name) name.textContent = s.profile.name || "Victor";
  }

  function head(kicker, title, sub, extra) {
    return '<div class="page-head"><div class="kicker red">' + kicker + "</div><h1 class=\"page-title\">" + title + "</h1>" +
      (sub ? '<p class="page-sub">' + sub + "</p>" : "") + (extra || "") + "</div>";
  }
  function progress(pct, width) {
    const n = Math.max(0, Math.min(100, Number(pct) || 0));
    return '<div class="progress" style="width:' + (width || 132) + 'px"><div class="track"><i style="width:' + n + '%;display:block;height:100%;background:#ef233c"></i></div><b>' + n + "%</b></div>";
  }
  function statusPill(status, label) {
    return '<span class="status"><span class="dot ' + dotOf(status) + '"></span>' + esc(label || VH.labelStatus(status)) + "</span>";
  }
  function taskRow(t) {
    return '<div class="task-row' + (t.done ? " done" : "") + '">' +
      '<button class="check' + (t.done ? " on" : "") + '" data-act="toggle-task" data-id="' + t.id + '" aria-label="Concluir tarefa">' + (t.done ? icon("tasks", 12) : "") + "</button>" +
      '<span class="prio ' + t.priority + '"></span>' +
      '<button class="task-main" data-act="open-task" data-id="' + t.id + '"><div class="task-title">' + esc(t.title) + '</div><div class="meta"><span class="chip">' + esc(t.tag) + "</span><span>" + prioLabel(t.priority) + "</span></div></button>" +
      '<div class="time">' + esc(t.time) + "</div></div>";
  }

  function nextMove() {
    const s = state();
    const today = s.tasks.filter((t) => t.date === VH.todayISO() && !t.done);
    const weight = { critica: 0, alta: 1, media: 2, baixa: 3 };
    today.sort((a, b) => (weight[a.priority] ?? 9) - (weight[b.priority] ?? 9) || a.time.localeCompare(b.time));
    const crit = today.find((t) => t.priority === "critica");
    if (crit) return { kicker: "Agora · crítico", title: crit.title, why: crit.detail || "Isso trava o resto do dia.", time: crit.time, act: "open-task", id: crit.id, focus: crit.id };
    const stripe = s.automations.find((a) => a.status === "atencao");
    if (stripe) return { kicker: "Agora · automação", title: stripe.name, why: stripe.error || "Um fluxo parou de avisar.", time: whenRun(stripe.lastRun), act: "open-auto", id: stripe.id };
    const stale = s.clients.filter((c) => c.stage === "negociacao" || c.stage === "proposta").sort((a, b) => new Date(a.contactAt) - new Date(b.contactAt))[0];
    if (stale && (Date.now() - new Date(stale.contactAt)) / 36e5 >= 48) return { kicker: "Agora · relação", title: stale.name, why: stale.nextAction, time: rel(stale.contactAt), act: "open-client", id: stale.id };
    const hot = s.projects.find((p) => VH.inCriticalPhase(p));
    if (hot) return { kicker: "Agora · projeto", title: hot.name, why: hot.milestone + " · " + shortDate(hot.deadline) + ". " + (hot.notes || hot.brief || ""), time: shortDate(hot.deadline), act: "open-project", id: hot.id };
    if (today[0]) return { kicker: "Agora · foco", title: today[0].title, why: today[0].detail || "Próximo bloco aberto.", time: today[0].time, act: "open-task", id: today[0].id, focus: today[0].id };
    return { kicker: "Agora", title: "O dia está limpo", why: "Nada crítico na fila. O radar segue aberto.", time: "", act: "go", href: "/sistema/projetos" };
  }
  function agoraHTML() {
    const n = nextMove();
    return '<section class="agora"><div><div class="kicker red">' + esc(n.kicker) + "</div><h2>" + esc(n.title) + '</h2><p class="why">' + esc(n.why) + '</p><div class="actions">' +
      '<button class="primary" data-act="' + n.act + '"' + (n.id ? ' data-id="' + n.id + '"' : "") + (n.href ? ' data-href="' + n.href + '"' : "") + ">Abrir</button>" +
      (n.focus ? '<button class="soft" data-act="focus-start" data-id="' + n.focus + '">Focar 25 min</button>' : "") +
      '</div></div><div class="agora-side"><div class="kicker">Janela</div><div class="time">' + esc(n.time || "—") + "</div></div></section>";
  }
  function feedHTML() {
    const items = (state().activity || []).slice(0, 5);
    if (!items.length) return "";
    return '<section class="glass panel" style="margin-top:18px"><div class="row-between"><h2 style="font-family:var(--display);font-size:15px;margin:0">Pulso da operação</h2><span class="kicker">ao vivo</span></div>' +
      items.map((ev) => '<div class="feed-item"><time class="time">' + esc(rel(ev.at)) + "</time><div>" + esc(ev.text) + "</div></div>").join("") + "</section>";
  }
  function switcher(act, current, items) {
    return '<div class="seg">' + items.map(([id, label]) => '<button type="button" data-act="' + act + '" data-id="' + id + '" class="' + (current === id ? "is-on" : "") + '">' + label + "</button>").join("") + "</div>";
  }
  function boardHTML() {
    const cols = [["descoberta", "Descoberta"], ["producao", "Produção"], ["revisao", "Revisão"], ["entregue", "Entregue"]];
    return '<div class="board">' + cols.map(([status, label]) => {
      const list = state().projects.filter((p) => p.status === status);
      return '<section class="lane"><div class="lane-top"><b>' + label + '</b><span class="kicker">' + list.length + "</span></div>" +
        (list.length ? list.map((p) => {
          const c = clientOf(p.clientId);
          return '<div class="bcard"><button class="bcard" style="border:0;background:transparent;padding:0" data-act="open-project" data-id="' + p.id + '"><div class="row-between"><div class="letter">' + esc(p.letter) + "</div>" + (p.critical ? '<span class="flag">CRÍTICO</span>' : statusPill(p.status)) + "</div><h3>" + esc(p.name) + '</h3><div class="sub">' + esc(c ? c.company : "Sem cliente") + "</div>" + progress(p.progress, 160) + '<div class="mini-foot"><span>' + money(p.value) + "</span><span>" + esc(p.milestone) + "</span></div></button>" +
            (status !== "entregue" ? '<button class="link-red" data-act="advance-project" data-id="' + p.id + '" style="margin-top:8px">Avançar estágio</button>' : "") + "</div>";
        }).join("") : '<div class="empty">Vazio</div>') + "</section>";
    }).join("") + "</div>";
  }
  function pipelineHTML() {
    const cols = [["lead", "Lead"], ["qualificado", "Qualificado"], ["proposta", "Proposta"], ["negociacao", "Negociação"], ["ativo", "Ativo"], ["perdido", "Perdido"]];
    return '<div class="lanes">' + cols.map(([stage, label]) => {
      const list = state().clients.filter((c) => c.stage === stage);
      const sum = list.reduce((s, c) => s + Number(c.value || 0), 0);
      return '<section class="lane"><div class="lane-top"><b>' + label + '</b><span class="kicker">' + (sum ? money(sum) : list.length) + "</span></div>" +
        (list.length ? list.map((c) => '<button class="bcard' + (c.id === ui.clientId ? " is-selected" : "") + '" data-act="select-client" data-id="' + c.id + '"><div class="avatar" style="width:28px;height:28px">' + esc(c.initials) + "</div><h3>" + esc(c.name) + '</h3><div class="sub">' + esc(c.company) + "</div><div class=\"mini-foot\"><span>" + money(c.value) + "</span><span>" + esc(rel(c.contactAt)) + "</span></div></button>").join("") : '<div class="empty">—</div>') +
        "</section>";
    }).join("") + "</div>";
  }
  function composeText(assetId, projectId) {
    const s = state();
    const asset = s.arsenal.find((a) => a.id === assetId) || s.arsenal[0];
    const p = projectOf(projectId) || s.projects[0];
    if (!asset) return "";
    if (!p) return asset.body;
    const c = clientOf(p.clientId);
    const client = c ? c.name : "o cliente";
    const company = c ? c.company : "a empresa";
    const marks = (p.milestones || []).map((m) => (m.done ? "feito · " : "aberto · ") + m.title).join("\n");
    if (asset.id === "proposta") {
      return "Proposta — " + p.name + " · " + company + "\n\n1. Leitura\n" + (p.brief || "Ainda sem brief.") + "\n\n2. Direção\n" + (p.notes || "Uma decisão só: o que muda a percepção, não o que enfeita.") + "\n\n3. Fases\n" + marks + "\n\nPróximo marco: " + p.milestone + " · " + shortDate(p.deadline) + "\n\n4. Investimento\n" + money(p.value) + "\nJá recebido: " + money(p.paid || 0) + "\nSaldo: " + money((p.value || 0) - (p.paid || 0)) + "\n\n5. Próximo passo\n" + (c ? c.nextAction : "Marcar o kickoff com pauta.") + "\n\nTom: sóbrio, específico, seguro. Preço na mesma página do escopo.";
    }
    if (asset.id === "vsl" || asset.id === "brief") {
      return "Peça — " + p.name + "\nPara: " + client + " · " + company + "\nMarco: " + p.milestone + " · " + shortDate(p.deadline) + "\nValor: " + money(p.value) + "\n\nGancho\n" + (p.brief || "").split(". ")[0] + ".\n\nO que está em jogo\n" + (p.notes || p.brief || "") + "\n\nMecanismo\n" + ((p.stack || []).join(" · ") || "Método do estúdio") + ".\n\nOferta\n" + marks + "\n\nPróxima frase para mandar\n" + (c ? c.nextAction : "Fechar o próximo marco.") + "\n\n---\nBase do arsenal · " + asset.name + "\n" + asset.body;
    }
    return asset.body.replaceAll("{{projeto}}", p.name).replaceAll("{{cliente}}", client).replaceAll("{{oferta}}", p.name).replaceAll("{{quem}}", company).replaceAll("{{resultado}}", p.milestone) + "\n\n---\nContexto aplicado\nProjeto: " + p.name + "\nCliente: " + company + "\nValor: " + money(p.value) + "\nBrief: " + (p.brief || "—");
  }
  function roomView(id) {
    const p = projectOf(id);
    if (!p) return '<button class="link-red room-back" data-act="close-room">← Operações</button><p class="note">Esse projeto não está mais no cockpit.</p>';
    const c = clientOf(p.clientId);
    const tasks = state().tasks.filter((t) => t.projectId === p.id);
    const late = VH.daysUntil(p.deadline);
    const doneM = (p.milestones || []).filter((m) => m.done).length;
    return '<button class="link-red room-back" data-act="close-room">← Operações</button>' +
      head("SALA DO PROJETO", esc(p.name), esc(c ? c.company + " · " + c.name : "Sem cliente")) +
      '<div class="kpi-grid">' +
      kpi("Valor", icon("finance", 15), money(p.value), "contrato") +
      kpi("Recebido", icon("trend", 15), money(p.paid || 0), "saldo " + money((p.value || 0) - (p.paid || 0))) +
      kpi("Marco", icon("tasks", 15), doneM + "/" + (p.milestones || []).length, esc(p.milestone)) +
      kpi("Prazo", icon("spark", 15), shortDate(p.deadline), late < 0 ? "atrasado" : "em " + late + " dia" + (late === 1 ? "" : "s")) +
      "</div>" +
      (p.status !== "entregue" && gateLines(p.id).length ? '<div class="gate-note"><div class="kicker red">Trava de entrega</div><p class="note" style="margin:6px 0 0">' + esc(gateLines(p.id)[0]) + (gateLines(p.id).length > 1 ? " · mais " + (gateLines(p.id).length - 1) : "") + '</p><button class="link-red" data-act="open-gate" data-id="' + p.id + '" style="margin-top:8px">Ver o que impede entregar</button></div>' : "") +
      '<div class="room-grid"><section class="glass panel"><div class="row-between"><h2 style="font-family:var(--display);font-size:16px;margin:0">Direção</h2>' + (p.critical ? '<span class="flag">CRÍTICO</span>' : "") + "</div>" +
      '<div class="two" style="margin-top:14px"><div class="field"><span>Status</span><select data-act="project-status" data-id="' + p.id + '">' + options([["descoberta", "Descoberta"], ["producao", "Produção"], ["revisao", "Revisão"], ["entregue", "Entregue"]], p.status) + '</select></div><div class="field"><span>Prazo</span><input type="date" data-act="project-deadline" data-id="' + p.id + '" value="' + esc(p.deadline) + '"></div></div>' +
      '<div class="field"><span>Progresso · <b id="prog-val">' + p.progress + '%</b></span><input class="range" type="range" min="0" max="100" value="' + p.progress + '" data-act="project-progress" data-id="' + p.id + '"></div>' +
      '<div class="kicker">Brief</div><p class="note">' + esc(p.brief || "Sem brief ainda.") + "</p>" +
      '<div class="kicker" style="margin-top:16px">Marcos</div><div class="task-list">' + (p.milestones || []).map((m) =>
        '<div class="task-row' + (m.done ? " done" : "") + '"><button class="check' + (m.done ? " on" : "") + '" data-act="milestone" data-id="' + p.id + '" data-ms="' + m.id + '">' + (m.done ? icon("tasks", 12) : "") + '</button><div class="task-title">' + esc(m.title) + "</div></div>"
      ).join("") + "</div>" +
      '<div class="field" style="margin-top:12px"><span>Nota de produção</span><textarea id="project-note">' + esc(p.notes || "") + '</textarea></div><div class="actions"><button class="soft" data-act="save-project-note" data-id="' + p.id + '">Salvar nota</button><button class="soft" data-act="toggle-critical" data-id="' + p.id + '">' + (p.critical ? "Tirar crítico" : "Marcar crítico") + "</button></div></section>" +
      '<div class="stack"><section class="glass panel"><h2 style="font-family:var(--display);font-size:16px;margin:0 0 8px">Execução</h2>' +
      (tasks.length ? '<div class="task-list">' + tasks.map(taskRow).join("") + "</div>" : '<p class="note">Nenhuma tarefa neste projeto.</p>') +
      '<div class="actions"><button class="primary" data-act="compose-open" data-id="proposta" data-project="' + p.id + '">Gerar proposta</button><button class="soft" data-act="compose-open" data-id="vsl" data-project="' + p.id + '">Gerar peça</button>' +
      (c ? '<button class="soft" data-act="open-client" data-id="' + c.id + '">Dossiê de ' + esc(c.name.split(" ")[0]) + "</button>" : "") +
      "</div></section>" +
      (c ? '<section class="glass panel"><div class="kicker">Próxima ação do cliente</div><p class="note" style="margin-top:8px">' + esc(c.nextAction) + '</p><p class="note">Último contato ' + esc(rel(c.contactAt)) + '.</p><button class="soft" style="margin-top:10px" data-act="schedule-client" data-id="' + c.id + '">Colocar na agenda</button></section>' : "") +
      "</div></div>";
  }

  function gateLines(id) {
    const g = VH.deliveryBlockers(id);
    return g.milestones.map((m) => "Marco aberto · " + m.title)
      .concat(g.tasks.map((t) => "Tarefa aberta · " + t.title))
      .concat(g.balance > 0 ? ["Saldo em aberto · " + money(g.balance)] : []);
  }
  function weekHTML() {
    const s = state();
    const today = VH.todayISO();
    const due = s.projects.filter((p) => p.status !== "entregue" && VH.daysUntil(p.deadline) <= 10).sort((a, b) => a.deadline.localeCompare(b.deadline));
    const late = s.tasks.filter((t) => !t.done && t.date < today);
    const locked = s.movements.filter((m) => {
      if (m.kind !== "entrada" || m.status !== "previsto") return false;
      const p = projectOf(m.projectId);
      return p && p.status !== "entregue";
    });
    const lockedSum = locked.reduce((n, m) => n + Number(m.amount || 0), 0);
    return '<section class="glass panel" style="margin-bottom:18px"><div class="row-between"><h2 style="font-family:var(--display);font-size:15px;margin:0">Próximas entregas</h2><span class="kicker">10 dias</span></div><div class="week">' +
      '<div class="risk"><span class="kicker">No prazo</span><b>' + due.length + '</b><span class="note">projeto' + (due.length === 1 ? "" : "s") + " com marco nesta janela</span></div>" +
      '<div class="risk"><span class="kicker">Agenda atrasada</span><b>' + late.length + '</b><span class="note">' + (late.length ? "puxar para hoje na agenda" : "nada escorregou do dia") + "</span></div>" +
      '<button class="risk" data-act="go" data-href="/sistema/financeiro"><span class="kicker">Caixa preso</span><b>' + money(lockedSum) + '</b><span class="note">previsto em projeto ainda aberto</span></button></div>' +
      (due.length ? '<div class="week-list">' + due.map((p) => {
        const left = VH.daysUntil(p.deadline);
        const when = left < 0 ? "atrasado" : left === 0 ? "hoje" : "em " + left + " dia" + (left === 1 ? "" : "s");
        const blocks = gateLines(p.id).length;
        return '<button class="week-item" data-act="open-project" data-id="' + p.id + '"><span><b>' + esc(p.name) + '</b><span class="note" style="display:block">' + esc(p.milestone) + (blocks ? " · " + blocks + " trava" + (blocks === 1 ? "" : "s") : "") + '</span></span><span class="time">' + esc(shortDate(p.deadline) + " · " + when) + "</span></button>";
      }).join("") + "</div>" : '<p class="note" style="margin-top:12px">Nenhuma entrega nesta janela.</p>') + "</section>";
  }

  function viewComando() {
    const s = state();
    const k = VH.kpis();
    const name = esc(s.profile.name || "Victor");
    const today = s.tasks.filter((t) => t.date === VH.todayISO());
    const rank = { "t-proposta": 1, "t-copy": 2, "t-stripe": 3, "t-hero": 4 };
    today.sort((a, b) => (rank[a.id] || 20) - (rank[b.id] || 20) || a.time.localeCompare(b.time));
    const sub = k.pending === 0 && k.tasks
      ? "O foco de hoje está limpo. O radar continua aberto no que ainda pede atenção."
      : "Bom trabalho, " + name + ". Seu sistema já organizou o que pede atenção agora.";
    const projects = s.projects.filter((p) => p.status !== "entregue");
    const f = s.funnel;
    const max = Math.max(f.qualificados, f.propostas, f.negociacoes, f.fechamentos, 1);
    const bar = (n) => Math.round((n / max) * 100);
    const funnel = [
      ["Leads qualificados", f.qualificados],
      ["Propostas enviadas", f.propostas],
      ["Negociações", f.negociacoes],
      ["Fechamentos", f.fechamentos],
    ].map(([label, n]) =>
      '<div class="funnel-row"><div class="row-between"><span>' + label + '</span><b>' + String(n).padStart(2, "0") + '</b></div><div class="bar"><i style="width:' + bar(n) + '%;background:linear-gradient(90deg,#7f1020,#ef233c)"></i></div></div>'
    ).join("");
    return head("COMMAND CENTER", "Central de Comando", sub) +
      '<div class="kpi-grid">' +
      kpi("Projetos ativos", icon("projects", 15), String(k.active), k.critical + " em fase crítica") +
      kpi("Tarefas de hoje", icon("tasks", 15), String(k.tasks), k.done + " concluídas") +
      kpi("Pipeline", icon("trend", 15), money(k.pipeline), "oportunidade total") +
      kpi("Recebido no mês", icon("finance", 15), money(k.received), "fluxo confirmado") +
      "</div>" +
      agoraHTML() +
      weekHTML() +
      '<section class="glass panel"><div class="row-between"><h2 class="font-display" style="font-family:var(--display);font-size:15px;margin:0">Foco de hoje</h2><button class="link-red" data-act="go" data-href="/sistema/tarefas">Abrir agenda →</button></div><div class="task-list">' +
      (today.length ? today.map(taskRow).join("") : '<div class="empty">Nada no bloco de hoje.</div>') +
      "</div></section>" +
      '<div class="grid-12" style="margin-top:18px"><div class="stack"><section class="glass panel"><div class="row-between"><h2 style="font-family:var(--display);font-size:15px;margin:0">Projetos em movimento</h2><button class="link-red" data-act="go" data-href="/sistema/projetos">Todos os projetos →</button></div><div class="mini-cards" style="margin-top:14px">' +
      projects.map((p) => {
        const c = clientOf(p.clientId);
        return '<button class="mini panel-hover" data-act="open-project" data-id="' + p.id + '"><div class="mini-top"><div class="letter">' + esc(p.letter) + "</div>" + statusPill(p.status) + '</div><h3>' + esc(p.name) + "</h3><p>" + esc(c ? c.company : "Sem cliente") + "</p>" + progress(p.progress) + '<div class="mini-foot"><span>' + esc(p.milestone) + "</span><span>" + shortDate(p.deadline) + "</span></div></button>";
      }).join("") +
      '</div></section></div><div class="stack"><section class="glass panel"><h2 style="font-family:var(--display);font-size:15px;margin:0 0 16px">Radar comercial</h2><div class="funnel">' + funnel + '</div><div class="potential"><div class="kicker red">Potencial imediato</div><strong>' + money(k.pipeline) + "</strong></div></section>" +
      '<section class="glass panel"><h2 style="font-family:var(--display);font-size:15px;margin:0 0 12px">Automações ao vivo</h2>' +
      s.automations.map((a) => '<button class="auto-mini" data-act="open-auto" data-id="' + a.id + '">' + statusPill(a.status, a.status === "atencao" ? "Atenção" : "Ativa") + '<div><div class="t">' + esc(a.name) + '</div><div class="s">' + esc(whenRun(a.lastRun)) + " · " + a.runs + " runs</div></div></button>").join("") +
      "</section></div></div>" +
      '<section class="glass panel" style="margin-top:18px"><div class="row-between"><h2 style="font-family:var(--display);font-size:15px;margin:0">Arsenal: acesso rápido</h2><button class="link-red" data-act="go" data-href="/sistema/arsenal">Abrir biblioteca →</button></div><div class="quick-grid" style="margin-top:14px">' +
      s.arsenal.slice(0, 4).map((a) => '<button class="quick panel-hover" data-act="open-asset" data-id="' + a.id + '"><div class="q-ico">' + icon("spark", 16) + '</div><div><b>' + esc(a.name) + "</b><span>" + typeLabel(a.type) + " · " + a.uses + " usos</span></div></button>").join("") +
      "</section>" + feedHTML();
  }
  function kpi(label, ico, val, hint) {
    return '<div class="glass kpi panel-hover"><div class="row-between"><span class="kicker">' + label + '</span><span style="color:#ef233c">' + ico + '</span></div><div class="val">' + val + '</div><div class="hint">' + hint + "</div></div>";
  }
  function typeLabel(t) {
    return { prompt: "Prompt", agente: "Agente", template: "Template", componente: "Componente" }[t] || t;
  }

  function viewProjetos() {
    if (ui.room) return roomView(ui.room);
    const s = state();
    const k = VH.kpis();
    const tabs = [["todos", "Todos"], ["descoberta", "Descoberta"], ["producao", "Produção"], ["revisao", "Revisão"], ["entregue", "Entregue"]];
    const rows = s.projects.filter((p) => ui.filter === "todos" || p.status === ui.filter);
    const table = '<div class="glass table-wrap"><table><thead><tr><th>Projeto & cliente</th><th>Status</th><th>Progresso</th><th>Valor</th><th>Próximo marco</th></tr></thead><tbody>' +
      (rows.length ? rows.map((p) => {
        const c = clientOf(p.clientId);
        const late = VH.daysUntil(p.deadline) < 0 && p.status !== "entregue";
        return '<tr class="click" data-act="open-project" data-id="' + p.id + '"><td><div class="who"><div class="letter">' + esc(p.letter) + '</div><div><div class="name">' + esc(p.name) + (p.critical ? ' <span class="flag">CRÍTICO</span>' : "") + '</div><div class="sub">' + esc(c ? c.company : "Sem cliente") + '</div></div></div></td><td>' + statusPill(p.status) + "</td><td>" + progress(p.progress) + '</td><td class="money">' + money(p.value) + '</td><td class="milestone"><div>' + esc(p.milestone) + "</div><small>" + (late ? "Atrasado · " + shortDate(p.deadline) : "Próxima entrega") + "</small></td></tr>";
      }).join("") : '<tr><td colspan="5"><div class="empty">Nenhum projeto neste estágio.</div></td></tr>') +
      "</tbody></table></div>";
    return head("OPERAÇÕES", "Operações de Projetos", s.projects.filter((p) => p.status !== "entregue").length + " projetos · " + money(k.pipeline) + " em pipeline") +
      '<div class="row-between" style="margin-bottom:14px">' + switcher("project-view", ui.projectView, [["tabela", "Tabela"], ["quadro", "Quadro"]]) +
      (ui.projectView === "tabela" ? '<div class="tabs" style="margin:0">' + tabs.map(([id, label]) => '<button class="tab' + (ui.filter === id ? " is-on" : "") + '" data-act="filter" data-id="' + id + '">' + label + "</button>").join("") + "</div>" : '<span class="kicker">O clique abre a sala</span>') +
      "</div>" + (ui.projectView === "quadro" ? boardHTML() : table);
  }

  function viewClientes() {
    const s = state();
    const selected = s.clients.find((c) => c.id === ui.clientId) || s.clients[0];
    if (selected) ui.clientId = selected.id;
    const cards = '<div class="client-grid">' + s.clients.map((c) =>
      '<button class="client-card' + (selected && c.id === selected.id ? " is-selected" : "") + '" data-act="select-client" data-id="' + c.id + '"><div class="row-between"><div class="avatar">' + esc(c.initials) + "</div>" + statusPill(c.stage, VH.labelStage(c.stage)) + "</div><h3>" + esc(c.name) + '</h3><div class="co">' + esc(c.company) + '</div><div class="foot"><div><div class="kicker">Oportunidade</div><b>' + money(c.value) + '</b></div><div style="text-align:right"><div class="kicker">Contato</div><b style="font-size:14px;font-weight:500">' + esc(rel(c.contactAt)) + "</b></div></div></button>"
    ).join("") + "</div>";
    return head("CRM PESSOAL", "Radar de Clientes", "Relacionamentos, propostas e próxima ação em um único lugar.") +
      '<div class="row-between" style="margin-bottom:14px">' + switcher("client-view", ui.clientView, [["radar", "Radar"], ["pipeline", "Pipeline"]]) + '<span class="kicker">' + s.clients.length + " relações</span></div>" +
      (ui.clientView === "pipeline" ? pipelineHTML() : cards) + (selected ? dossier(selected) : "");
  }
  function dossier(c) {
    const p = projectOf(c.projectId);
    return '<section class="glass dossier" id="dossier"><div class="kicker">Dossiê do cliente</div><h2>' + esc(c.name) + '</h2><div class="mail">' + esc(c.company) + (c.email ? " · " + esc(c.email) : "") + (c.phone ? " · " + esc(c.phone) : "") + "</div>" +
      '<div class="dossier-grid"><div class="stat"><div class="kicker">Potencial</div><b>' + money(c.value) + '</b></div><div class="stat"><div class="kicker">Etapa</div><b>' + esc(VH.labelStage(c.stage)) + "</b></div></div>" +
      '<div class="stat" style="margin-top:12px"><div class="kicker">Próxima ação</div><p class="note" style="margin:8px 0 0">' + esc(c.nextAction) + "</p></div>" +
      '<div class="actions"><button class="soft" data-act="schedule-client" data-id="' + c.id + '">Colocar na agenda</button>' + (p ? '<button class="soft" data-act="open-project" data-id="' + p.id + '">Projeto · ' + esc(p.name) + "</button>" : "") + "</div>" +
      '<div class="timeline">' + c.timeline.map((ev) => '<div class="tl"><time>' + esc(stamp(ev.at)) + '</time><i class="rail"></i><div>' + esc(ev.text) + "</div></div>").join("") + "</div>" +
      '<div class="field" style="margin-top:8px"><span>Registrar contato</span><input id="contact-field" placeholder="O que foi dito, e o que ficou combinado"></div>' +
      '<div class="actions"><button class="primary" data-act="log-contact" data-id="' + c.id + '">Registrar contato</button><button class="soft" data-act="cycle-stage" data-id="' + c.id + '">Avançar etapa</button><button class="soft" data-act="lose-client" data-id="' + c.id + '">Marcar perdido</button></div>' +
      '<div class="field" style="margin-top:16px"><span>Notas de relação</span><textarea id="client-note">' + esc(c.notes) + '</textarea></div><button class="soft" data-act="save-client-note" data-id="' + c.id + '">Salvar notas</button></section>';
  }

  function viewTarefas() {
    const s = state();
    const today = VH.todayISO();
    const todays = s.tasks.filter((t) => t.date === today);
    const done = todays.filter((t) => t.done).length;
    const pct = todays.length ? Math.round((done / todays.length) * 100) : 0;
    const blocks = [
      ["manha", "Bloco da Manhã · Foco profundo"],
      ["tarde", "Bloco da Tarde · Execução e reuniões"],
      ["noite", "Bloco da Noite · Fechamento"],
    ];
    const later = s.tasks.filter((t) => t.date > today && !t.done).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    const groups = {};
    later.forEach((t) => { (groups[t.date] = groups[t.date] || []).push(t); });
    return head("EXECUÇÃO", "Agenda de Produção", (todays.length - done) + " pendentes · " + done + " concluídas · foco por bloco de energia",
      '<div class="energy" style="margin-top:16px"><i style="width:' + pct + '%"></i></div>') +
      (function () {
        const late = s.tasks.filter((t) => !t.done && t.date < today).sort((a, b) => a.date.localeCompare(b.date));
        if (!late.length) return "";
        return '<section class="glass panel" style="margin-bottom:14px"><div class="row-between"><h2 style="font-family:var(--display);font-size:16px;margin:0">Escorregou do dia</h2><span class="kicker">' + late.length + "</span></div>" +
          late.map((t) => '<div class="late-row"><button class="task-main" data-act="open-task" data-id="' + t.id + '"><div class="task-title">' + esc(t.title) + '</div><div class="meta"><span>' + esc(shortDate(t.date)) + "</span></div></button><button class=\"link-red\" data-act=\"pull-today\" data-id=\"" + t.id + "\">Puxar para hoje</button></div>").join("") +
          "</section>";
      })() +
      blocks.map(([id, title]) => {
        const list = todays.filter((t) => t.block === id).sort((a, b) => a.order - b.order);
        if (id === "noite" && !list.length) return "";
        return '<section class="glass block-card"><h2>' + title + '</h2><div class="task-list">' +
          (list.length ? list.map(taskRow).join("") : '<div class="empty">Bloco livre.</div>') +
          '</div><button class="link-red" data-act="create" data-type="task" data-block="' + id + '" style="margin:8px 0 12px">+ Tarefa neste bloco</button></section>';
      }).join("") +
      (Object.keys(groups).length ? '<section class="glass panel"><h2 style="font-family:var(--display);font-size:16px;margin:0 0 8px">Próximos dias</h2>' +
        Object.keys(groups).map((d) => '<div class="kicker" style="margin-top:12px">' + weekday(d) + " · " + shortDate(d) + "</div>" + groups[d].map(taskRow).join("")).join("") +
        "</section>" : "");
  }

  function viewAutomacoes() {
    const s = state();
    const a = s.automations.find((x) => x.id === ui.autoId) || s.automations[0];
    if (a) ui.autoId = a.id;
    const operating = s.automations.filter((x) => x.status === "ativa").length;
    return head("AUTOMATION GRID", "Workspace de Automação", operating + " workflows operando · monitoramento em tempo real") +
      '<section class="glass panel"><h2 style="font-family:var(--display);font-size:15px;margin:0 0 12px">Lista de workflows</h2><div class="flow-list">' +
      s.automations.map((item) => '<button class="flow-item' + (a && item.id === a.id ? " is-selected" : "") + '" data-act="select-auto" data-id="' + item.id + '"><div class="flow-ico">' + icon("autos", 16) + '</div><div style="flex:1"><b>' + esc(item.name) + '</b><span class="sub">' + esc(item.platform) + " · " + item.runs + " execuções · " + esc(whenRun(item.lastRun)) + "</span></div>" + statusPill(item.status, item.status === "atencao" ? "Atenção" : "Ativa") + "</button>").join("") +
      "</div></section>" + (a ? autoDetail(a) : "");
  }
  function autoDetail(a) {
    const nodes = a.nodes.map((n, i) =>
      '<div class="node' + (n.warn ? " warn" : "") + '">' + icon(n.icon || "bolt", 18) + "<span>" + esc(n.label) + "</span></div>" + (i < a.nodes.length - 1 ? '<div class="wire"></div>' : "")
    ).join("");
    const fixes = a.fixes ? '<div style="margin-top:18px"><div class="kicker">Runbook da falha</div><p class="note">' + esc(a.error || "") + '</p><div class="runbook">' +
      [["secret", "Conferir o segredo do webhook no n8n — o mesmo do endpoint no Stripe."],
        ["tolerance", "Tolerância de timestamp em 300s. O drift atual passa disso."],
        ["channel", "Canal #pagamentos existe e o bot tem permissão de escrever."]].map(([key, text]) =>
        '<label><input type="checkbox" data-act="fix" data-id="' + a.id + '" data-key="' + key + '"' + (a.fixes[key] ? " checked" : "") + "> <span>" + text + "</span></label>"
      ).join("") + '</div><button class="primary" style="margin-top:12px" data-act="resolve-auto" data-id="' + a.id + '">Registrar correção</button></div>' : "";
    return '<section class="glass panel"><h2 style="font-family:var(--display);font-size:15px;margin:0 0 12px">Detalhes do workflow</h2><div class="canvas">' + nodes + '</div><h2 style="font-family:var(--display);font-size:28px;letter-spacing:-.03em;margin:18px 0 6px">' + esc(a.name) + '</h2><p class="note">' + esc(a.summary) + "</p>" +
      '<div class="stat-row"><div class="stat"><div class="kicker">Execuções</div><b>' + a.runs + '</b></div><div class="stat"><div class="kicker">Última run</div><b style="font-size:14px">' + esc(whenRun(a.lastRun)) + '</b></div><div class="stat"><div class="kicker">Sucesso</div><b>' + a.successRate + '%</b></div><div class="stat"><div class="kicker">Duração média</div><b>' + esc(a.avg) + "</b></div></div>" +
      '<div class="actions"><button class="primary" data-act="run-auto" data-id="' + a.id + '">' + icon("play", 14) + " Executar agora</button></div>" + fixes +
      '<div class="kicker" style="margin-top:22px">Histórico recente</div><table class="log">' + a.logs.map((l) => '<tr><td class="time">' + esc(stamp(l.at)) + '</td><td>' + (l.ok ? '<span class="dot green" style="display:inline-block"></span>' : '<span class="dot yellow" style="display:inline-block"></span>') + "</td><td>" + esc(l.msg) + "</td></tr>").join("") + "</table></section>";
  }

  function viewArsenal() {
    const s = state();
    const tabs = [["todos", "Todos"], ["prompt", "Prompt"], ["agente", "Agente"], ["template", "Template"], ["componente", "Componente"]];
    const items = s.arsenal.filter((a) => ui.assetFilter === "todos" || a.type === ui.assetFilter);
    return head("KNOWLEDGE VAULT", "Biblioteca de Produção", "Prompts, agentes, templates, componentes e snippets prontos para executar.", '<div class="actions"><button class="primary" data-act="compose-open" data-id="proposta">Executar no projeto</button></div>') +
      '<div class="tabs">' + tabs.map(([id, label]) => '<button class="tab' + (ui.assetFilter === id ? " is-on" : "") + '" data-act="asset-filter" data-id="' + id + '">' + label + "</button>").join("") + "</div>" +
      '<div class="arsenal-grid">' + (items.length ? items.map((a) =>
        '<button class="asset' + (ui.drawer && ui.drawer.type === "asset" && ui.drawer.id === a.id ? " is-selected" : "") + '" data-act="open-asset" data-id="' + a.id + '"><div class="q-ico">' + icon("spark", 16) + '</div><div class="ver">' + (a.star ? "★ " : "") + esc(a.version) + "</div><h3>" + esc(a.name) + "</h3><p>" + esc(a.summary) + '</p><div class="foot"><div class="meta">' + a.tags.map((t) => '<span class="chip">' + esc(t) + "</span>").join("") + '</div><span class="time">' + a.uses + " usos</span></div></button>"
      ).join("") : '<div class="empty">Nada neste tipo.</div>') + "</div>";
  }

  function pulseSVG(values) {
    const w = 640, h = 150, pad = 16;
    const max = Math.max.apply(null, values) * 1.2 || 1;
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - 28 - (v / max) * (h - 48);
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const last = pts[pts.length - 1];
    const area = line + " L" + last[0].toFixed(1) + "," + (h - 12) + " L" + pts[0][0].toFixed(1) + "," + (h - 12) + " Z";
    return '<svg class="pulse" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef233c" stop-opacity="0.38"/><stop offset="100%" stop-color="#ef233c" stop-opacity="0"/></linearGradient></defs><path d="' + area + '" fill="url(#pulseFill)"/><path d="' + line + '" fill="none" stroke="#ef233c" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="8" fill="#ef233c" opacity="0.25"/><circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="3.5" fill="#fff"/></svg>';
  }
  function viewFinanceiro() {
    const s = state();
    const k = VH.kpis();
    const upcoming = s.movements.filter((m) => m.kind === "entrada" && m.status === "previsto").sort((a, b) => a.date.localeCompare(b.date));
    return head("FINANCE CORE", "Controle Financeiro", "Receitas, custos, previsões e rentabilidade do seu estúdio.") +
      '<div class="kpi-grid">' +
      kpi("Receita prevista", icon("trend", 15), money(k.predicted), "pipeline financeiro") +
      kpi("Recebido", icon("finance", 15), money(k.received), "confirmado no mês") +
      kpi("Custos", icon("card", 15), money(k.costs), "fixos e variáveis") +
      kpi("Resultado", icon("spark", 15), money(k.result), "margem projetada") +
      "</div>" +
      '<div class="grid-12"><section class="glass panel"><div class="row-between"><h2 style="font-family:var(--display);font-size:15px;margin:0">Movimentações</h2><button class="link-red" data-act="create" data-type="movement">Lançar</button></div>' +
      s.movements.map((m) => '<div class="mov"><div><b>' + esc(m.title) + '</b><div class="meta"><span>' + (m.cadence === "mensal" ? "mensal · " + m.status : shortDate(m.date) + " · " + m.status) + "</span></div></div><div class=\"" + (m.kind === "entrada" ? "in" : "out") + "\">" + (m.kind === "entrada" ? "+" : "−") + money(m.amount) + (m.status === "previsto" ? ' <button class="link-red" data-act="receive" data-id="' + m.id + '">confirmar</button>' : "") + "</div></div>").join("") +
      '<p class="note" style="margin-top:12px">Caixa realizado no mês: ' + money(k.realized) + ". A margem projetada não soma o que já entrou — ela olha o que ainda vem, menos o custo.</p></section>" +
      '<div class="stack"><section class="glass panel"><div class="row-between"><h2 style="font-family:var(--display);font-size:15px;margin:0">Pulso do caixa</h2></div><div class="row-between" style="margin-top:8px"><span class="kicker">8 semanas atrás</span><span class="kicker">Agora</span></div><div class="pulse-box">' + pulseSVG(s.pulse || [0, 0, 0, 0, 0, 0, 0, 0]) + "</div></section>" +
      '<section class="glass panel"><h2 style="font-family:var(--display);font-size:15px;margin:0 0 8px">Próximos recebimentos</h2>' +
      (upcoming.length ? upcoming.map((m) => '<div class="upcoming"><div><b>' + esc(m.title) + '</b><div class="meta"><span>' + shortDate(m.date) + "</span></div></div><b>" + money(m.amount) + "</b></div>").join("") : '<div class="empty">Nada previsto.</div>') +
      "</section></div></div>";
  }

  function ownershipHTML(p) {
    const cfg = window.VHConfig || {};
    const domain = p.domain || cfg.publicOrigin || "";
    const phone = p.whatsapp || cfg.whatsapp || "";
    return '<section class="glass panel"><h2 style="font-family:var(--display);font-size:16px;margin:0 0 8px">Domínio e banco</h2><p class="note">O sistema é seu. O banco de hoje é este navegador. O domínio de produção você aponta quando quiser — este preview não é o domínio.</p>' +
      '<div class="field"><span>Domínio de produção</span><input id="ws-domain" placeholder="https://seudominio.com" value="' + esc(domain) + '"></div>' +
      '<div class="field"><span>WhatsApp</span><input id="ws-whatsapp" inputmode="numeric" value="' + esc(phone) + '"></div>' +
      statLine("Banco", cfg.dataMode === "api" ? "API" : "localStorage") +
      statLine("Chave", esc(cfg.storageKey || "victor-hub-os-v1")) +
      statLine("API", esc(cfg.apiBase || "não ligada")) +
      statLine("Este preview", esc(location.origin)) +
      '<p class="note" style="margin-top:10px">Salvar registra o domínio no backup. O site público só anuncia outro número ou outro domínio quando js/config.js muda — é esse arquivo que o agente do VS Code deve editar.</p>' +
      '<div class="actions"><button class="primary" data-act="save-ownership">Salvar propriedade</button><button class="soft" data-act="copy-brief">Copiar briefing do VS Code</button></div></section>';
  }
  function viewConfig() {
    const s = state();
    const p = s.profile;
    const prefs = s.prefs;
    const routes = NAV.length;
    return head("SYSTEM", "Configurações do Workspace", "Identidade, comportamento do painel e integrações do seu ambiente.") +
      '<div class="settings-grid"><div class="stack"><section class="glass panel"><h2 style="font-family:var(--display);font-size:16px;margin:0 0 14px">Identidade</h2><div class="who" style="margin-bottom:16px"><div class="avatar">V</div><div><div class="name">' + esc(p.workspace) + '</div><div class="sub">' + (prefs.mode === "publico" ? "Ambiente público · edição protegida" : "Ambiente operacional · edição liberada") + "</div></div></div>" +
      '<div class="field"><span>Nome do workspace</span><input id="ws-name" value="' + esc(p.workspace) + '"></div><div class="field"><span>Objetivo operacional</span><textarea id="ws-obj">' + esc(p.objective) + '</textarea></div><div class="two"><div class="field"><span>Seu nome</span><input id="ws-you" value="' + esc(p.name) + '"></div><div class="field"><span>Cidade</span><input id="ws-city" value="' + esc(p.city || "") + '"></div></div><button class="primary" data-act="save-profile">Salvar identidade</button></section>' +
      '<section class="glass panel"><h2 style="font-family:var(--display);font-size:16px;margin:0 0 6px">Preferências</h2>' +
      toggle("Densidade operacional", "Mantém mais informações visíveis no cockpit.", prefs.density !== "compact", "density") +
      toggle("Alertas críticos", "Destaca prazos, falhas e negociações paradas.", prefs.alerts, "alerts") +
      toggle("Reduzir movimento", "Corta animações. O sistema também respeita a preferência do aparelho.", prefs.reduceMotion, "motion") +
      '<button class="soft" style="margin-top:8px" data-act="save-prefs">Salvar preferências</button></section></div>' +
      '<div class="stack">' + ownershipHTML(p) + '<section class="glass panel"><h2 style="font-family:var(--display);font-size:16px;margin:0 0 6px">Integrações</h2>' +
      integ("openai", "OpenAI") + integ("github", "GitHub") + integ("n8n", "n8n") + integ("stripe", "Stripe") +
      '<p class="note" style="margin-top:10px">Nenhuma chave sai deste navegador. O campo só marca a conexão — o segredo não é armazenado.</p></section>' +
      '<section class="glass panel"><h2 style="font-family:var(--display);font-size:16px;margin:0 0 8px">Estado do sistema</h2>' +
      statLine("Interface e navegação", "100%") + statLine("Armazenamento persistente", "Ativo") + statLine("Rotas operacionais", routes + "/" + routes) + statLine("Proteção de escrita", prefs.mode === "publico" ? "Ativa" : "Liberada") +
      '<p class="note" style="margin-top:12px">Os dados vivem neste navegador. Exporte um backup sempre que o sistema passar a importar — a pasta não se perde duas vezes.</p><div class="actions"><button class="primary" data-act="export">Exportar backup</button><button class="soft" data-act="import-pick">Importar</button><button class="soft danger" data-act="ask-reset">Restaurar semente</button></div><input id="import-file" type="file" accept="application/json" class="hidden"></section></div></div>';
  }
  function toggle(title, text, on, key) {
    return '<button class="toggle" data-act="pref" data-key="' + key + '"><span><b>' + title + '</b><span class="note" style="display:block">' + text + '</span></span><span class="switch' + (on ? " on" : "") + '"><i></i></span></button>';
  }
  function integ(key, label) {
    const item = state().integrations[key] || { status: "pronta", hint: "" };
    const labelStatus = item.status === "operacional" ? "Operacional" : item.status === "requer" ? "Requer chave" : "Pronta para conectar";
    const note = item.hint && item.hint !== labelStatus ? item.hint : "Conexão do estúdio";
    return '<div class="integ"><div><b>' + label + '</b><div class="note">' + esc(note) + '</div></div><div style="display:flex;align-items:center;gap:8px">' + statusPill(item.status === "operacional" ? "ativa" : item.status === "requer" ? "atencao" : "descoberta", labelStatus) +
      (key === "openai" || key === "stripe" ? '<button class="soft" style="height:32px" data-act="connect" data-id="' + key + '">Conectar</button>' : "") + "</div></div>";
  }
  function statLine(k, v) {
    return '<div class="row-between" style="padding:8px 0;border-top:1px solid rgba(255,255,255,.06)"><span class="note">' + k + '</span><b>' + v + "</b></div>";
  }

  const VIEWS = { comando: viewComando, projetos: viewProjetos, clientes: viewClientes, tarefas: viewTarefas, automacoes: viewAutomacoes, arsenal: viewArsenal, financeiro: viewFinanceiro, configuracoes: viewConfig };

  function renderView() {
    const main = document.getElementById("main");
    if (!main) return;
    const top = main.scrollTop;
    let html = "";
    try { html = VIEWS[current()](); }
    catch (err) {
      console.error(err);
      html = '<div class="glass panel"><h1 class="page-title">O cockpit tropeçou</h1><p class="page-sub">' + esc(err.message) + '</p><button class="primary" data-act="reload">Recarregar</button></div>';
    }
    main.innerHTML = '<div class="wrap entrance">' + html + "</div>";
    main.scrollTop = resetScroll ? 0 : top;
  }

  function go(href) {
    ui.palette = false;
    ui.novo = false;
    ui.notify = false;
    ui.more = false;
    ui.modal = null;
    ui.drawer = null;
    ui.room = null;
    resetScroll = true;
    if (location.pathname !== href) history.pushState({}, "", href);
    paint();
    resetScroll = false;
  }

  function paint() {
    renderView();
    updateChrome();
    renderOverlays();
  }

  function paletteEntries() {
    const q = ui.q.trim().toLowerCase();
    const s = state();
    const entries = [];
    const group = (label) => entries.push({ group: label });
    const nav = NAV.map((n) => ({ kind: "nav", label: n.label, hint: "Ir para", href: n.href, icon: n.icon }));
    const creates = [
      ["Novo projeto", "project", "Abrir uma operação"],
      ["Novo cliente", "client", "Entrar no radar"],
      ["Nova tarefa", "task", "Colocar no bloco"],
      ["Nova automação", "automation", "Registrar fluxo"],
      ["Novo item do arsenal", "asset", "Guardar conhecimento"],
      ["Novo lançamento", "movement", "Mexer no caixa"],
    ].map(([label, type, hint]) => ({ kind: "create", label, type, hint, icon: "plus" }));
    const hit = (t) => String(t || "").toLowerCase().includes(q);
    if (!q) {
      group("Ir para"); entries.push.apply(entries, nav);
      group("Criar"); entries.push.apply(entries, creates);
      group("Foco de hoje");
      s.tasks.filter((t) => t.date === VH.todayISO() && !t.done).forEach((t) => entries.push({ kind: "task", id: t.id, label: t.title, hint: t.time + " · " + t.tag, icon: "tasks" }));
      return entries;
    }
    const navHits = nav.filter((n) => hit(n.label));
    const createHits = creates.filter((n) => hit(n.label));
    const projects = s.projects.filter((p) => hit(p.name) || hit(clientOf(p.clientId) && clientOf(p.clientId).company));
    const clients = s.clients.filter((c) => hit(c.name) || hit(c.company));
    const tasks = s.tasks.filter((t) => hit(t.title) || hit(t.tag));
    const assets = s.arsenal.filter((a) => hit(a.name) || hit(a.summary) || a.tags.some(hit));
    const autos = s.automations.filter((a) => hit(a.name) || hit(a.platform));
    if (navHits.length) { group("Ir para"); entries.push.apply(entries, navHits); }
    if (createHits.length) { group("Criar"); entries.push.apply(entries, createHits); }
    if (projects.length) { group("Projetos"); projects.forEach((p) => entries.push({ kind: "project", id: p.id, label: p.name, hint: VH.labelStatus(p.status), icon: "projects" })); }
    if (clients.length) { group("Clientes"); clients.forEach((c) => entries.push({ kind: "client", id: c.id, label: c.name, hint: c.company, icon: "clients" })); }
    if (tasks.length) { group("Tarefas"); tasks.forEach((t) => entries.push({ kind: "task", id: t.id, label: t.title, hint: t.time, icon: "tasks" })); }
    if (autos.length) { group("Automações"); autos.forEach((a) => entries.push({ kind: "auto", id: a.id, label: a.name, hint: a.platform, icon: "autos" })); }
    if (assets.length) { group("Arsenal"); assets.forEach((a) => entries.push({ kind: "asset", id: a.id, label: a.name, hint: typeLabel(a.type), icon: "arsenal" })); }
    if (!entries.length) entries.push({ empty: true });
    return entries;
  }
  function selectable() { return paletteEntries().filter((e) => !e.group && !e.empty); }
  function paletteListHTML() {
    const entries = paletteEntries();
    let i = 0;
    if (entries.length === 1 && entries[0].empty) return '<div class="empty">Nada com esse nome. Crie pelo menu Novo.</div>';
    return entries.map((e) => {
      if (e.group) return '<div class="p-group">' + e.group + "</div>";
      const idx = i++;
      return '<button class="p-item' + (idx === ui.pi ? " is-on" : "") + '" data-act="palette-go" data-i="' + idx + '">' + icon(e.icon, 15) + "<span><b>" + esc(e.label) + "</b><small>" + esc(e.hint || "") + "</small></span></button>";
    }).join("");
  }
  function activatePalette(i) {
    const item = selectable()[i];
    if (!item) return;
    if (item.kind === "nav") go(item.href);
    else if (item.kind === "create") openCreate(item.type);
    else if (item.kind === "project") openProject(item.id);
    else if (item.kind === "client") openClient(item.id);
    else if (item.kind === "task") openTask(item.id);
    else if (item.kind === "auto") openAuto(item.id);
    else if (item.kind === "asset") openAsset(item.id);
  }

  function renderOverlays() {
    const root = document.getElementById("overlays");
    if (!root) return;
    const was = document.activeElement && document.activeElement.id === "palette-q";
    let html = "";
    if (ui.palette) {
      html += '<div class="overlay-back" data-act="dismiss"></div><div class="palette" role="dialog" aria-label="Busca"><input id="palette-q" placeholder="Buscar, criar ou executar..." autocomplete="off"><div class="palette-list" id="palette-list">' + paletteListHTML() + '</div><div class="palette-foot"><span>↑↓ navegar</span><span>enter abrir · esc fechar</span></div></div>';
    }
    if (ui.notify) html += notifyHTML();
    if (ui.novo) html += menuHTML();
    if (ui.more) html += moreHTML();
    if (ui.modal) html += modalHTML(ui.modal);
    if (ui.drawer) html += drawerHTML(ui.drawer);
    root.innerHTML = html;
    if (ui.palette) {
      const input = document.getElementById("palette-q");
      if (input) {
        input.value = ui.q;
        if (was || focusPalette) {
          input.focus();
          focusPalette = false;
          const n = input.value.length;
          input.setSelectionRange(n, n);
        }
      }
    }
  }
  function notifyHTML() {
    const items = VH.notifications();
    const body = items.length ? items.map((n) =>
      '<button class="n-item" data-act="open-note" data-href="' + n.href + '" data-focus="' + esc(n.focus || "") + '" data-kind="' + (n.href.includes("projetos") ? "project" : n.href.includes("clientes") ? "client" : n.href.includes("automacoes") ? "auto" : "") + '"><span class="dot ' + n.tone + '"></span><span><b>' + esc(n.title) + "</b><small>" + esc(n.text) + "</small></span></button>"
    ).join("") : '<div class="empty">Nada pedindo atenção agora.</div>';
    return '<div class="pop-back" data-act="dismiss"></div><div class="popover"><div class="kicker" style="padding:8px 12px">Sinais</div>' + body + "</div>";
  }
  function menuHTML() {
    const items = [["project", "Projeto"], ["client", "Cliente"], ["task", "Tarefa"], ["automation", "Automação"], ["asset", "Arsenal"], ["movement", "Lançamento"]];
    return '<div class="pop-back" data-act="dismiss"></div><div class="menu">' + items.map(([type, label]) => '<button data-act="create" data-type="' + type + '">' + icon("plus", 14) + " " + label + "</button>").join("") + "</div>";
  }
  function moreHTML() {
    return '<div class="pop-back" data-act="dismiss"></div><div class="menu" style="top:auto;bottom:84px;right:12px">' +
      NAV.slice(4).map((n) => '<button data-act="go" data-href="' + n.href + '">' + icon(n.icon, 15) + " " + n.label + "</button>").join("") + "</div>";
  }

  function options(list, value) {
    return list.map(([id, label]) => '<option value="' + id + '"' + (id === value ? " selected" : "") + ">" + label + "</option>").join("");
  }
  function modalHTML(modal) {
    if (modal.type === "compose") {
      const s = state();
      const assetId = modal.id || "proposta";
      const asset = s.arsenal.find((a) => a.id === assetId) || s.arsenal[0];
      const projectId = modal.project || (s.projects[0] && s.projects[0].id) || "";
      const projects = s.projects.map((p) => [p.id, p.name]);
      const assets = s.arsenal.map((a) => [a.id, a.name]);
      const text = composeText(asset ? asset.id : assetId, projectId);
      return '<div class="overlay-back" data-act="dismiss"></div><div class="modal"><div class="kicker red">Executar no projeto</div><h2 style="font-family:var(--display);letter-spacing:-.03em;margin-top:6px">' + esc(asset ? asset.name : "Arsenal") + '</h2><p class="note">O texto sai do item e entra no brief, no marco e no valor reais. Edite antes de copiar.</p><div class="two"><div class="field"><span>Peça</span><select data-act="compose-asset">' + options(assets, asset ? asset.id : "") + '</select></div><div class="field"><span>Projeto</span><select data-act="compose-project">' + options(projects, projectId) + '</select></div></div><div class="field"><span>Saída</span><textarea id="compose-out" style="min-height:280px;font-family:var(--mono);font-size:12px;line-height:1.55">' + esc(text) + '</textarea></div><div class="actions"><button class="primary" data-act="compose-copy" data-id="' + esc(asset ? asset.id : "") + '">Copiar e contar uso</button><button class="soft" data-act="dismiss">Fechar</button></div></div>';
    }
    if (modal.type === "gate") {
      const p = projectOf(modal.id);
      const lines = gateLines(modal.id);
      return '<div class="overlay-back" data-act="dismiss"></div><div class="modal"><div class="kicker red">Trava de entrega</div><h2 style="font-family:var(--display);letter-spacing:-.03em;margin-top:6px">' + esc(p ? p.name : "Projeto") + '</h2><p class="note">Entregar agora deixa marco, tarefa ou saldo para trás. O sistema não esconde isso.</p><div class="task-list">' +
        (lines.length ? lines.slice(0, 6).map((line) => '<div class="task-row"><div class="task-title">' + esc(line) + "</div></div>").join("") : '<p class="note">Nada impede.</p>') +
        (lines.length > 6 ? '<p class="note">E mais ' + (lines.length - 6) + ".</p>" : "") +
        '</div><div class="actions"><button class="primary" data-act="open-project" data-id="' + esc(modal.id) + '">Abrir a sala</button><button class="soft" data-act="force-deliver" data-id="' + esc(modal.id) + '">Entregar mesmo assim</button></div></div>';
    }
    if (modal.type === "reset") {
      return '<div class="overlay-back" data-act="dismiss"></div><div class="modal"><div class="kicker red">Restaurar</div><h2 style="font-family:var(--display);letter-spacing:-.03em">Voltar para a semente recuperada?</h2><p class="note">Projetos, clientes e lançamentos criados neste navegador saem. Exporte um backup antes se isso ainda importa.</p><div class="actions"><button class="primary" data-act="do-reset">Restaurar</button><button class="soft" data-act="dismiss">Cancelar</button></div></div>';
    }
    if (modal.type === "connect") {
      const name = modal.id === "stripe" ? "Stripe" : "OpenAI";
      return '<div class="overlay-back" data-act="dismiss"></div><div class="modal"><div class="kicker red">Integração</div><h2 style="font-family:var(--display)">' + name + '</h2><p class="note">Cole a chave só para confirmar que você tem. Ela não é salva e não é enviada. O Hub marca a conexão como pronta neste navegador.</p><form data-form="connect"><input class="hidden" name="id" value="' + esc(modal.id) + '"><div class="field"><span>Chave</span><input name="key" type="password" placeholder="sk_... ou whsec_..."></div><div class="actions"><button class="primary" type="submit">Marcar conectada</button><button class="soft" type="button" data-act="dismiss">Cancelar</button></div></form></div>';
    }
    const titles = { project: "Novo projeto", client: "Novo cliente", task: "Nova tarefa", automation: "Nova automação", asset: "Novo item do arsenal", movement: "Novo lançamento" };
    return '<div class="overlay-back" data-act="dismiss"></div><div class="modal"><div class="kicker red">Criar</div><h2 style="font-family:var(--display);letter-spacing:-.03em;margin-top:6px">' + (titles[modal.type] || "Novo") + "</h2><form data-form=\"" + modal.type + "\">" + formFields(modal) + '<div class="actions"><button class="primary" type="submit">Criar</button><button class="soft" type="button" data-act="dismiss">Cancelar</button></div></form></div>';
  }
  function formFields(modal) {
    const s = state();
    const clients = s.clients.map((c) => [c.id, c.name + " · " + c.company]);
    const projects = s.projects.map((p) => [p.id, p.name]);
    if (modal.type === "project") {
      return '<div class="field"><span>Nome</span><input name="name" required placeholder="Portal, landing, sistema"></div><div class="two"><div class="field"><span>Cliente</span><select name="clientId"><option value="">Sem cliente</option>' + options(clients, "") + '</select></div><div class="field"><span>Valor</span><input name="value" type="number" min="0" step="100" value="0"></div></div><div class="two"><div class="field"><span>Status</span><select name="status">' + options([["descoberta", "Descoberta"], ["producao", "Produção"], ["revisao", "Revisão"]], "descoberta") + '</select></div><div class="field"><span>Prazo</span><input name="deadline" type="date" value="' + VH.todayISO() + '"></div></div><div class="field"><span>Próximo marco</span><input name="milestone" placeholder="Kickoff"></div><div class="field"><span>Brief</span><textarea name="brief" placeholder="O que precisa existir, e o que não vender agora"></textarea></div>';
    }
    if (modal.type === "client") {
      return '<div class="two"><div class="field"><span>Nome</span><input name="name" required></div><div class="field"><span>Empresa</span><input name="company" required></div></div><div class="two"><div class="field"><span>E-mail</span><input name="email" type="email"></div><div class="field"><span>Telefone</span><input name="phone"></div></div><div class="two"><div class="field"><span>Etapa</span><select name="stage">' + options([["qualificado", "Qualificado"], ["proposta", "Proposta"], ["negociacao", "Negociação"], ["ativo", "Cliente ativo"], ["lead", "Lead"]], "qualificado") + '</select></div><div class="field"><span>Oportunidade</span><input name="value" type="number" min="0" step="100" value="0"></div></div><div class="field"><span>Próxima ação</span><input name="nextAction" placeholder="O que acontece na próxima conversa"></div>';
    }
    if (modal.type === "task") {
      const block = modal.block || "manha";
      return '<div class="field"><span>Título</span><input name="title" required placeholder="O verbo e o entregável"></div><div class="two"><div class="field"><span>Data</span><input name="date" type="date" value="' + VH.todayISO() + '"></div><div class="field"><span>Hora</span><input name="time" value="09:00"></div></div><div class="two"><div class="field"><span>Bloco</span><select name="block">' + options([["manha", "Manhã · foco"], ["tarde", "Tarde · execução"], ["noite", "Noite · fechamento"]], block) + '</select></div><div class="field"><span>Prioridade</span><select name="priority">' + options([["critica", "Crítica"], ["alta", "Alta"], ["media", "Média"], ["baixa", "Baixa"]], "media") + '</select></div></div><div class="two"><div class="field"><span>Projeto</span><select name="projectId"><option value="">Interno</option>' + options(projects, "") + '</select></div><div class="field"><span>Tag</span><input name="tag" placeholder="Estúdio"></div></div><div class="field"><span>Detalhe</span><textarea name="detail"></textarea></div>';
    }
    if (modal.type === "automation") {
      return '<div class="field"><span>Nome</span><input name="name" required></div><div class="two"><div class="field"><span>Plataforma</span><select name="platform">' + options([["n8n", "n8n"], ["Make", "Make"], ["GitHub", "GitHub"]], "n8n") + '</select></div><div class="field"><span>Gatilho</span><input name="trigger" placeholder="Webhook, agenda, formulário"></div></div><div class="field"><span>O que este fluxo protege</span><textarea name="summary"></textarea></div>';
    }
    if (modal.type === "asset") {
      return '<div class="two"><div class="field"><span>Tipo</span><select name="type">' + options([["prompt", "Prompt"], ["agente", "Agente"], ["template", "Template"], ["componente", "Componente"]], "prompt") + '</select></div><div class="field"><span>Versão</span><input name="version" value="v1.0"></div></div><div class="field"><span>Nome</span><input name="name" required></div><div class="field"><span>Resumo</span><input name="summary"></div><div class="field"><span>Tags</span><input name="tags" placeholder="COPY, AI"></div><div class="field"><span>Conteúdo</span><textarea name="body" style="min-height:140px"></textarea></div>';
    }
    return '<div class="field"><span>Descrição</span><input name="title" required></div><div class="two"><div class="field"><span>Tipo</span><select name="kind">' + options([["entrada", "Entrada"], ["saida", "Saída"]], "entrada") + '</select></div><div class="field"><span>Valor</span><input name="amount" type="number" min="0" step="50" required></div></div><div class="two"><div class="field"><span>Status</span><select name="status">' + options([["previsto", "Previsto"], ["recebido", "Recebido"], ["pago", "Pago"]], "previsto") + '</select></div><div class="field"><span>Data</span><input name="date" type="date" value="' + VH.todayISO() + '"></div></div><div class="field"><span>Projeto</span><select name="projectId"><option value="">Sem projeto</option>' + options(projects, "") + "</select></div>";
  }

  function drawerHTML(d) {
    if (d.type === "project") return projectDrawer(d.id);
    if (d.type === "task") return taskDrawer(d.id);
    if (d.type === "asset") return assetDrawer(d.id);
    return "";
  }
  function projectDrawer(id) {
    const p = projectOf(id);
    if (!p) return "";
    const c = clientOf(p.clientId);
    const tasks = state().tasks.filter((t) => t.projectId === p.id);
    const late = VH.daysUntil(p.deadline);
    return '<div class="drawer-back" data-act="close-drawer"></div><aside class="drawer"><div class="row-between"><div class="kicker red">War room</div><button class="icon-btn" data-act="close-drawer" aria-label="Fechar">' + icon("close", 16) + "</button></div>" +
      '<div class="who" style="margin-top:16px"><div class="letter lg">' + esc(p.letter) + "</div><div><div class=\"kicker\">" + esc(c ? c.company : "Sem cliente") + "</div><h2>" + esc(p.name) + "</h2></div></div>" +
      (p.critical ? '<div class="flag" style="display:inline-block;margin-top:10px">CRÍTICO</div>' : "") +
      '<div class="two" style="margin-top:16px"><div class="field"><span>Status</span><select data-act="project-status" data-id="' + p.id + '">' + options([["descoberta", "Descoberta"], ["producao", "Produção"], ["revisao", "Revisão"], ["entregue", "Entregue"]], p.status) + '</select></div><div class="field"><span>Prazo</span><input type="date" data-act="project-deadline" data-id="' + p.id + '" value="' + esc(p.deadline) + '"></div></div>' +
      '<div class="field"><span>Progresso · <b id="prog-val">' + p.progress + '%</b></span><input class="range" type="range" min="0" max="100" value="' + p.progress + '" data-act="project-progress" data-id="' + p.id + '"></div>' +
      '<div class="dossier-grid"><div class="stat"><div class="kicker">Valor</div><b>' + money(p.value) + '</b></div><div class="stat"><div class="kicker">Recebido</div><b>' + money(p.paid || 0) + "</b></div></div>" +
      '<p class="note" style="margin-top:8px">Saldo ' + money((p.value || 0) - (p.paid || 0)) + (late < 0 ? " · marco atrasado" : " · " + esc(p.milestone) + " em " + late + " dia" + (late === 1 ? "" : "s")) + ".</p>" +
      '<div class="actions"><button class="soft" data-act="toggle-critical" data-id="' + p.id + '">' + (p.critical ? "Tirar crítico" : "Marcar crítico") + "</button>" + (c ? '<button class="soft" data-act="open-client" data-id="' + c.id + '">Abrir ' + esc(c.name.split(" ")[0]) + "</button>" : "") + "</div>" +
      '<hr class="sep"><div class="kicker">Brief</div><p class="note">' + esc(p.brief || "Sem brief ainda.") + "</p>" +
      '<div class="kicker" style="margin-top:16px">Marcos</div><div class="task-list">' + p.milestones.map((m) =>
        '<div class="task-row' + (m.done ? " done" : "") + '"><button class="check' + (m.done ? " on" : "") + '" data-act="milestone" data-id="' + p.id + '" data-ms="' + m.id + '">' + (m.done ? icon("tasks", 12) : "") + '</button><div class="task-title">' + esc(m.title) + "</div></div>"
      ).join("") + "</div>" +
      '<div class="kicker" style="margin-top:16px">Tarefas ligadas</div>' + (tasks.length ? '<div class="task-list">' + tasks.map(taskRow).join("") + "</div>" : '<p class="note">Nenhuma tarefa neste projeto.</p>') +
      '<div class="field" style="margin-top:12px"><span>Nota de produção</span><textarea id="project-note">' + esc(p.notes || "") + '</textarea></div><button class="soft" data-act="save-project-note" data-id="' + p.id + '">Salvar nota</button></aside>';
  }
  function taskDrawer(id) {
    const t = state().tasks.find((x) => x.id === id);
    if (!t) return "";
    const p = projectOf(t.projectId);
    return '<div class="drawer-back" data-act="close-drawer"></div><aside class="drawer"><div class="row-between"><div class="kicker red">Execução</div><button class="icon-btn" data-act="close-drawer" aria-label="Fechar">' + icon("close", 16) + "</button></div><h2>" + esc(t.title) + "</h2>" +
      '<div class="meta" style="margin-top:8px"><span class="chip">' + esc(t.tag) + "</span><span>" + prioLabel(t.priority) + "</span><span class=\"time\">" + esc(t.time) + " · " + shortDate(t.date) + "</span></div>" +
      '<p class="note" style="margin-top:16px">' + esc(t.detail || "Sem detalhe operacional.") + "</p>" +
      '<div class="actions"><button class="primary" data-act="toggle-task" data-id="' + t.id + '">' + (t.done ? "Reabrir" : "Concluir") + '</button><button class="soft" data-act="focus-start" data-id="' + t.id + '">Focar 25 min</button>' +
      (p ? '<button class="soft" data-act="open-project" data-id="' + p.id + '">' + esc(p.name) + "</button>" : "") +
      (t.automationId ? '<button class="soft" data-act="open-auto" data-id="' + t.automationId + '">Abrir workflow</button>' : "") +
      "</div></aside>";
  }
  function assetDrawer(id) {
    const a = state().arsenal.find((x) => x.id === id);
    if (!a) return "";
    return '<div class="drawer-back" data-act="close-drawer"></div><aside class="drawer"><div class="row-between"><div class="kicker red">' + typeLabel(a.type) + " · " + esc(a.version) + '</div><button class="icon-btn" data-act="close-drawer" aria-label="Fechar">' + icon("close", 16) + "</button></div><h2>" + esc(a.name) + "</h2><p class=\"note\">" + esc(a.summary) + "</p>" +
      '<div class="meta" style="margin:10px 0">' + a.tags.map((t) => '<span class="chip">' + esc(t) + "</span>").join("") + '<span class="time">' + a.uses + " usos</span></div>" +
      '<pre class="pre">' + esc(a.body) + "</pre>" +
      '<div class="actions"><button class="primary" data-act="compose-open" data-id="' + a.id + '">Executar no projeto</button><button class="soft" data-act="copy-asset" data-id="' + a.id + '">' + icon("copy", 14) + " Copiar</button></div></aside>";
  }

  function openCreate(type, block) {
    if (locked()) return;
    ui.modal = { type: type, block: block || null };
    ui.novo = false;
    ui.palette = false;
    renderOverlays();
  }
  function openProject(id) {
    ui.room = id;
    ui.drawer = null;
    ui.modal = null;
    ui.palette = false;
    const href = "/sistema/projetos";
    resetScroll = true;
    if (location.pathname !== href) history.pushState({}, "", href);
    paint();
    resetScroll = false;
  }
  function openClient(id) {
    ui.clientId = id;
    ui.drawer = null;
    ui.palette = false;
    const href = "/sistema/clientes";
    resetScroll = location.pathname !== href;
    if (location.pathname !== href) history.pushState({}, "", href);
    paint();
    resetScroll = false;
    setTimeout(() => { const el = document.getElementById("dossier"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 40);
  }
  function openTask(id) {
    ui.drawer = { type: "task", id };
    ui.palette = false;
    const href = "/sistema/tarefas";
    if (location.pathname !== href) history.pushState({}, "", href);
    paint();
  }
  function openAuto(id) {
    ui.autoId = id;
    ui.drawer = null;
    ui.palette = false;
    const href = "/sistema/automacoes";
    if (location.pathname !== href) history.pushState({}, "", href);
    paint();
  }
  function openAsset(id) {
    ui.drawer = { type: "asset", id };
    ui.palette = false;
    const href = "/sistema/arsenal";
    if (location.pathname !== href) history.pushState({}, "", href);
    paint();
  }
  function openPalette() {
    ui.palette = true;
    ui.q = "";
    ui.pi = 0;
    ui.novo = false;
    ui.notify = false;
    ui.more = false;
    focusPalette = true;
    renderOverlays();
  }

  function readForm(form) {
    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = String(v); });
    return data;
  }
  function afterCreate(res, href, drawer) {
    if (!res || !res.ok) { if (res && res.reason === "publico") toast("Ambiente público. Ative Operacional no cabeçalho para editar."); return; }
    ui.modal = null;
    if (drawer) ui.drawer = drawer;
    toast("Criado e já entrou no cockpit.");
    if (href && location.pathname !== href) history.pushState({}, "", href);
    paint();
  }

  function onSubmit(e) {
    const form = e.target;
    if (!form.dataset || !form.dataset.form) return;
    e.preventDefault();
    const kind = form.dataset.form;
    const data = readForm(form);
    if (kind === "connect") {
      if (locked()) return;
      if (!data.key || data.key.trim().length < 8) { toast("Cole uma chave para marcar. Ela não será guardada."); return; }
      const res = VH.setIntegration(data.id, true);
      ui.modal = null;
      if (res.ok) toast("Conexão marcada neste navegador. A chave não foi salva.");
      paint();
      return;
    }
    if (locked()) return;
    if (kind === "project") {
      if (!data.name.trim()) return toast("O projeto precisa de um nome.");
      const res = VH.addProject(data);
      if (res.ok) afterCreate(res, "/sistema/projetos", { type: "project", id: res.project.id });
      return;
    }
    if (kind === "client") {
      if (!data.name.trim() || !data.company.trim()) return toast("Nome e empresa fecham o card.");
      const res = VH.addClient(data);
      if (res.ok) { ui.clientId = res.client.id; afterCreate(res, "/sistema/clientes"); }
      return;
    }
    if (kind === "task") {
      if (!data.title.trim()) return toast("A tarefa precisa de um verbo.");
      const project = projectOf(data.projectId);
      if (!data.tag) data.tag = project ? project.name : "Estúdio";
      const res = VH.addTask(data);
      if (res.ok) afterCreate(res, "/sistema/tarefas", { type: "task", id: res.task.id });
      return;
    }
    if (kind === "automation") {
      if (!data.name.trim()) return toast("Dê um nome ao fluxo.");
      const res = VH.addAutomation(data);
      if (res.ok) { ui.autoId = res.automation.id; afterCreate(res, "/sistema/automacoes"); }
      return;
    }
    if (kind === "asset") {
      if (!data.name.trim()) return toast("O arsenal precisa de um nome.");
      const res = VH.addArsenal(data);
      if (res.ok) afterCreate(res, "/sistema/arsenal", { type: "asset", id: res.item.id });
      return;
    }
    if (kind === "movement") {
      if (!data.title.trim() || !data.amount) return toast("Descrição e valor.");
      const res = VH.addMovement(data);
      if (res.ok) afterCreate(res, "/sistema/financeiro");
    }
  }

  function onClick(e) {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    const id = el.dataset.id;
    if (act === "go") { go(el.dataset.href); return; }
    if (act === "palette") { openPalette(); return; }
    if (act === "dismiss") { ui.palette = false; ui.notify = false; ui.novo = false; ui.more = false; ui.modal = null; renderOverlays(); return; }
    if (act === "close-drawer") { ui.drawer = null; paint(); return; }
    if (act === "novo") { ui.novo = !ui.novo; ui.notify = false; ui.more = false; renderOverlays(); return; }
    if (act === "more") { ui.more = !ui.more; renderOverlays(); return; }
    if (act === "notify") {
      ui.notify = !ui.notify;
      ui.novo = false;
      if (ui.notify) VH.markAllSeen(VH.notifications().map((n) => n.id));
      renderOverlays();
      updateChrome();
      return;
    }
    if (act === "toggle-mode") { VH.setMode(state().prefs.mode === "publico" ? "operacional" : "publico"); toast(state().prefs.mode === "publico" ? "Visualização pública. Edição protegida." : "Operacional. O cockpit aceita edição."); return; }
    if (act === "create") { openCreate(el.dataset.type, el.dataset.block); return; }
    if (act === "filter") { ui.filter = id; renderView(); return; }
    if (act === "project-view") { ui.projectView = id; renderView(); return; }
    if (act === "client-view") { ui.clientView = id; renderView(); return; }
    if (act === "close-room") { ui.room = null; resetScroll = true; paint(); resetScroll = false; return; }
    if (act === "open-gate") { ui.modal = { type: "gate", id: id }; renderOverlays(); return; }
    if (act === "pull-today") {
      if (locked()) return;
      const res = VH.rescheduleTask(id, VH.todayISO());
      if (res.ok) toast("Puxada para hoje. O bloco da tarde ainda cabe.");
      return;
    }
    if (act === "schedule-client") {
      if (locked()) return;
      const res = VH.scheduleClientAction(id);
      if (!res.ok && res.reason === "empty") return toast("Esse cliente não tem próxima ação escrita.");
      if (res.same) return toast("Essa ação já está na agenda de hoje.");
      if (res.ok) toast("Entrou na tarde de hoje, ligada ao projeto.");
      return;
    }
    if (act === "force-deliver") {
      if (locked()) return;
      const p = projectOf(id);
      if (!p) return;
      ui.modal = null;
      VH.log(p.name + " foi entregue com ressalva.");
      VH.updateProject(id, { status: "entregue" });
      toast("Entregue com ressalva. O pulso registrou o que ficou aberto.");
      return;
    }
    if (act === "advance-project") {
      if (locked()) return;
      const p = projectOf(id);
      if (!p) return;
      const order = ["descoberta", "producao", "revisao", "entregue"];
      const next = order[Math.min(order.indexOf(p.status) + 1, order.length - 1)];
      if (!next || next === p.status) return toast("Já está entregue.");
      if (next === "entregue" && gateLines(id).length) {
        ui.modal = { type: "gate", id: id };
        renderOverlays();
        return;
      }
      VH.updateProject(id, { status: next });
      VH.log(p.name + " avançou para " + VH.labelStatus(next) + ".");
      toast(p.name + " foi para " + VH.labelStatus(next) + ".");
      return;
    }
    if (act === "compose-open") {
      ui.drawer = null;
      ui.modal = { type: "compose", id: id || "proposta", project: el.dataset.project || (ui.room || (state().projects[0] && state().projects[0].id) || "") };
      ui.palette = false;
      renderOverlays();
      return;
    }
    if (act === "compose-copy") {
      const out = document.getElementById("compose-out");
      const text = out ? out.value : "";
      if (!text.trim()) return toast("Nada para copiar.");
      copyText(text).then(() => {
        if (id) VH.bumpUse(id);
        toast("Peça copiada. O uso entrou no arsenal.");
      });
      return;
    }
    if (act === "asset-filter") { ui.assetFilter = id; renderView(); return; }
    if (act === "open-project") { openProject(id); return; }
    if (act === "open-client" || act === "select-client") { openClient(id); return; }
    if (act === "open-task") { openTask(id); return; }
    if (act === "open-auto" || act === "select-auto") { openAuto(id); return; }
    if (act === "open-asset") { openAsset(id); return; }
    if (act === "palette-go") { activatePalette(Number(el.dataset.i)); return; }
    if (act === "open-note") {
      const kind = el.dataset.kind;
      const focus = el.dataset.focus;
      ui.notify = false;
      if (kind === "project" && focus) openProject(focus);
      else if (kind === "client" && focus) openClient(focus);
      else if (kind === "auto" && focus) openAuto(focus);
      else go(el.dataset.href);
      return;
    }
    if (act === "toggle-task") {
      if (locked()) return;
      const res = VH.toggleTask(id);
      if (res.ok) toast(res.task.done ? "Concluída. O comando já recalculou o dia." : "Tarefa reaberta.", true);
      return;
    }
    if (act === "undo") { if (VH.undoLast()) toast("Desfeito."); return; }
    if (act === "milestone") {
      if (locked()) return;
      VH.toggleMilestone(id, el.dataset.ms);
      return;
    }
    if (act === "toggle-critical") {
      if (locked()) return;
      const p = projectOf(id);
      VH.updateProject(id, { critical: !p.critical });
      toast(p.critical ? "Crítico removido." : "Marcado como crítico. O comando passa a contar.");
      return;
    }
    if (act === "save-project-note") {
      if (locked()) return;
      const note = document.getElementById("project-note");
      VH.updateProject(id, { notes: note ? note.value : "" });
      toast("Nota de produção salva.");
      return;
    }
    if (act === "save-client-note") {
      if (locked()) return;
      const note = document.getElementById("client-note");
      VH.updateClient(id, { notes: note ? note.value : "" });
      toast("Notas da relação salvas.");
      return;
    }
    if (act === "log-contact") {
      if (locked()) return;
      const field = document.getElementById("contact-field");
      const text = field && field.value.trim();
      if (!text) return toast("Escreva o que foi combinado.");
      VH.logContact(id, text);
      toast("Contato registrado. O relógio do radar zerou.");
      return;
    }
    if (act === "cycle-stage") {
      if (locked()) return;
      const res = VH.cycleStage(id);
      if (!res.ok && res.reason === "lost") return toast("Relação encerrada. Reabra editando a etapa se voltar a conversar.");
      if (res.same) return toast("Já está em cliente ativo.");
      toast("Etapa avançou para " + VH.labelStage(res.client.stage) + ".");
      return;
    }
    if (act === "lose-client") {
      if (locked()) return;
      VH.updateClient(id, { stage: "perdido" });
      VH.log("Relação marcada como perdida.");
      toast("Marcado como perdido. Sai do radar quente.");
      return;
    }
    if (act === "run-auto") {
      if (locked()) return;
      const res = VH.runAutomation(id);
      if (res.ok) toast(res.success ? "Run concluída." : res.msg);
      return;
    }
    if (act === "resolve-auto") {
      if (locked()) return;
      const res = VH.resolveAutomation(id);
      if (!res.ok && res.reason === "incomplete") return toast("Feche os três itens do runbook antes de registrar a correção.");
      if (res.ok) toast("Stripe Sync voltou. O Discord volta a ouvir pagamento.");
      return;
    }
    if (act === "copy-asset") {
      const item = state().arsenal.find((a) => a.id === id);
      if (!item) return;
      copyText(item.body).then(() => {
        VH.bumpUse(id);
        toast("Copiado. O uso foi contado.");
      });
      return;
    }
    if (act === "focus-start") {
      const t = state().tasks.find((x) => x.id === id);
      if (!t) return;
      ui.focus = { id: t.id, title: t.title, ends: Date.now() + 25 * 60 * 1000 };
      sessionStorage.setItem("vh-focus", JSON.stringify(ui.focus));
      toast("25 minutos em " + t.title + ". O resto espera.");
      updateChrome();
      return;
    }
    if (act === "focus-stop") {
      ui.focus = null;
      sessionStorage.removeItem("vh-focus");
      updateChrome();
      toast("Foco encerrado.");
      return;
    }
    if (act === "receive") {
      if (locked()) return;
      const res = VH.confirmMovement(id);
      if (res.ok) toast("Recebimento confirmado no mês.");
      return;
    }
    if (act === "pref") {
      const key = el.dataset.key;
      const prefs = state().prefs;
      if (key === "density") VH.setPrefs({ density: prefs.density === "compact" ? "operational" : "compact" });
      if (key === "alerts") VH.setPrefs({ alerts: !prefs.alerts });
      if (key === "motion") VH.setPrefs({ reduceMotion: !prefs.reduceMotion });
      return;
    }
    if (act === "save-prefs") { toast("Preferências já estão valendo neste navegador."); return; }
    if (act === "save-ownership") {
      if (locked()) return;
      let domain = val("ws-domain").trim().replace(/\/$/, "");
      if (domain && !/^https?:\/\//i.test(domain)) domain = "https://" + domain;
      if (domain && !/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(domain)) return toast("Domínio inválido. Use https://seudominio.com ou deixe vazio.");
      const phone = val("ws-whatsapp").replace(/\D/g, "");
      if (phone && (phone.length < 10 || phone.length > 15)) return toast("WhatsApp precisa do DDI e do número, só dígitos.");
      const res = VH.setProfile({ domain: domain, whatsapp: phone || state().profile.whatsapp });
      if (res.ok) toast(domain ? "Domínio registrado no backup. O arquivo js/config.js continua sendo a fonte do site." : "Propriedade salva. Domínio de produção ainda em aberto.");
      return;
    }
    if (act === "copy-brief") {
      const cfg = window.VHConfig || {};
      const p = state().profile;
      const field = document.getElementById("ws-domain");
      const domain = (field && field.value.trim()) || p.domain || "ainda não definido";
      const text = [
        "Victor Hub AI — briefing para o agente do VS Code",
        "",
        "Leia docs/AGENTE.md e rode python3 scripts/validate.py antes de mudar qualquer arquivo.",
        "Não recrie o sistema. Não invente depoimento, banco nem domínio.",
        "",
        "Banco hoje: localStorage, chave " + (cfg.storageKey || "victor-hub-os-v1") + ". O backup JSON de Configurações é o banco portátil.",
        "dataMode: " + (cfg.dataMode || "local") + ". Não ligue API sem pedido explícito.",
        "Domínio de produção: " + (domain || "ainda não definido") + ".",
        "WhatsApp: " + (p.whatsapp || cfg.whatsapp || "") + ".",
        "Não recoloque depoimento na home. Clientes da semente não são prova social.",
      ].join("\n");
      copyText(text).then(() => toast("Briefing copiado. Cole no agente do VS Code junto com o zip."));
      return;
    }
    if (act === "save-profile") {
      if (locked()) return;
      const res = VH.setProfile({
        workspace: val("ws-name"),
        objective: val("ws-obj"),
        name: val("ws-you") || "Victor",
        city: val("ws-city"),
      });
      if (res.ok) toast("Identidade salva.");
      return;
    }
    if (act === "connect") { ui.modal = { type: "connect", id: id }; renderOverlays(); return; }
    if (act === "export") { downloadBackup(); return; }
    if (act === "import-pick") { const input = document.getElementById("import-file"); if (input) input.click(); return; }
    if (act === "ask-reset") { ui.modal = { type: "reset" }; renderOverlays(); return; }
    if (act === "do-reset") { VH.reset(); ui.modal = null; ui.drawer = null; toast("Semente restaurada. O sistema voltou ao ponto recuperado."); paint(); return; }
    if (act === "reload") location.reload();
  }
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }
  function onChange(e) {
    const el = e.target;
    const act = el.dataset.act;
    if (!act) return;
    if (act === "project-status") {
      if (locked()) return paint();
      VH.updateProject(el.dataset.id, { status: el.value });
      toast("Status atualizado.");
      return;
    }
    if (act === "project-deadline") {
      if (locked()) return paint();
      VH.updateProject(el.dataset.id, { deadline: el.value });
      return;
    }
    if (act === "project-progress") {
      if (locked()) return paint();
      VH.updateProject(el.dataset.id, { progress: Number(el.value) });
      return;
    }
    if (act === "compose-asset" || act === "compose-project") {
      if (!ui.modal || ui.modal.type !== "compose") return;
      if (act === "compose-asset") ui.modal.id = el.value;
      else ui.modal.project = el.value;
      renderOverlays();
      return;
    }
    if (act === "fix") {
      if (locked()) return paint();
      VH.toggleFix(el.dataset.id, el.dataset.key);
    }
  }
  function onInput(e) {
    const el = e.target;
    if (el.dataset.act === "project-progress") {
      const label = document.getElementById("prog-val");
      if (label) label.textContent = el.value + "%";
    }
    if (el.id === "palette-q") {
      ui.q = el.value;
      ui.pi = 0;
      const list = document.getElementById("palette-list");
      if (list) list.innerHTML = paletteListHTML();
    }
  }
  function onFile(e) {
    const el = e.target;
    if (!el || el.id !== "import-file" || !el.files || !el.files[0]) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { VH.importState(String(reader.result)); toast("Backup importado."); paint(); }
      catch (err) { toast("Esse arquivo não é um backup do Victor Hub."); }
    };
    reader.readAsText(el.files[0]);
    el.value = "";
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise((resolve) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      resolve();
    });
  }
  function downloadBackup() {
    const blob = new Blob([VH.exportState()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "victor-hub-backup-" + VH.todayISO() + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Backup baixado. Guarde fora do navegador.");
  }

  function onKey(e) {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (ui.palette) { ui.palette = false; renderOverlays(); }
      else openPalette();
      return;
    }
    if (e.key === "Escape") {
      if (ui.drawer || ui.modal || ui.palette || ui.notify || ui.novo || ui.more) {
        ui.drawer = null;
        ui.modal = null;
        ui.palette = false;
        ui.notify = false;
        ui.novo = false;
        ui.more = false;
        paint();
      }
      return;
    }
    if (ui.palette && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      const items = selectable();
      if (!items.length) return;
      if (e.key === "ArrowDown") { ui.pi = Math.min(items.length - 1, ui.pi + 1); e.preventDefault(); const list = document.getElementById("palette-list"); if (list) list.innerHTML = paletteListHTML(); }
      if (e.key === "ArrowUp") { ui.pi = Math.max(0, ui.pi - 1); e.preventDefault(); const list = document.getElementById("palette-list"); if (list) list.innerHTML = paletteListHTML(); }
      if (e.key === "Enter") { e.preventDefault(); activatePalette(ui.pi); }
      return;
    }
    if (!typing(e.target) && !ui.palette && !ui.modal && e.key.toLowerCase() === "n") {
      ui.novo = !ui.novo;
      renderOverlays();
    }
  }

  function boot() {
    VH.load();
    try {
      const raw = sessionStorage.getItem("vh-focus");
      if (raw) {
        const f = JSON.parse(raw);
        if (f && f.ends > Date.now()) ui.focus = f;
      }
    } catch (err) { /* foco é opcional */ }
    document.getElementById("app").innerHTML = shell();
    document.getElementById("app").addEventListener("click", onClick);
    document.getElementById("app").addEventListener("change", onChange);
    document.getElementById("app").addEventListener("input", onInput);
    document.getElementById("app").addEventListener("submit", onSubmit);
    document.getElementById("app").addEventListener("change", onFile);
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", paint);
    VH.subscribe(paint);
    paint();
    if (!VH.get().welcomed) {
      setTimeout(() => {
        toast("Sistema recuperado neste navegador. Exporte um backup em Configurações — a pasta não se perde de novo.");
        VH.markWelcomed();
      }, 700);
    }
    setInterval(() => {
      const clock = document.getElementById("clock");
      if (clock) clock.textContent = clockNow();
      const pill = document.getElementById("focus-pill");
      if (!pill) return;
      if (!ui.focus) { pill.classList.remove("show"); return; }
      const left = ui.focus.ends - Date.now();
      if (left <= 0) {
        const title = ui.focus.title;
        ui.focus = null;
        sessionStorage.removeItem("vh-focus");
        pill.classList.remove("show");
        toast("Bloco de 25 minutos encerrado · " + title);
        return;
      }
      pill.classList.add("show");
      const b = pill.querySelector("b");
      if (b) b.textContent = fmtLeft(left);
    }, 1000);
  }

  boot();
})();
