"use client";

import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useSistema } from "@/context/sistema-context";
import { todayISO, shortDate, weekday } from "@/lib/seed-data";

export default function TarefasPage() {
  const {
    state,
    toggleTask,
    rescheduleTask,
    setNovoModalOpen,
  } = useSistema();

  const today = todayISO();
  const todaysTasks = state.tasks.filter((t) => t.date === today);
  const doneCount = todaysTasks.filter((t) => t.done).length;
  const pendingCount = todaysTasks.length - doneCount;
  const pct = todaysTasks.length
    ? Math.round((doneCount / todaysTasks.length) * 100)
    : 0;

  const lateTasks = state.tasks
    .filter((t) => !t.done && t.date < today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const laterTasks = state.tasks
    .filter((t) => t.date > today && !t.done)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const groups: Record<string, typeof state.tasks> = {};
  laterTasks.forEach((t) => {
    (groups[t.date] = groups[t.date] || []).push(t);
  });

  const blocks = [
    { id: "manha", title: "Bloco da Manhã · Foco profundo" },
    { id: "tarde", title: "Bloco da Tarde · Execução e reuniões" },
    { id: "noite", title: "Bloco da Noite · Fechamento" },
  ];

  const prioClass = (p: string) => {
    switch (p) {
      case "critica":
      case "crítica":
        return "bg-[#ef233c]";
      case "alta":
        return "bg-amber-400";
      case "media":
      case "média":
        return "bg-[#3f3f46]";
      default:
        return "bg-[#52525c]";
    }
  };

  const renderTaskRow = (t: typeof state.tasks[0]) => (
    <div
      key={t.id}
      className={`flex items-center gap-3 py-3 border-t border-white/[0.06] first:border-t-0 text-left transition ${
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

      {/* Priority Bar Indicator */}
      <span className={`h-5 w-0.5 rounded-full shrink-0 ${prioClass(t.priority)}`} />

      {/* Task Info */}
      <div className="flex-1 min-w-0">
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
  );

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header (Exato como Image 5) */}
      <div className="page-head">
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
          EXECUÇÃO
        </div>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
          Agenda de Produção
        </h1>
        <p className="mt-1 text-sm text-[#777780]">
          {pendingCount} pendentes · {doneCount} concluídas · foco por bloco de energia
        </p>

        {/* Energy Bar */}
        <div className="mt-4 h-[3px] w-full rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7f1020] to-[#ef233c] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Escorregou do dia (se houver tarefas atrasadas) */}
      {lateTasks.length > 0 && (
        <section className="glass rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
            <h2 className="font-display text-sm font-bold text-white tracking-tight">
              Escorregou do dia
            </h2>
            <span className="font-mono text-[10px] text-[#ef233c] font-bold">
              {lateTasks.length}
            </span>
          </div>

          <div className="space-y-2">
            {lateTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-left"
              >
                <div>
                  <div className="text-sm font-medium text-white">{t.title}</div>
                  <div className="text-xs text-[#777780] mt-0.5">{shortDate(t.date)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => rescheduleTask(t.id, today)}
                  className="font-mono text-xs font-semibold text-[#ef233c] hover:underline"
                >
                  Puxar para hoje
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blocos de Energia (Manhã, Tarde, Noite) */}
      <div className="space-y-4">
        {blocks.map((block) => {
          const blockTasks = todaysTasks
            .filter((t) => t.block === block.id)
            .sort((a, b) => a.order - b.order || a.time.localeCompare(b.time));

          if (block.id === "noite" && blockTasks.length === 0) return null;

          return (
            <section
              key={block.id}
              className="glass rounded-2xl p-5 border border-white/[0.08]"
            >
              <h2 className="font-display text-sm font-bold text-white tracking-tight mb-3">
                {block.title}
              </h2>

              <div className="divide-y divide-white/[0.06]">
                {blockTasks.length > 0 ? (
                  blockTasks.map(renderTaskRow)
                ) : (
                  <div className="py-6 text-center text-xs text-[#777780]">Bloco livre.</div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setNovoModalOpen(true)}
                className="mt-3 block font-mono text-xs font-semibold text-[#ef233c] hover:underline"
              >
                + Tarefa neste bloco
              </button>
            </section>
          );
        })}
      </div>

      {/* Próximos dias (Exato como Image 5) */}
      {Object.keys(groups).length > 0 && (
        <section className="glass rounded-2xl p-5 border border-white/[0.08]">
          <h2 className="font-display text-sm font-bold text-white tracking-tight border-b border-white/[0.06] pb-3">
            Próximos dias
          </h2>

          <div className="mt-3 space-y-4">
            {Object.keys(groups).map((date) => (
              <div key={date}>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f] mb-2 font-semibold">
                  {weekday(date)} · {shortDate(date)}
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {groups[date].map(renderTaskRow)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
