"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  TrendingUp,
  CheckSquare,
  Sparkles,
  AlertTriangle,
  Check,
  Calendar,
  Clock,
  Shield,
  FileText,
  Copy,
} from "lucide-react";
import { useSistema } from "@/context/sistema-context";

export default function SalaDoProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const {
    state,
    projectById,
    clientById,
    deliveryBlockers,
    updateProject,
    toggleMilestone,
    saveProjectNote,
    toggleCritical,
    toggleTask,
    scheduleClientAction,
    daysUntil,
    setComposeModal,
    setClientDrawerId,
    setDeliveryBlockerProject,
  } = useSistema();

  const project = projectById(projectId);
  const client = project ? clientById(project.clientId) : null;

  const [notes, setNotes] = useState(project?.notes || "");
  const [progressVal, setProgressVal] = useState(project?.progress || 0);

  useEffect(() => {
    if (project) {
      setNotes(project.notes || "");
      setProgressVal(project.progress);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="p-8">
        <Link
          href="/sistema/projetos"
          className="inline-flex items-center gap-2 text-sm text-[#ef233c] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para Projetos
        </Link>
        <div className="mt-8 rounded-2xl border border-white/[0.09] bg-white/[0.02] p-12 text-center text-[#8a8a93]">
          Projeto não encontrado no cockpit operacional.
        </div>
      </div>
    );
  }

  const tasks = state.tasks.filter((t) => t.projectId === project.id);
  const blockers = deliveryBlockers(project.id);
  const hasBlockers = blockers.milestones.length > 0 || blockers.tasks.length > 0 || blockers.balance > 0;
  const leftDays = daysUntil(project.deadline);
  const doneMilestones = project.milestones.filter((m) => m.done).length;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgressVal(val);
    updateProject(project.id, { progress: val });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as any;
    updateProject(project.id, { status: newStatus });
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProject(project.id, { deadline: e.target.value });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Back Nav */}
      <div>
        <Link
          href="/sistema/projetos"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ef233c] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Operações
        </Link>
      </div>

      {/* Main Header */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ef233c]">
          Sala do Projeto
        </div>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
          {project.name}
        </h1>
        <p className="mt-1 text-sm text-[#8a8a93]">
          {client ? `${client.company} • ${client.name}` : "Sem cliente vinculado"}
        </p>
      </div>

      {/* 4 KPIs Top Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* KPI 1: Valor */}
        <div className="glass rounded-xl p-4 transition">
          <div className="flex items-center justify-between text-[#8a8a93]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Valor</span>
            <CreditCard className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2 font-display text-xl font-extrabold sm:text-2xl text-white">
            R$ {project.value.toLocaleString("pt-BR")}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#66666f]">contrato</div>
        </div>

        {/* KPI 2: Recebido */}
        <div className="glass rounded-xl p-4 transition">
          <div className="flex items-center justify-between text-[#8a8a93]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Recebido</span>
            <TrendingUp className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2 font-display text-xl font-extrabold sm:text-2xl text-white">
            R$ {project.paid.toLocaleString("pt-BR")}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#8a8a93]">
            saldo R$ {(project.value - project.paid).toLocaleString("pt-BR")}
          </div>
        </div>

        {/* KPI 3: Marco */}
        <div className="glass rounded-xl p-4 transition">
          <div className="flex items-center justify-between text-[#8a8a93]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Marco</span>
            <CheckSquare className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2 font-display text-xl font-extrabold sm:text-2xl text-white">
            {doneMilestones}/{project.milestones.length}
          </div>
          <div className="mt-1 truncate font-mono text-[11px] text-[#8a8a93]">
            {project.milestone}
          </div>
        </div>

        {/* KPI 4: Prazo */}
        <div className="glass rounded-xl p-4 transition">
          <div className="flex items-center justify-between text-[#8a8a93]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Prazo</span>
            <Sparkles className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2 font-display text-xl font-extrabold sm:text-2xl text-white">
            {project.deadline.split("-")[2]}/
            {project.deadline.split("-")[1]}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#ef233c]">
            {leftDays === null
              ? "—"
              : leftDays < 0
              ? `${Math.abs(leftDays)} dias atrasado`
              : leftDays === 0
              ? "hoje"
              : `em ${leftDays} dias`}
          </div>
        </div>
      </div>

      {/* Trava de entrega alert banner */}
      {project.status !== "entregue" && hasBlockers && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-[#ef233c]/30 bg-[#ef233c]/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#ef233c] shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#ef233c]">
                Trava de entrega ativa
              </div>
              <p className="mt-0.5 text-xs text-[#a1a1aa]">
                {blockers.milestones.length > 0 && `${blockers.milestones.length} marcos pendentes. `}
                {blockers.tasks.length > 0 && `${blockers.tasks.length} tarefas em aberto. `}
                {blockers.balance > 0 && `Saldo a receber de R$ ${blockers.balance.toLocaleString("pt-BR")}.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDeliveryBlockerProject(project)}
            className="shrink-0 rounded-lg bg-[#ef233c]/20 px-3 py-1.5 text-xs font-semibold text-[#ef233c] hover:bg-[#ef233c] hover:text-white transition"
          >
            Ver o que impede entregar
          </button>
        </div>
      )}

      {/* Main Two Columns Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Direção (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-white/[0.09] pb-4">
              <h2 className="font-display text-lg font-bold text-white">Direção</h2>
              {project.critical && (
                <span className="rounded bg-[#ef233c] px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase text-white shadow-[0_0_12px_rgba(239,35,60,0.5)]">
                  Crítico
                </span>
              )}
            </div>

            {/* Status & Prazo row */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8a93]">
                  Status
                </label>
                <select
                  value={project.status}
                  onChange={handleStatusChange}
                  className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[#0c0c0e] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                >
                  <option value="descoberta">Descoberta</option>
                  <option value="producao">Produção</option>
                  <option value="revisao">Revisão</option>
                  <option value="entregue">Entregue</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8a93]">
                  Prazo
                </label>
                <input
                  type="date"
                  value={project.deadline}
                  onChange={handleDeadlineChange}
                  className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[#0c0c0e] px-3.5 py-2 text-sm text-white focus:border-[#ef233c] focus:outline-none"
                />
              </div>
            </div>

            {/* Slider de Progresso */}
            <div className="mt-5">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#8a8a93]">
                <span>Progresso</span>
                <span className="font-bold text-white">{progressVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={handleProgressChange}
                className="mt-2 w-full accent-[#ef233c] cursor-pointer"
              />
            </div>

            {/* Brief */}
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#ef233c]">
                Brief
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#c4c4cc]">
                {project.brief || "Sem brief cadastrado ainda."}
              </p>
            </div>

            {/* Marcos Checklist */}
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#ef233c]">
                Marcos
              </div>
              <div className="mt-3 space-y-2">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(project.id, m.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      m.done
                        ? "border-emerald-500/20 bg-emerald-500/[0.03] text-[#71717a]"
                        : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.15] text-[#f7f7f8]"
                    }`}
                  >
                    <button
                      type="button"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        m.done
                          ? "border-emerald-500 bg-emerald-500 text-black"
                          : "border-white/[0.2] hover:border-[#ef233c]"
                      }`}
                    >
                      {m.done && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>
                    <span className={`text-sm ${m.done ? "line-through text-[#66666f]" : ""}`}>
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota de Produção */}
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8a93]">
                Nota de Produção
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Insira detalhes de produção, acordos e notas de entrega..."
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/[0.12] bg-[#0c0c0e] p-3 text-sm text-white focus:border-[#ef233c] focus:outline-none"
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => saveProjectNote(project.id, notes)}
                  className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition"
                >
                  Salvar nota
                </button>
                <button
                  type="button"
                  onClick={() => toggleCritical(project.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    project.critical
                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                      : "border border-[#ef233c]/30 bg-[#ef233c]/10 text-[#ef233c] hover:bg-[#ef233c]/20"
                  }`}
                >
                  {project.critical ? "Tirar crítico" : "Marcar crítico"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execução & Próxima Ação (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Execução */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white border-b border-white/[0.09] pb-4">
              Execução
            </h2>

            <div className="mt-4 space-y-2">
              {tasks.length ? (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                      t.done
                        ? "border-emerald-500/20 bg-emerald-500/[0.03] text-[#71717a]"
                        : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.15] text-[#f7f7f8]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                          t.done
                            ? "border-emerald-500 bg-emerald-500 text-black"
                            : "border-white/[0.2] hover:border-[#ef233c]"
                        }`}
                      >
                        {t.done && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                      <div>
                        <div className={`text-sm ${t.done ? "line-through text-[#66666f]" : "font-medium text-white"}`}>
                          {t.title}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-[#66666f]">
                          <span>{t.tag}</span>
                          <span
                            className={
                              t.priority === "critica"
                                ? "text-[#ef233c] font-bold"
                                : t.priority === "alta"
                                ? "text-amber-400"
                                : "text-[#71717a]"
                            }
                          >
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#8a8a93]">{t.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8a8a93]">Nenhuma tarefa neste projeto.</p>
              )}
            </div>

            {/* Quick Actions for this Project */}
            <div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setComposeModal({ assetId: "proposta", projectId: project.id })}
                className="flex items-center gap-2 rounded-xl bg-[#ef233c] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:brightness-110 transition"
              >
                <FileText className="h-3.5 w-3.5" />
                Gerar proposta
              </button>

              <button
                type="button"
                onClick={() => setComposeModal({ assetId: "vsl", projectId: project.id })}
                className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white hover:bg-white/[0.08] transition"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Gerar peça
              </button>

              {client && (
                <button
                  type="button"
                  onClick={() => setClientDrawerId(client.id)}
                  className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white hover:bg-white/[0.08] transition"
                >
                  Dossiê de {client.name.split(" ")[0]}
                </button>
              )}
            </div>
          </div>

          {/* Próxima Ação do Cliente */}
          {client && (
            <div className="glass rounded-2xl p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#ef233c]">
                Próxima ação do cliente
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#c4c4cc]">
                {client.nextAction || "Definir próxima conversa estratégica."}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3 text-xs text-[#8a8a93]">
                <span>Último contato recente</span>
                <button
                  type="button"
                  onClick={() => scheduleClientAction(client.id)}
                  className="rounded-lg bg-[#ef233c]/15 px-3 py-1.5 text-xs font-semibold text-[#ef233c] hover:bg-[#ef233c] hover:text-white transition"
                >
                  Colocar na agenda
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
