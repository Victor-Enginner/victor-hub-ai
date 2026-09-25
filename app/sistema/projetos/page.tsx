"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useSistema } from "@/context/sistema-context";
import { shortDate } from "@/lib/seed-data";

export default function ProjetosPage() {
  const router = useRouter();
  const { state, kpis, clientById, daysUntil, setNovoModalOpen, updateProject } = useSistema();

  const [viewMode, setViewMode] = useState<"tabela" | "quadro">("tabela");
  const [filter, setFilter] = useState<"todos" | "descoberta" | "producao" | "revisao" | "entregue">("todos");

  const filteredProjects = state.projects.filter((p) => {
    if (filter === "todos") return true;
    return p.status === filter;
  });

  const activeCount = state.projects.filter((p) => p.status !== "entregue").length;

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      descoberta: "Descoberta",
      producao: "Produção",
      revisao: "Revisão",
      entregue: "Entregue",
    };
    return map[s] || s;
  };

  const statusDot = (s: string) => {
    switch (s) {
      case "producao":
        return "bg-amber-400";
      case "revisao":
      case "entregue":
        return "bg-emerald-400";
      default:
        return "bg-zinc-500";
    }
  };

  const advanceProject = (e: React.MouseEvent, id: string, currentStatus: string) => {
    e.stopPropagation();
    const next: Record<string, "descoberta" | "producao" | "revisao" | "entregue"> = {
      descoberta: "producao",
      producao: "revisao",
      revisao: "entregue",
      entregue: "entregue",
    };
    updateProject(id, { status: next[currentStatus] || "producao" });
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
            OPERAÇÕES
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
            Operações de Projetos
          </h1>
          <p className="mt-1 text-sm text-[#777780]">
            {activeCount} projetos · R$ {kpis.pipeline.toLocaleString("pt-BR")} em pipeline
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNovoModalOpen(true)}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,35,60,0.35)] hover:bg-[#ff3b50] transition"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Row Between: Switcher & Filters (Exato como Image 3) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Switcher Tabela / Quadro */}
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setViewMode("tabela")}
            className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
              viewMode === "tabela"
                ? "bg-white/[0.1] text-white font-bold"
                : "text-[#777780] hover:text-white"
            }`}
          >
            Tabela
          </button>
          <button
            type="button"
            onClick={() => setViewMode("quadro")}
            className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
              viewMode === "quadro"
                ? "bg-white/[0.1] text-white font-bold"
                : "text-[#777780] hover:text-white"
            }`}
          >
            Quadro
          </button>
        </div>

        {/* Filters Tabs */}
        {viewMode === "tabela" ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "todos", label: "Todos" },
              { id: "descoberta", label: "Descoberta" },
              { id: "producao", label: "Produção" },
              { id: "revisao", label: "Revisão" },
              { id: "entregue", label: "Entregue" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filter === tab.id
                    ? "bg-white/[0.09] text-white"
                    : "text-[#777780] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
            O clique abre a sala
          </span>
        )}
      </div>

      {/* VIEW 1: TABELA (Exato como Image 3) */}
      {viewMode === "tabela" && (
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.09]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[760px]">
              <thead className="border-b border-white/[0.06] font-mono text-[10px] uppercase tracking-[0.12em] text-[#66666f] font-medium">
                <tr>
                  <th className="px-5 py-3.5">PROJETO & CLIENTE</th>
                  <th className="px-4 py-3.5">STATUS</th>
                  <th className="px-4 py-3.5">PROGRESSO</th>
                  <th className="px-4 py-3.5">VALOR</th>
                  <th className="px-5 py-3.5">PRÓXIMO MARCO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => {
                    const client = clientById(p.clientId);
                    const left = daysUntil(p.deadline);
                    const isLate = left !== null && left < 0 && p.status !== "entregue";

                    return (
                      <tr
                        key={p.id}
                        onClick={() => router.push(`/sistema/projetos/${p.id}`)}
                        className="cursor-pointer hover:bg-white/[0.025] transition group"
                      >
                        {/* PROJETO & CLIENTE */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] font-bold text-xs text-white">
                              {p.letter}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 font-semibold text-white group-hover:text-[#ef233c] transition">
                                <span>{p.name}</span>
                                {p.critical && (
                                  <span className="rounded bg-[#ef233c] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                                    CRÍTICO
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 text-xs text-[#66666f]">
                                {client ? client.company : "Sem cliente"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 text-xs text-[#a1a1aa]">
                            <span className={`h-2 w-2 rounded-full shrink-0 ${statusDot(p.status)}`} />
                            <span>{statusLabel(p.status)}</span>
                          </div>
                        </td>

                        {/* PROGRESSO (Linha fina vermelha com % ao lado) */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5 w-[140px]">
                            <div className="h-1 flex-1 rounded-full bg-white/[0.09] overflow-hidden">
                              <div
                                className="h-full bg-[#ef233c] rounded-full transition-all"
                                style={{ width: `${p.progress}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-[#a1a1aa] font-medium shrink-0">
                              {p.progress}%
                            </span>
                          </div>
                        </td>

                        {/* VALOR */}
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-white tabular-nums">
                          R$ {p.value.toLocaleString("pt-BR")}
                        </td>

                        {/* PRÓXIMO MARCO */}
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-white">{p.milestone}</div>
                          <div className="text-xs text-[#66666f] mt-0.5">
                            {isLate
                              ? `Atrasado · ${shortDate(p.deadline)}`
                              : "Próxima entrega"}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#777780]">
                      Nenhum projeto neste estágio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: QUADRO (Kanban) */}
      {viewMode === "quadro" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: "descoberta", label: "Descoberta" },
            { id: "producao", label: "Produção" },
            { id: "revisao", label: "Revisão" },
            { id: "entregue", label: "Entregue" },
          ].map((col) => {
            const list = state.projects.filter((p) => p.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 min-h-[360px]"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
                  <span className="font-display text-sm font-bold text-white">{col.label}</span>
                  <span className="font-mono text-[10px] text-[#66666f]">{list.length}</span>
                </div>

                <div className="space-y-3 flex-1">
                  {list.length > 0 ? (
                    list.map((p) => {
                      const client = clientById(p.clientId);
                      return (
                        <div
                          key={p.id}
                          onClick={() => router.push(`/sistema/projetos/${p.id}`)}
                          className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5 cursor-pointer hover:border-[#ef233c]/50 transition group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.08] text-xs font-bold text-white">
                              {p.letter}
                            </span>
                            {p.critical ? (
                              <span className="rounded bg-[#ef233c] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase">
                                CRÍTICO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-[#a1a1aa]">
                                <span className={`h-1.5 w-1.5 rounded-full ${statusDot(p.status)}`} />
                                <span>{statusLabel(p.status)}</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-semibold text-white group-hover:text-[#ef233c] transition truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs text-[#66666f] truncate mt-0.5">
                            {client ? client.company : "Sem cliente"}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
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

                          <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-[#777780] border-t border-white/[0.05] pt-2">
                            <span>R$ {p.value.toLocaleString("pt-BR")}</span>
                            <span>{p.milestone}</span>
                          </div>

                          {col.id !== "entregue" && (
                            <button
                              type="button"
                              onClick={(e) => advanceProject(e, p.id, p.status)}
                              className="mt-2 text-xs font-medium text-[#ef233c] hover:underline"
                            >
                              Avançar estágio →
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-xs text-[#66666f]">Vazio</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
