"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useSistema } from "@/context/sistema-context";
import { rel, stamp } from "@/lib/seed-data";

export default function ClientesPage() {
  const router = useRouter();
  const {
    state,
    setNovoModalOpen,
    cycleStage,
    updateClient,
    logContact,
    scheduleClientAction,
  } = useSistema();

  const [viewMode, setViewMode] = useState<"radar" | "pipeline">("radar");
  const [selectedClientId, setSelectedClientId] = useState<string>(
    state.clients[0]?.id || "camila"
  );
  const [contactText, setContactText] = useState("");
  const [clientNotes, setClientNotes] = useState<Record<string, string>>({});

  const selectedClient =
    state.clients.find((c) => c.id === selectedClientId) || state.clients[0];

  const stageLabel = (stage: string) => {
    const map: Record<string, string> = {
      lead: "Lead",
      qualificado: "Qualificado",
      proposta: "Proposta",
      negociacao: "Negociação",
      ativo: "Cliente ativo",
      perdido: "Perdido",
    };
    return map[stage] || stage;
  };

  const stageDot = (stage: string) => {
    switch (stage) {
      case "negociacao":
      case "proposta":
        return "bg-amber-400";
      case "ativo":
        return "bg-emerald-400";
      case "perdido":
        return "bg-[#ef233c]";
      default:
        return "bg-zinc-500";
    }
  };

  const handleRegisterContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactText.trim() || !selectedClient) return;
    logContact(selectedClient.id, contactText.trim());
    setContactText("");
  };

  const handleSaveNotes = () => {
    if (!selectedClient) return;
    const note = clientNotes[selectedClient.id] ?? selectedClient.notes;
    updateClient(selectedClient.id, { notes: note });
  };

  const handleCycleStage = () => {
    if (!selectedClient) return;
    cycleStage(selectedClient.id);
  };

  const handleMarkLost = () => {
    if (!selectedClient) return;
    updateClient(selectedClient.id, { stage: "perdido" });
  };

  const linkedProject = selectedClient?.projectId
    ? state.projects.find((p) => p.id === selectedClient.projectId)
    : null;

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header (Exato como Image 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
            CRM PESSOAL
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
            Radar de Clientes
          </h1>
          <p className="mt-1 text-sm text-[#777780]">
            Relacionamentos, propostas e próxima ação em um único lugar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNovoModalOpen(true)}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,35,60,0.35)] hover:bg-[#ff3b50] transition"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Switcher & Counter (Exato como Image 4) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setViewMode("radar")}
            className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
              viewMode === "radar"
                ? "bg-white/[0.1] text-white font-bold"
                : "text-[#777780] hover:text-white"
            }`}
          >
            Radar
          </button>
          <button
            type="button"
            onClick={() => setViewMode("pipeline")}
            className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
              viewMode === "pipeline"
                ? "bg-white/[0.1] text-white font-bold"
                : "text-[#777780] hover:text-white"
            }`}
          >
            Pipeline
          </button>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#66666f]">
          {state.clients.length} RELAÇÕES
        </span>
      </div>

      {/* VIEW 1: RADAR (GRID DE CARDS + DOSSIÊ INLINE) */}
      {viewMode === "radar" && (
        <div className="space-y-6">
          {/* Cards Grid (3 colunas, exato como Image 4) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {state.clients.map((c) => {
              const isSelected = selectedClient && selectedClient.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`rounded-2xl border p-4 sm:p-5 text-left cursor-pointer transition flex flex-col justify-between min-h-[176px] ${
                    isSelected
                      ? "border-[#ef233c] bg-white/[0.03] shadow-[0_0_0_1px_rgba(239,35,60,0.3),0_0_36px_rgba(239,35,60,0.08)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#18181b] to-[#3f3f46] border border-white/[0.15] font-bold text-xs text-white">
                        {c.initials}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#a1a1aa]">
                        <span className={`h-2 w-2 rounded-full ${stageDot(c.stage)}`} />
                        <span>{stageLabel(c.stage)}</span>
                      </div>
                    </div>

                    {/* Name & Company */}
                    <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                      {c.name}
                    </h3>
                    <div className="text-xs text-[#777780] mt-0.5 truncate">{c.company}</div>
                  </div>

                  {/* Foot (com linha divisória superior) */}
                  <div className="mt-5 border-t border-white/[0.06] pt-3 flex items-end justify-between font-mono">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
                        OPORTUNIDADE
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-display">
                        R$ {c.value.toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
                        CONTATO
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-[#a1a1aa] mt-0.5">
                        {rel(c.contactAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DOSSIÊ DO CLIENTE INLINE (Exato como Image 4) */}
          {selectedClient && (
            <section className="glass rounded-2xl p-5 sm:p-6 border border-white/[0.09] space-y-5">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#66666f] font-semibold">
                  DOSSIÊ DO CLIENTE
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedClient.name}
                </h2>
                <div className="mt-1 text-xs text-[#777780]">
                  {selectedClient.company}
                  {selectedClient.email && ` · ${selectedClient.email}`}
                  {selectedClient.phone && ` · ${selectedClient.phone}`}
                </div>
              </div>

              {/* Grid 2 colunas: Potencial e Etapa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
                    Potencial
                  </span>
                  <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                    R$ {selectedClient.value.toLocaleString("pt-BR")}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
                    Etapa
                  </span>
                  <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                    {stageLabel(selectedClient.stage)}
                  </div>
                </div>
              </div>

              {/* Próxima Ação */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
                  Próxima ação
                </span>
                <p className="mt-2 text-xs text-[#a1a1aa] leading-relaxed">
                  {selectedClient.nextAction || "Nenhuma ação definida."}
                </p>
              </div>

              {/* Ações de Agenda e Projeto */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => scheduleClientAction(selectedClient.id)}
                  className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:border-white/[0.22] hover:bg-white/[0.08] transition"
                >
                  Colocar na agenda
                </button>
                {linkedProject && (
                  <button
                    type="button"
                    onClick={() => router.push(`/sistema/projetos/${linkedProject.id}`)}
                    className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:border-white/[0.22] hover:bg-white/[0.08] transition"
                  >
                    Projeto · {linkedProject.name}
                  </button>
                )}
              </div>

              {/* Timeline de Interações */}
              <div className="space-y-3 pt-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f] block">
                  Histórico de interações
                </span>
                <div className="space-y-2.5">
                  {selectedClient.timeline.map((ev, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <span className="font-mono text-[10px] text-[#66666f] shrink-0 pt-0.5">
                        {stamp(ev.at)}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-[#ef233c] shrink-0 mt-1" />
                      <span className="text-[#a1a1aa] leading-snug">{ev.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulário: Registrar Contato */}
              <form onSubmit={handleRegisterContact} className="space-y-3 pt-2">
                <label className="block text-xs font-medium text-[#777780]">
                  Registrar contato
                </label>
                <input
                  type="text"
                  value={contactText}
                  onChange={(e) => setContactText(e.target.value)}
                  placeholder="O que foi dito, e o que ficou combinado"
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.025] px-3.5 py-2.5 text-xs text-white placeholder-[#66666f] outline-none focus:border-[#ef233c] focus:ring-1 focus:ring-[#ef233c] transition"
                />
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition"
                  >
                    Registrar contato
                  </button>
                  <button
                    type="button"
                    onClick={handleCycleStage}
                    className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white hover:bg-white/[0.08] transition"
                  >
                    Avançar etapa
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkLost}
                    className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-medium text-rose-300 hover:bg-white/[0.08] transition"
                  >
                    Marcar perdido
                  </button>
                </div>
              </form>

              {/* Notas de Relação */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-medium text-[#777780]">
                  Notas de relação
                </label>
                <textarea
                  rows={3}
                  value={
                    clientNotes[selectedClient.id] !== undefined
                      ? clientNotes[selectedClient.id]
                      : selectedClient.notes || ""
                  }
                  onChange={(e) =>
                    setClientNotes((prev) => ({
                      ...prev,
                      [selectedClient.id]: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.025] p-3 text-xs text-white placeholder-[#66666f] outline-none focus:border-[#ef233c] focus:ring-1 focus:ring-[#ef233c] transition resize-y"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white hover:bg-white/[0.08] transition"
                >
                  Salvar notas
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      {/* VIEW 2: PIPELINE */}
      {viewMode === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {[
            { id: "lead", label: "Lead" },
            { id: "qualificado", label: "Qualificado" },
            { id: "proposta", label: "Proposta" },
            { id: "negociacao", label: "Negociação" },
            { id: "ativo", label: "Ativo" },
            { id: "perdido", label: "Perdido" },
          ].map((col) => {
            const list = state.clients.filter((c) => c.stage === col.id);
            const sum = list.reduce((s, c) => s + Number(c.value || 0), 0);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5 min-h-[360px]"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-3">
                  <span className="font-display text-xs font-bold text-white">{col.label}</span>
                  <span className="font-mono text-[9px] text-[#66666f]">
                    {sum > 0 ? `R$ ${Math.round(sum / 1000)}k` : list.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {list.length > 0 ? (
                    list.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setViewMode("radar");
                        }}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 cursor-pointer hover:border-[#ef233c]/50 transition group"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.08] text-[9px] font-bold text-white">
                            {c.initials}
                          </span>
                          <span className="text-xs font-bold text-white group-hover:text-[#ef233c] transition truncate">
                            {c.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#66666f] truncate">{c.company}</div>
                        <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#777780] border-t border-white/[0.05] pt-1.5">
                          <span>R$ {c.value.toLocaleString("pt-BR")}</span>
                          <span>{rel(c.contactAt)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs text-[#66666f]">—</div>
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
