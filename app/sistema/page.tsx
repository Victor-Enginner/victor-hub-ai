"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  CheckSquare,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  Check,
} from "lucide-react";
import { useSistema } from "@/context/sistema-context";
import { todayISO, shortDate, rel } from "@/lib/seed-data";

export default function CentralDeComandoPage() {
  const router = useRouter();
  const {
    state,
    kpis,
    daysUntil,
    clientById,
    deliveryBlockers,
    toggleTask,
    startFocus,
    setNovoModalOpen,
    runAutomation,
    setComposeModal,
  } = useSistema();

  const today = todayISO();
  const activeProjects = state.projects.filter((p) => p.status !== "entregue");

  // Next deliveries (10 days)
  const dueProjects = activeProjects
    .filter((p) => {
      const d = daysUntil(p.deadline);
      return d !== null && d <= 10;
    })
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  const lateTasks = state.tasks.filter((t) => !t.done && t.date < today);

  const lockedMovements = state.movements.filter((m) => {
    if (m.kind !== "entrada" || m.status !== "previsto") return false;
    const proj = state.projects.find((p) => p.id === m.projectId);
    return proj && proj.status !== "entregue";
  });
  const lockedSum = lockedMovements.reduce((sum, m) => sum + Number(m.amount || 0), 0);

  // Sorting today tasks by priority rank
  const todayTasks = [...state.tasks.filter((t) => t.date === today)].sort((a, b) => {
    const rank: Record<string, number> = {
      "t-proposta": 1,
      "t-copy": 2,
      "t-stripe": 3,
      "t-hero": 4,
    };
    return (rank[a.id] || 20) - (rank[b.id] || 20) || a.time.localeCompare(b.time);
  });

  // Next move (AGORA card logic)
  const critTask = todayTasks.find((t) => !t.done && t.priority === "critica") ||
    state.tasks.find((t) => !t.done && t.priority === "critica");
  const stripeAuto = state.automations.find((a) => a.status === "atencao");
  
  const agoraMove = critTask
    ? {
        kicker: "AGORA · CRÍTICO",
        title: critTask.title,
        why: critTask.detail || "Transações aprovadas não disparam notificação no canal #financeiro desde ontem 22h.",
        time: critTask.time || "12:00",
        taskId: critTask.id,
        projectId: critTask.projectId,
      }
    : stripeAuto
    ? {
        kicker: "AGORA · AUTOMAÇÃO",
        title: stripeAuto.name,
        why: stripeAuto.error || "Um fluxo parou de avisar.",
        time: "Hoje",
        taskId: null,
        projectId: null,
      }
    : {
        kicker: "AGORA",
        title: "O dia está limpo",
        why: "Nada crítico na fila. O radar segue aberto.",
        time: "—",
        taskId: null,
        projectId: null,
      };

  // Funnel calculations
  const f = state.funnel;
  const maxF = Math.max(f.qualificados, f.propostas, f.negociacoes, f.fechamentos, 1);
  const barW = (n: number) => Math.round((n / maxF) * 100);

  const sub =
    kpis.pending === 0 && kpis.tasks > 0
      ? "O foco de hoje está limpo. O radar continua aberto no que ainda pede atenção."
      : `Bom trabalho, ${state.profile.name}. Seu sistema já organizou o que pede atenção agora.`;

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="page-head">
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
          COMMAND CENTER
        </div>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
          Central de Comando
        </h1>
        <p className="mt-1 text-sm text-[#777780]">{sub}</p>
      </div>

      {/* 4 KPIs Principais */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5">
        {/* KPI 1 */}
        <div className="glass rounded-2xl p-4 sm:p-5 transition hover:border-white/[0.18]">
          <div className="flex items-center justify-between text-[#777780]">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              Projetos ativos
            </span>
            <Briefcase className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-3.5 font-display text-2xl font-extrabold sm:text-3xl text-white">
            {kpis.active}
          </div>
          <div className="mt-2 text-xs text-[#777780]">
            <span className="text-[#ef233c] font-medium">{kpis.critical}</span> em fase crítica
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass rounded-2xl p-4 sm:p-5 transition hover:border-white/[0.18]">
          <div className="flex items-center justify-between text-[#777780]">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              Tarefas de hoje
            </span>
            <CheckSquare className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-3.5 font-display text-2xl font-extrabold sm:text-3xl text-white">
            {kpis.tasks}
          </div>
          <div className="mt-2 text-xs text-[#777780]">
            <span className="text-emerald-400 font-medium">{kpis.done}</span> concluídas
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass rounded-2xl p-4 sm:p-5 transition hover:border-white/[0.18]">
          <div className="flex items-center justify-between text-[#777780]">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              Pipeline
            </span>
            <TrendingUp className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-3.5 font-display text-2xl font-extrabold sm:text-3xl text-white">
            R$ {kpis.pipeline.toLocaleString("pt-BR")}
          </div>
          <div className="mt-2 text-xs text-[#777780]">oportunidade total</div>
        </div>

        {/* KPI 4 */}
        <div className="glass rounded-2xl p-4 sm:p-5 transition hover:border-white/[0.18]">
          <div className="flex items-center justify-between text-[#777780]">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              Recebido no mês
            </span>
            <DollarSign className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-3.5 font-display text-2xl font-extrabold sm:text-3xl text-white">
            R$ {kpis.received.toLocaleString("pt-BR")}
          </div>
          <div className="mt-2 text-xs text-[#777780]">fluxo confirmado</div>
        </div>
      </div>

      {/* Cartão AGORA (Exato como Image 1) */}
      <section className="relative overflow-hidden rounded-2xl border border-[#ef233c]/40 bg-gradient-to-r from-[#ef233c]/15 via-[#0e0a0b] to-[#0c0c0e] p-5 sm:p-6 shadow-[0_0_48px_rgba(239,35,60,0.12)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#ef233c]">
              {agoraMove.kicker}
            </div>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              {agoraMove.title}
            </h2>
            <p className="mt-1.5 text-xs text-[#a1a1aa] max-w-2xl leading-relaxed">
              {agoraMove.why}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (agoraMove.projectId) {
                    router.push(`/sistema/projetos/${agoraMove.projectId}`);
                  } else {
                    router.push("/sistema/tarefas");
                  }
                }}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-[#ef233c] px-4 text-xs font-semibold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition"
              >
                Abrir
              </button>
              {agoraMove.taskId && (
                <button
                  type="button"
                  onClick={() => startFocus(agoraMove.taskId!, agoraMove.title)}
                  className="inline-flex h-9 items-center gap-1.5 justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 text-xs font-medium text-white hover:border-white/[0.22] hover:bg-white/[0.08] transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#ef233c]" />
                  <span>Focar 25 min</span>
                </button>
              )}
            </div>
          </div>

          <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.08]">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              Janela
            </div>
            <div className="font-mono text-xs sm:text-sm font-semibold text-white mt-0.5">
              {agoraMove.time}
            </div>
          </div>
        </div>
      </section>

      {/* Próximas entregas (10 dias) (Exato como Image 1) */}
      <section className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h2 className="font-display text-sm font-bold text-white tracking-tight">
            Próximas entregas
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
            10 dias
          </span>
        </div>

        {/* 3 mini cards de risco */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/[0.07] bg-black/30 p-3.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              No prazo
            </span>
            <div className="mt-1 font-display text-2xl font-bold text-white">
              {dueProjects.length}
            </div>
            <span className="text-[11px] text-[#777780]">
              projeto{dueProjects.length === 1 ? "" : "s"} com marco nesta janela
            </span>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-black/30 p-3.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              Agenda atrasada
            </span>
            <div className="mt-1 font-display text-2xl font-bold text-white">
              {lateTasks.length}
            </div>
            <span className="text-[11px] text-[#777780]">
              {lateTasks.length ? "puxar para hoje na agenda" : "nada escorregou do dia"}
            </span>
          </div>

          <Link
            href="/sistema/financeiro"
            className="rounded-xl border border-white/[0.07] bg-black/30 p-3.5 hover:border-[#ef233c]/40 transition group"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
              Caixa preso
            </span>
            <div className="mt-1 font-display text-2xl font-bold text-white group-hover:text-[#ef233c] transition">
              R$ {lockedSum.toLocaleString("pt-BR")}
            </div>
            <span className="text-[11px] text-[#777780]">previsto em projeto ainda aberto</span>
          </Link>
        </div>

        {/* Lista de Entregas com contagem de travas (Exato como Image 1) */}
        {dueProjects.length > 0 ? (
          <div className="mt-4 space-y-2">
            {dueProjects.map((p) => {
              const left = daysUntil(p.deadline);
              const when =
                left === null
                  ? ""
                  : left < 0
                  ? "atrasado"
                  : left === 0
                  ? "hoje"
                  : `em ${left} dia${left === 1 ? "" : "s"}`;
              const blockers = deliveryBlockers(p.id);
              const travasCount =
                blockers.milestones.length +
                blockers.tasks.length +
                (blockers.balance > 0 ? 1 : 0);

              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/sistema/projetos/${p.id}`)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 cursor-pointer hover:border-[#ef233c]/50 transition group"
                >
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#ef233c] transition">
                      {p.name}
                    </div>
                    <div className="text-xs text-[#777780]">
                      {p.milestone}
                      {travasCount > 0 && ` • ${travasCount} trava${travasCount === 1 ? "" : "s"}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-[#a1a1aa]">
                      {shortDate(p.deadline)} · {when}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-xs text-[#777780]">Nenhuma entrega nesta janela.</p>
        )}
      </section>

      {/* Foco de hoje (Exato como Image 2) */}
      <section className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h2 className="font-display text-sm font-bold text-white tracking-tight">
            Foco de hoje
          </h2>
          <Link
            href="/sistema/tarefas"
            className="flex items-center gap-1 font-mono text-xs text-[#ef233c] hover:underline"
          >
            Abrir agenda →
          </Link>
        </div>

        <div className="mt-3 divide-y divide-white/[0.06]">
          {todayTasks.length > 0 ? (
            todayTasks.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-3 py-3 text-left transition ${
                  t.done ? "opacity-50" : ""
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(t.id)}
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                    t.done
                      ? "border-[#ef233c] bg-[#ef233c] text-white"
                      : "border-white/[0.22] hover:border-[#ef233c]"
                  }`}
                  aria-label="Concluir tarefa"
                >
                  {t.done && <Check className="h-3 w-3 stroke-[3]" />}
                </button>

                {/* Priority vertical bar indicator */}
                <span
                  className={`h-5 w-0.5 rounded-full shrink-0 ${
                    t.priority === "critica"
                      ? "bg-[#ef233c]"
                      : t.priority === "alta"
                      ? "bg-amber-400"
                      : "bg-[#3f3f46]"
                  }`}
                />

                {/* Task Details */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => router.push("/sistema/tarefas")}
                >
                  <div
                    className={`text-sm font-medium truncate ${
                      t.done ? "line-through text-[#777780]" : "text-white"
                    }`}
                  >
                    {t.title}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-[#777780]">
                      {t.tag}
                    </span>
                    <span
                      className={`text-[10px] ${
                        t.priority === "critica"
                          ? "text-[#ef233c] font-semibold"
                          : t.priority === "alta"
                          ? "text-amber-400"
                          : "text-[#777780]"
                      }`}
                    >
                      {t.priority === "critica" ? "crítica" : t.priority}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <span className="font-mono text-xs text-[#a1a1aa] shrink-0">{t.time}</span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-[#777780]">Nada no bloco de hoje.</div>
          )}
        </div>
      </section>

      {/* Grid: Projetos em Movimento & Radar Comercial */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left Column (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          <section className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="font-display text-sm font-bold text-white tracking-tight">
                Projetos em movimento
              </h2>
              <Link
                href="/sistema/projetos"
                className="flex items-center gap-1 font-mono text-xs text-[#ef233c] hover:underline"
              >
                Todos os projetos →
              </Link>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {activeProjects.map((p) => {
                const client = clientById(p.clientId);
                return (
                  <Link
                    key={p.id}
                    href={`/sistema/projetos/${p.id}`}
                    className="flex flex-col justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 hover:border-[#ef233c]/50 transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] font-bold text-xs text-white">
                          {p.letter}
                        </span>
                        <span
                          className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                            p.status === "producao"
                              ? "text-amber-400 bg-amber-400/10"
                              : p.status === "revisao"
                              ? "text-emerald-400 bg-emerald-400/10"
                              : "text-zinc-400 bg-zinc-400/10"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.status === "producao"
                                ? "bg-amber-400"
                                : p.status === "revisao"
                                ? "bg-emerald-400"
                                : "bg-zinc-400"
                            }`}
                          />
                          {p.status}
                        </span>
                      </div>
                      <h4 className="mt-3 text-sm font-semibold text-white group-hover:text-[#ef233c] transition truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#777780] truncate mt-0.5">
                        {client ? client.company : "Sem cliente"}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full bg-white/[0.08] overflow-hidden">
                          <div
                            className="h-full bg-[#ef233c] rounded-full transition-all"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-[#a1a1aa] font-medium">
                          {p.progress}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#777780]">
                        <span className="truncate">{p.milestone}</span>
                        <span>{shortDate(p.deadline)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Automações ao vivo */}
          <section className="glass rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-sm font-bold text-white tracking-tight border-b border-white/[0.08] pb-3">
              Automações ao vivo
            </h2>

            <div className="mt-3 divide-y divide-white/[0.06]">
              {state.automations.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        a.status === "ativa"
                          ? "bg-emerald-400 shadow-[0_0_6px_#4ade80]"
                          : a.status === "atencao"
                          ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                          : "bg-zinc-600"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{a.name}</div>
                      <div className="font-mono text-xs text-[#777780]">
                        {a.platform} · {a.runs} execuções
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => runAutomation(a.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-white hover:bg-[#ef233c] hover:border-[#ef233c] transition"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Disparar</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (5 cols) */}
        <div className="space-y-5 lg:col-span-5">
          {/* Radar Comercial */}
          <section className="glass rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-sm font-bold text-white tracking-tight border-b border-white/[0.08] pb-3">
              Radar comercial
            </h2>

            <div className="mt-4 space-y-3.5">
              {[
                { label: "Leads qualificados", count: f.qualificados },
                { label: "Propostas enviadas", count: f.propostas },
                { label: "Negociações", count: f.negociacoes },
                { label: "Fechamentos", count: f.fechamentos },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a1a1aa]">{item.label}</span>
                    <span className="font-mono font-medium text-[#f7f7f8]">
                      {String(item.count).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7f1020] to-[#ef233c] transition-all"
                      style={{ width: `${barW(item.count)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#ef233c]/25 bg-[#ef233c]/[0.08] p-4 text-center">
              <span className="font-mono text-[9px] uppercase text-[#ef233c] tracking-[0.22em] font-semibold">
                Potencial imediato
              </span>
              <div className="mt-1 font-display text-2xl font-extrabold text-white">
                R$ {kpis.pipeline.toLocaleString("pt-BR")}
              </div>
            </div>
          </section>

          {/* Arsenal: acesso rápido */}
          <section className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="font-display text-sm font-bold text-white tracking-tight">
                Arsenal: acesso rápido
              </h2>
              <Link
                href="/sistema/arsenal"
                className="flex items-center gap-1 font-mono text-xs text-[#ef233c] hover:underline"
              >
                Abrir biblioteca →
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {state.arsenal.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  onClick={() => setComposeModal({ assetId: a.id })}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 cursor-pointer hover:border-[#ef233c]/50 transition group"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ef233c]/10 text-[#ef233c]">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono text-[9px] text-[#777780] uppercase">
                      {a.type}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white group-hover:text-[#ef233c] transition truncate">
                    {a.name}
                  </div>
                  <span className="mt-0.5 block font-mono text-[10px] text-[#66666f]">
                    {a.uses} usos
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Pulso da operação */}
          <section className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="font-display text-sm font-bold text-white tracking-tight">
                Pulso da operação
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
                ao vivo
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {state.activity.slice(0, 4).map((act, idx) => (
                <div key={idx} className="flex items-baseline gap-2.5 text-xs">
                  <span className="font-mono text-[10px] text-[#66666f] shrink-0">
                    {rel(act.at)}
                  </span>
                  <span className="text-[#a1a1aa] leading-snug">{act.text}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
