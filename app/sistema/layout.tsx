"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  LayoutGrid,
  Briefcase,
  Users,
  CheckSquare,
  Workflow,
  Sparkles,
  DollarSign,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowLeft,
  X,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { SistemaProvider, useSistema } from "@/context/sistema-context";
import { headerDate, clockNow } from "@/lib/seed-data";

function SistemaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    state,
    kpis,
    toasts,
    removeToast,
    addToast,
    focus,
    startFocus,
    stopFocus,
    setMode,
    paletteOpen,
    setPaletteOpen,
    novoModalOpen,
    setNovoModalOpen,
    clientDrawerId,
    setClientDrawerId,
    clientById,
    updateClient,
    cycleStage,
    logContact,
    scheduleClientAction,
    deliveryBlockerProject,
    setDeliveryBlockerProject,
    deliveryBlockers,
    forceDeliver,
    composeModal,
    setComposeModal,
    composeAsset,
    addTask,
    addProject,
    addClient,
    addMovement,
  } = useSistema();

  // Search Palette State
  const [searchQuery, setSearchQuery] = useState("");

  // Novo Modal Active Tab
  const [novoTab, setNovoTab] = useState<"tarefa" | "projeto" | "cliente" | "movimento">("tarefa");

  // New item form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskPriority, setTaskPriority] = useState<"critica" | "alta" | "media" | "baixa">("media");
  const [taskTime, setTaskTime] = useState("10:00");

  const [projName, setProjName] = useState("");
  const [projClient, setProjClient] = useState("");
  const [projValue, setProjValue] = useState("18000");
  const [projMilestone, setProjMilestone] = useState("Kickoff");

  const [cliName, setCliName] = useState("");
  const [cliCompany, setCliCompany] = useState("");
  const [cliValue, setCliValue] = useState("20000");
  const [cliNext, setCliNext] = useState("Agendar apresentação de proposta.");

  const [movTitle, setMovTitle] = useState("");
  const [movKind, setMovKind] = useState<"entrada" | "saida">("entrada");
  const [movAmount, setMovAmount] = useState("5000");

  // Contact note in client drawer
  const [contactText, setContactText] = useState("");

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setNovoModalOpen(false);
        setClientDrawerId(null);
        setDeliveryBlockerProject(null);
        setComposeModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paletteOpen, setPaletteOpen, setNovoModalOpen, setClientDrawerId, setDeliveryBlockerProject, setComposeModal]);

  const navItems = [
    { label: "Comando", href: "/sistema", icon: LayoutGrid, exact: true },
    {
      label: "Projetos",
      href: "/sistema/projetos",
      icon: Briefcase,
      badge: String(kpis.active),
    },
    { label: "Clientes", href: "/sistema/clientes", icon: Users },
    {
      label: "Tarefas",
      href: "/sistema/tarefas",
      icon: CheckSquare,
      badge: String(kpis.pending),
      badgeRed: kpis.pending > 0,
    },
    { label: "Automações", href: "/sistema/automacoes", icon: Workflow },
    { label: "Arsenal", href: "/sistema/arsenal", icon: Sparkles },
    { label: "Financeiro", href: "/sistema/financeiro", icon: DollarSign },
    { label: "Configurações", href: "/sistema/configuracoes", icon: Settings },
  ];

  // Search filtered results
  const filteredProjects = searchQuery.trim()
    ? state.projects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredClients = searchQuery.trim()
    ? state.clients.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredTasks = searchQuery.trim()
    ? state.tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const activeClient = clientDrawerId ? clientById(clientDrawerId) : null;
  const activeBlockers = deliveryBlockerProject ? deliveryBlockers(deliveryBlockerProject.id) : null;
  const composedText = composeModal ? composeAsset(composeModal.assetId, composeModal.projectId) : "";

  return (
    <div className="dot-grid flex h-screen min-h-[680px] overflow-hidden bg-[#050505] text-[#f7f7f8]">
      {/* Sidebar Desktop */}
      <aside className="hidden h-full w-[250px] shrink-0 flex-col border-r border-white/[0.09] bg-[#050505]/95 lg:flex">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ef233c] text-white shadow-[0_0_24px_rgba(239,35,60,0.34)]">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="font-display text-[17px] font-extrabold tracking-tight text-white">
              Victor Hub <span className="text-[#ef233c]">AI</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#66666f]">
              Production OS
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 pt-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring group flex h-10 items-center gap-3 rounded-r-lg px-3 text-sm transition ${
                  isActive
                    ? "border-l-2 border-[#ef233c] bg-[rgba(239,35,60,0.1)] font-medium text-white"
                    : "text-[#a1a1aa] hover:bg-white/[0.045] hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-[#ef233c]" : "text-[#777780] group-hover:text-white"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto rounded px-1.5 py-0.5 font-mono text-[10px] ${
                      item.badgeRed
                        ? "bg-[#ef233c] font-bold text-white shadow-[0_0_10px_rgba(239,35,60,0.4)]"
                        : "bg-white/[0.08] text-[#a1a1aa]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Sidebar Info: System Health */}
        <div className="border-t border-white/[0.09] p-4">
          <div className="glass mb-4 rounded-xl p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#66666f]">
                System health
              </span>
              <span
                className={`h-2 w-2 rounded-full ${
                  state.prefs.mode === "operacional"
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
                    : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                }`}
              />
            </div>
            <div
              className={`text-xs font-semibold ${
                state.prefs.mode === "operacional" ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {state.prefs.mode === "operacional" ? "Banco sincronizado" : "Modo de visualização"}
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full w-full rounded-full ${
                  state.prefs.mode === "operacional" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] font-bold text-white">
                V
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">Victor</div>
                <div className="font-mono text-[10px] text-[#66666f]">Owner • v1.0</div>
              </div>
            </div>
            <Link
              href="/sistema/configuracoes"
              className="text-[#66666f] hover:text-white transition"
              title="Configurações"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>

          <Link
            href="/"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8a8a93] hover:bg-white/[0.05] hover:text-white transition"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar ao site
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.09] bg-[#050505]/90 px-4 backdrop-blur-xl sm:px-7 z-10">
          {/* Left: Live Operation Date */}
          <div className="hidden lg:block min-w-[210px] text-left">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#66666f]">
              {headerDate()}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mt-0.5">
              <i className="h-1.5 w-1.5 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c] inline-block animate-pulse" />
              <span>
                Operação ao vivo · <span className="font-mono text-white">{clockNow()}</span>
              </span>
            </div>
          </div>

          {/* Center: Search trigger with Ctrl K */}
          <div className="relative mx-auto w-full max-w-[520px] px-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-xs text-[#777780] hover:border-white/[0.18] hover:text-white transition"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-3.5 w-3.5 text-[#ef233c]" />
                <span className="truncate">Buscar tarefas, clientes, automações...</span>
              </div>
              <kbd className="hidden sm:inline-block rounded border border-white/[0.1] bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-[#777780]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {focus && (
              <button
                type="button"
                onClick={stopFocus}
                title="Encerrar foco"
                className="flex items-center gap-1.5 rounded-lg border border-[#ef233c]/40 bg-[#ef233c]/15 px-2.5 py-1.5 font-mono text-xs font-bold text-white shadow-[0_0_12px_rgba(239,35,60,0.3)] hover:brightness-110 transition"
              >
                <Sparkles className="h-3 w-3 text-[#ef233c]" />
                <span>
                  {Math.max(0, Math.floor((focus.ends - Date.now()) / 60000))}m
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[#777780] hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-white transition"
              title="Notificações"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ef233c] shadow-[0_0_6px_#ef233c]" />
            </button>

            <button
              type="button"
              onClick={() =>
                setMode(state.prefs.mode === "operacional" ? "publico" : "operacional")
              }
              className="hidden sm:flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#a1a1aa] hover:border-white/[0.2] transition"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  state.prefs.mode === "operacional"
                    ? "bg-emerald-400 shadow-[0_0_6px_#4ade80]"
                    : "bg-amber-400"
                }`}
              />
              <span>{state.prefs.mode === "operacional" ? "Operacional" : "Público"}</span>
            </button>

            <button
              type="button"
              onClick={() => setNovoModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#ef233c] px-3.5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,35,60,0.35)] hover:bg-[#ff3b50] transition"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>Novo</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile Bottom Navigation */}
        <div className="flex h-14 items-center justify-around border-t border-white/[0.09] bg-[#050505] lg:hidden">
          {navItems.slice(0, 5).map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? "text-[#ef233c]" : "text-[#777780]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-mono text-[9px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* GLOBAL MODAL 1: Command Palette (Ctrl+K) */}
      {/* ======================================================== */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-20 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.15] bg-[#0c0c0e] p-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/[0.1] pb-3">
              <Search className="h-4 w-4 text-[#ef233c]" />
              <input
                type="text"
                autoFocus
                placeholder="Digite para buscar projetos, clientes, tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-[#66666f] focus:outline-none"
              />
              <button
                onClick={() => setPaletteOpen(false)}
                className="text-[#8a8a93] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 max-h-[380px] overflow-y-auto space-y-3">
              {searchQuery.trim() === "" ? (
                <div className="space-y-2 py-2">
                  <div className="font-mono text-[10px] uppercase text-[#66666f]">Atalhos rápidos</div>
                  {navItems.map((n) => (
                    <button
                      key={n.href}
                      onClick={() => {
                        router.push(n.href);
                        setPaletteOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm text-[#a1a1aa] hover:bg-white/[0.05] hover:text-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <n.icon className="h-4 w-4 text-[#ef233c]" />
                        <span>{n.label}</span>
                      </div>
                      <span className="font-mono text-xs text-[#66666f]">{n.href}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Projetos encontrados */}
                  {filteredProjects.length > 0 && (
                    <div>
                      <div className="font-mono text-[10px] uppercase text-[#66666f]">Projetos</div>
                      {filteredProjects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            router.push(`/sistema/projetos/${p.id}`);
                            setPaletteOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm text-white hover:bg-white/[0.05]"
                        >
                          <span>{p.name}</span>
                          <span className="font-mono text-xs text-[#ef233c]">{p.status}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Clientes encontrados */}
                  {filteredClients.length > 0 && (
                    <div>
                      <div className="font-mono text-[10px] uppercase text-[#66666f]">Clientes</div>
                      {filteredClients.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setClientDrawerId(c.id);
                            setPaletteOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm text-white hover:bg-white/[0.05]"
                        >
                          <span>{c.name} ({c.company})</span>
                          <span className="font-mono text-xs text-[#8a8a93]">{c.stage}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tarefas encontradas */}
                  {filteredTasks.length > 0 && (
                    <div>
                      <div className="font-mono text-[10px] uppercase text-[#66666f]">Tarefas</div>
                      {filteredTasks.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            router.push("/sistema/tarefas");
                            setPaletteOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm text-white hover:bg-white/[0.05]"
                        >
                          <span className={t.done ? "line-through text-[#66666f]" : ""}>{t.title}</span>
                          <span className="font-mono text-xs text-[#8a8a93]">{t.time}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredProjects.length === 0 && filteredClients.length === 0 && filteredTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#8a8a93]">
                      Nenhum resultado encontrado para &quot;{searchQuery}&quot;
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GLOBAL MODAL 2: + Novo Item */}
      {/* ======================================================== */}
      {novoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.15] bg-[#0c0c0e] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-4">
              <h3 className="font-display text-lg font-bold text-white">Criar Novo Registro</h3>
              <button onClick={() => setNovoModalOpen(false)} className="text-[#8a8a93] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex gap-1 rounded-xl bg-white/[0.04] p-1">
              {(["tarefa", "projeto", "cliente", "movimento"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setNovoTab(tab)}
                  className={`flex-1 rounded-lg py-1.5 font-mono text-xs uppercase tracking-wider transition ${
                    novoTab === tab ? "bg-[#ef233c] font-bold text-white shadow" : "text-[#8a8a93] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form Tarefa */}
            {novoTab === "tarefa" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!taskTitle.trim()) return;
                  addTask({
                    title: taskTitle,
                    projectId: taskProject || null,
                    priority: taskPriority,
                    time: taskTime,
                  });
                  setTaskTitle("");
                  setNovoModalOpen(false);
                }}
                className="mt-4 space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-mono text-[#8a8a93] uppercase">Título da Tarefa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Refinar animação de botão"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Projeto</label>
                    <select
                      value={taskProject}
                      onChange={(e) => setTaskProject(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    >
                      <option value="">Sem projeto</option>
                      {state.projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Prioridade</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    >
                      <option value="critica">Crítica</option>
                      <option value="alta">Alta</option>
                      <option value="media">Média</option>
                      <option value="baixa">Baixa</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#ef233c] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110"
                  >
                    Adicionar Tarefa
                  </button>
                </div>
              </form>
            )}

            {/* Form Projeto */}
            {novoTab === "projeto" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!projName.trim()) return;
                  const newP = addProject({
                    name: projName,
                    clientId: projClient || null,
                    value: Number(projValue) || 15000,
                    milestone: projMilestone,
                  });
                  setProjName("");
                  setNovoModalOpen(false);
                  if (newP) router.push(`/sistema/projetos/${newP.id}`);
                }}
                className="mt-4 space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-mono text-[#8a8a93] uppercase">Nome do Projeto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: App Finanças Mobile"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Cliente</label>
                    <select
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    >
                      <option value="">Sem cliente</option>
                      {state.clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company} • {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Valor (R$)</label>
                    <input
                      type="number"
                      value={projValue}
                      onChange={(e) => setProjValue(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#ef233c] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110"
                  >
                    Criar e Abrir Sala do Projeto
                  </button>
                </div>
              </form>
            )}

            {/* Form Cliente */}
            {novoTab === "cliente" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cliName.trim() || !cliCompany.trim()) return;
                  addClient({
                    name: cliName,
                    company: cliCompany,
                    value: Number(cliValue) || 20000,
                    nextAction: cliNext,
                  });
                  setCliName("");
                  setCliCompany("");
                  setNovoModalOpen(false);
                }}
                className="mt-4 space-y-3.5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Nome do Contato</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Mendes"
                      value={cliName}
                      onChange={(e) => setCliName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alpha Ventures"
                      value={cliCompany}
                      onChange={(e) => setCliCompany(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8a8a93] uppercase">Próxima Ação</label>
                  <input
                    type="text"
                    value={cliNext}
                    onChange={(e) => setCliNext(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#ef233c] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110"
                  >
                    Registrar no Radar Comercial
                  </button>
                </div>
              </form>
            )}

            {/* Form Movimento Financeiro */}
            {novoTab === "movimento" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!movTitle.trim()) return;
                  addMovement({
                    title: movTitle,
                    kind: movKind,
                    amount: Number(movAmount) || 0,
                  });
                  setMovTitle("");
                  setNovoModalOpen(false);
                }}
                className="mt-4 space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-mono text-[#8a8a93] uppercase">Descrição do Lançamento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Parcela 2 Portal Lux"
                    value={movTitle}
                    onChange={(e) => setMovTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Tipo</label>
                    <select
                      value={movKind}
                      onChange={(e) => setMovKind(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    >
                      <option value="entrada">Entrada (+)</option>
                      <option value="saida">Saída (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#8a8a93] uppercase">Valor (R$)</label>
                    <input
                      type="number"
                      required
                      value={movAmount}
                      onChange={(e) => setMovAmount(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.12] bg-[#141417] px-3 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#ef233c] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110"
                  >
                    Registrar Movimentação
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GLOBAL MODAL 3: Trava de Entrega (Delivery Blocker) */}
      {/* ======================================================== */}
      {deliveryBlockerProject && activeBlockers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-[#ef233c]/40 bg-[#0e0a0b] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#ef233c]">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-display text-lg font-bold">Trava de Entrega Ativa</h3>
            </div>
            <p className="mt-2 text-xs text-[#c4c4cc]">
              O projeto <b className="text-white">{deliveryBlockerProject.name}</b> ainda possui itens em aberto antes de ser considerado 100% entregue:
            </p>

            <div className="mt-4 space-y-2 rounded-xl border border-white/[0.08] bg-black/40 p-3 max-h-48 overflow-y-auto">
              {activeBlockers.milestones.map((m) => (
                <div key={m.id} className="text-xs text-amber-300 font-mono">
                  • Marco aberto: {m.title}
                </div>
              ))}
              {activeBlockers.tasks.map((t) => (
                <div key={t.id} className="text-xs text-amber-300 font-mono">
                  • Tarefa pendente: {t.title}
                </div>
              ))}
              {activeBlockers.balance > 0 && (
                <div className="text-xs text-[#ef233c] font-mono font-bold">
                  • Saldo financeiro a receber: R$ {activeBlockers.balance.toLocaleString("pt-BR")}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
              <button
                type="button"
                onClick={() => {
                  const id = deliveryBlockerProject.id;
                  setDeliveryBlockerProject(null);
                  router.push(`/sistema/projetos/${id}`);
                }}
                className="rounded-xl border border-white/[0.15] bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.1]"
              >
                Abrir Sala do Projeto
              </button>
              <button
                type="button"
                onClick={() => forceDeliver(deliveryBlockerProject.id)}
                className="rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white hover:brightness-110"
              >
                Entregar mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GLOBAL DRAWER: Dossiê do Cliente */}
      {/* ======================================================== */}
      {activeClient && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="h-full w-full max-w-md border-l border-white/[0.12] bg-[#0c0c0e] p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.09] pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#ef233c]">Dossiê Comercial</span>
                <h3 className="font-display text-xl font-bold text-white">{activeClient.name}</h3>
                <p className="text-xs text-[#8a8a93]">{activeClient.company}</p>
              </div>
              <button onClick={() => setClientDrawerId(null)} className="text-[#8a8a93] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contato & Etapa */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                <span className="font-mono text-[10px] text-[#66666f] uppercase">Etapa Funil</span>
                <div className="mt-1 font-bold text-[#ef233c] uppercase">{activeClient.stage}</div>
                <button
                  type="button"
                  onClick={() => cycleStage(activeClient.id)}
                  className="mt-2 text-[10px] text-white underline hover:text-[#ef233c]"
                >
                  Avançar etapa →
                </button>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                <span className="font-mono text-[10px] text-[#66666f] uppercase">Valor Estimado</span>
                <div className="mt-1 font-bold text-white">R$ {activeClient.value.toLocaleString("pt-BR")}</div>
              </div>
            </div>

            {/* Próxima Ação */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <span className="font-mono text-[10px] text-[#ef233c] uppercase">Próxima Ação</span>
              <p className="mt-1 text-sm text-white">{activeClient.nextAction}</p>
              <button
                type="button"
                onClick={() => scheduleClientAction(activeClient.id)}
                className="mt-3 rounded-lg bg-[#ef233c] px-3 py-1.5 text-xs font-bold text-white hover:brightness-110"
              >
                Colocar na agenda de hoje
              </button>
            </div>

            {/* Registrar Contato */}
            <div>
              <span className="font-mono text-[10px] text-[#8a8a93] uppercase">Registrar Contato</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Call de alinhamento feita..."
                  value={contactText}
                  onChange={(e) => setContactText(e.target.value)}
                  className="flex-1 rounded-xl border border-white/[0.12] bg-[#141417] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (contactText.trim()) {
                      logContact(activeClient.id, contactText.trim());
                      setContactText("");
                    }
                  }}
                  className="rounded-xl bg-white/[0.1] px-3 text-xs text-white hover:bg-white/[0.2]"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <span className="font-mono text-[10px] text-[#66666f] uppercase">Histórico de Atividades</span>
              <div className="mt-3 space-y-3">
                {activeClient.timeline.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-[#ef233c]/40 pl-3">
                    <p className="text-xs text-white">{item.text}</p>
                    <span className="font-mono text-[10px] text-[#66666f]">
                      {item.at.slice(0, 10)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GLOBAL MODAL 4: Compose Asset / Gerar Peça */}
      {/* ======================================================== */}
      {composeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-white/[0.15] bg-[#0c0c0e] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#ef233c]">Execução no Projeto</span>
                <h3 className="font-display text-lg font-bold text-white">Documento / Peça Gerada</h3>
              </div>
              <button onClick={() => setComposeModal(null)} className="text-[#8a8a93] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 max-h-[380px] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#050505] p-4 font-mono text-xs text-[#c4c4cc] whitespace-pre-wrap leading-relaxed">
              {composedText}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
              <span className="text-xs text-[#8a8a93]">Contexto do projeto injetado automaticamente</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(composedText);
                  addToast("Copiado para a área de transferência!", "success");
                  setComposeModal(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white hover:brightness-110"
              >
                <Copy className="h-3.5 w-3.5" />
                Copiar Documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOAST STACK (Bottom Left) */}
      {/* ======================================================== */}
      <div className="fixed bottom-5 left-4 lg:left-[272px] z-50 flex flex-col gap-2 pointer-events-none max-w-[380px]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl border border-white/[0.12] border-l-2 border-l-[#ef233c] bg-[#141416] px-4 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-in slide-in-from-bottom-2"
          >
            <span className="text-xs text-[#f7f7f8] leading-relaxed select-none">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[#777780] hover:text-white shrink-0 p-1"
              aria-label="Fechar notificação"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SistemaProvider>
      <SistemaShell>{children}</SistemaShell>
    </SistemaProvider>
  );
}
