"use client";

import React, { useState } from "react";
import {
  Zap,
  Box,
  Database,
  FileText,
  Filter,
  Users,
  CreditCard,
  ShieldAlert,
  MessageSquare,
  Play,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useSistema } from "@/context/sistema-context";
import { Automation, AutomationNode } from "@/lib/types";

export default function AutomacoesPage() {
  const { state, runAutomation, addToast } = useSistema();

  const [selectedId, setSelectedId] = useState<string>(
    state.automations[0]?.id || "backup"
  );

  const [fixesChecked, setFixesChecked] = useState<Record<string, boolean>>({
    secret: false,
    tolerance: false,
    channel: false,
  });

  const selectedAuto: Automation =
    state.automations.find((a) => a.id === selectedId) || state.automations[0];

  const operatingCount = state.automations.filter(
    (a) => a.status === "ativa"
  ).length;

  const whenRun = (iso: string) => {
    if (!iso) return "—";
    if (
      iso.includes("hoje") ||
      iso.includes("ontem") ||
      iso.includes("min") ||
      iso.includes("dias")
    ) {
      return iso;
    }
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMinutes < 60) return `há ${Math.max(1, diffMinutes)} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `há ${diffHours}h`;
    const hm = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
    if (hm === "03:00") return "hoje, 03:00";
    return `há ${Math.floor(diffHours / 24)} dias`;
  };

  const stamp = (iso: string) => {
    if (!iso) return "—";
    if (iso.includes("·") || iso.includes("de set")) return iso;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const day = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "short",
    })
      .format(d)
      .replace(".", "");
    const hm = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
    return `${day} · ${hm}`;
  };

  const renderNodeIcon = (iconName?: string) => {
    switch (iconName) {
      case "bolt":
        return <Zap className="h-[18px] w-[18px]" />;
      case "box":
        return <Box className="h-[18px] w-[18px]" />;
      case "db":
        return <Database className="h-[18px] w-[18px]" />;
      case "form":
        return <FileText className="h-[18px] w-[18px]" />;
      case "filter":
        return <Filter className="h-[18px] w-[18px]" />;
      case "users":
        return <Users className="h-[18px] w-[18px]" />;
      case "card":
        return <CreditCard className="h-[18px] w-[18px]" />;
      case "shield":
        return <ShieldAlert className="h-[18px] w-[18px]" />;
      case "chat":
        return <MessageSquare className="h-[18px] w-[18px]" />;
      default:
        return <Zap className="h-[18px] w-[18px]" />;
    }
  };

  const handleExecute = (id: string) => {
    runAutomation(id);
    addToast(
      `Disparo manual executado com sucesso para "${selectedAuto.name}".`,
      "success"
    );
  };

  const handleResolve = () => {
    if (!fixesChecked.secret || !fixesChecked.tolerance || !fixesChecked.channel) {
      addToast(
        "Marque todos os 3 itens do runbook para registrar a correção.",
        "warn"
      );
      return;
    }
    selectedAuto.status = "ativa";
    selectedAuto.fixes = null;
    selectedAuto.error = undefined;
    addToast(
      "Correção do webhook registrada com sucesso! Fluxo operando em 100%.",
      "success"
    );
  };

  // Extract nodes normalized
  const normalizedNodes: { label: string; icon?: string; warn?: boolean }[] = (
    selectedAuto.nodes || []
  ).map((n) => {
    if (typeof n === "string") {
      let icon = "bolt";
      const l = n.toLowerCase();
      if (l.includes("github") || l.includes("snapshot") || l.includes("box")) icon = "box";
      if (l.includes("hub") || l.includes("db") || l.includes("banco")) icon = "db";
      if (l.includes("form")) icon = "form";
      if (l.includes("qualif") || l.includes("filter")) icon = "filter";
      if (l.includes("crm") || l.includes("user")) icon = "users";
      if (l.includes("stripe") || l.includes("card") || l.includes("pagament")) icon = "card";
      if (l.includes("valid") || l.includes("assinat") || l.includes("shield")) icon = "shield";
      if (l.includes("discord") || l.includes("chat") || l.includes("whats")) icon = "chat";
      return { label: n, icon, warn: l.includes("assinat") || l.includes("drift") };
    }
    return n;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1240px] mx-auto">
      {/* Header Principal (Exato: AUTOMATION GRID / Workspace de Automação) */}
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
          AUTOMATION GRID
        </div>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
          Workspace de Automação
        </h1>
        <p className="mt-1 text-sm text-[#777780]">
          {operatingCount} workflows operando · monitoramento em tempo real
        </p>
      </div>

      {/* Painel 1: Lista de workflows (Vertical Stack, exatamente como no print de referência) */}
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-display text-[15px] font-bold text-white mb-3">
          Lista de workflows
        </h2>

        <div className="flex flex-col gap-2.5">
          {state.automations.map((item) => {
            const isSelected = item.id === selectedAuto?.id;
            const isAtencao = item.status === "atencao";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl transition cursor-pointer ${
                  isSelected
                    ? "border border-[#ef233c]/70 bg-white/[0.03] shadow-[0_0_0_1px_rgba(239,35,60,0.2),0_0_28px_rgba(239,35,60,0.06)]"
                    : "border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.14] hover:bg-white/[0.02]"
                }`}
              >
                {/* Ícone com chip de automação */}
                <div className="w-9 h-9 rounded-[10px] grid place-items-center bg-[#ef233c]/10 text-[#ef233c] shrink-0">
                  <Cpu className="h-4 w-4" />
                </div>

                {/* Nome e subtítulo */}
                <div className="flex-1 min-w-0">
                  <b className="block text-sm font-bold text-white truncate">
                    {item.name}
                  </b>
                  <span className="block text-xs text-[#777780] mt-0.5 truncate">
                    {item.platform} · {item.runs} execuções · {whenRun(item.lastRun)}
                  </span>
                </div>

                {/* Status pill no canto direito */}
                <div className="inline-flex items-center gap-1.5 text-xs text-[#e4e4e7] shrink-0 font-medium">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAtencao
                        ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                        : "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                    }`}
                  />
                  <span>{isAtencao ? "Atenção" : "Ativa"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Painel 2: Detalhes do workflow (Empilhado abaixo, exatamente como no print) */}
      {selectedAuto && (
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 space-y-6">
          <h2 className="font-display text-[15px] font-bold text-white">
            Detalhes do workflow
          </h2>

          {/* Canvas da Topologia (Nós conectados por linhas vermelhas) */}
          <div className="rounded-2xl bg-black/40 border border-white/[0.05] min-h-[148px] flex items-center justify-center pt-8 pb-12 px-6 overflow-x-auto">
            <div className="flex items-center justify-center shrink-0">
              {normalizedNodes.map((n, idx) => {
                const isWarn = n.warn || false;
                const isLast = idx === normalizedNodes.length - 1;

                return (
                  <React.Fragment key={idx}>
                    {/* Nó individual */}
                    <div
                      className={`w-12 h-12 rounded-[14px] border ${
                        isWarn
                          ? "border-amber-400/80 text-amber-400 bg-amber-400/[0.06]"
                          : "border-[#ef233c]/70 text-[#ef233c] bg-[#ef233c]/[0.06]"
                      } grid place-items-center relative shrink-0`}
                    >
                      {renderNodeIcon(n.icon)}

                      {/* Legenda embaixo do nó */}
                      <span className="absolute top-[56px] left-1/2 -translate-x-1/2 w-[110px] text-center text-[10px] text-[#777780] leading-[1.3] font-medium whitespace-normal">
                        {n.label}
                      </span>
                    </div>

                    {/* Fio conector vermelho entre os nós */}
                    {!isLast && (
                      <div className="w-16 sm:w-[72px] h-[1px] bg-[#ef233c]/55 mx-2 mb-[22px] shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Título e Resumo do Workflow */}
          <div>
            <h2 className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.03em] text-white">
              {selectedAuto.name}
            </h2>
            <p className="mt-1 text-xs sm:text-[13px] text-[#8a8a93] leading-relaxed">
              {selectedAuto.summary}
            </p>
          </div>

          {/* Linha com 4 Estatísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4 text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f] mb-1">
                Execuções
              </div>
              <b className="font-display text-xl sm:text-2xl font-bold text-white">
                {selectedAuto.runs}
              </b>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4 text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f] mb-1">
                Última run
              </div>
              <b className="font-display text-sm sm:text-base font-bold text-white">
                {whenRun(selectedAuto.lastRun)}
              </b>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4 text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f] mb-1">
                Sucesso
              </div>
              <b className="font-display text-xl sm:text-2xl font-bold text-white">
                {selectedAuto.successRate}%
              </b>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4 text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f] mb-1">
                Duração média
              </div>
              <b className="font-display text-xl sm:text-2xl font-bold text-white">
                {selectedAuto.avg}
              </b>
            </div>
          </div>

          {/* Botão de Ação: Executar Agora */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleExecute(selectedAuto.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ef233c] px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,35,60,0.35)] hover:bg-[#ff3b50] transition cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Executar agora</span>
            </button>
          </div>

          {/* Runbook da Falha (quando há erro ou fixes) */}
          {(selectedAuto.fixes || selectedAuto.id === "stripe") && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#ef233c] font-semibold">
                Runbook da falha
              </div>
              <p className="text-xs text-[#a1a1aa] bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                {selectedAuto.error ||
                  "Assinatura do webhook rejeitada · timestamp fora da tolerância de 300s."}
              </p>
              <div className="flex flex-col gap-2">
                {[
                  {
                    key: "secret",
                    text: "Conferir o segredo do webhook no n8n — o mesmo do endpoint no Stripe.",
                  },
                  {
                    key: "tolerance",
                    text: "Tolerância de timestamp em 300s. O drift atual passa disso.",
                  },
                  {
                    key: "channel",
                    text: "Canal #pagamentos existe e o bot tem permissão de escrever.",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-white/[0.06] text-xs text-[#a1a1aa] cursor-pointer hover:border-white/[0.14] transition"
                  >
                    <input
                      type="checkbox"
                      checked={!!fixesChecked[item.key]}
                      onChange={(e) =>
                        setFixesChecked((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="accent-[#ef233c] mt-0.5 rounded cursor-pointer"
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={handleResolve}
                className="mt-2 inline-flex items-center rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition cursor-pointer"
              >
                Registrar correção
              </button>
            </div>
          )}

          {/* Histórico Recente */}
          <div className="pt-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f] font-semibold mb-2">
              Histórico recente
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {(selectedAuto.logs || []).map((l, idx) => {
                    const isOk = l.ok ?? (l.status === "ok");
                    const message = l.msg || l.text || "";

                    return (
                      <tr
                        key={idx}
                        className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.01]"
                      >
                        <td className="py-2.5 pr-4 font-mono text-xs text-[#777780] w-36 whitespace-nowrap">
                          {stamp(l.at)}
                        </td>
                        <td className="py-2.5 w-6 text-center">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              isOk
                                ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                                : "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                            }`}
                          />
                        </td>
                        <td className="py-2.5 pl-3 text-xs text-[#d4d4d8]">
                          {message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
