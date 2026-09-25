"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  CreditCard,
  Sparkles,
  Wallet,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  Activity,
  Layers,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useSistema } from "@/context/sistema-context";

export default function FinanceiroPage() {
  const { state, kpis, receiveMovement, deleteMovement, setNovoModalOpen, addToast } =
    useSistema();

  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    week: string;
    value: number;
  } | null>(null);

  const [diagramView, setDiagramView] = useState<"fluxo" | "resumo">("fluxo");

  // Format currency
  const money = (val: number) =>
    "R$ " +
    Number(val || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  // Short date e.g. "26 Set"
  const shortDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T12:00:00-03:00");
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${day} ${months[d.getMonth()]}`;
  };

  // Pulso do caixa values (8 semanas)
  const pulseValues = state.pulse || [2400, 1800, 4200, 900, 3100, 5600, 2200, 6000];

  // SVG Waveform generator matching reference 1:1
  const w = 640;
  const h = 150;
  const pad = 16;
  const max = Math.max(...pulseValues) * 1.2 || 1;
  const pts = pulseValues.map((v, i) => {
    const x = pad + (i / (pulseValues.length - 1)) * (w - pad * 2);
    const y = h - 28 - (v / max) * (h - 48);
    return { x, y, v };
  });
  const linePath = pts
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const lastPt = pts[pts.length - 1];
  const areaPath = `${linePath} L${lastPt.x.toFixed(1)},${h - 12} L${pts[0].x.toFixed(
    1
  )},${h - 12} Z`;

  // Upcoming expected inflows sorted by date
  const upcoming = state.movements
    .filter((m) => m.kind === "entrada" && m.status === "previsto")
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
            FINANCE CORE
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
            Controle Financeiro
          </h1>
          <p className="mt-1 text-sm text-[#777780]">
            Receitas, custos, previsões e rentabilidade do seu estúdio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNovoModalOpen(true)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Grid com 4 KPIs Financeiros (Exato como nos prints) */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {/* KPI 1: RECEITA PREVISTA */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 relative transition hover:border-white/[0.16]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#777780]">
              RECEITA PREVISTA
            </span>
            <TrendingUp className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2.5 font-display text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
            {money(kpis.predicted)}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#777780]">
            pipeline financeiro
          </div>
        </div>

        {/* KPI 2: RECEBIDO */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 relative transition hover:border-white/[0.16]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#777780]">
              RECEBIDO
            </span>
            <Wallet className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2.5 font-display text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
            {money(kpis.received)}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#777780]">
            confirmado no mês
          </div>
        </div>

        {/* KPI 3: CUSTOS */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 relative transition hover:border-white/[0.16]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#777780]">
              CUSTOS
            </span>
            <CreditCard className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2.5 font-display text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
            {money(kpis.costs)}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#777780]">
            fixos e variáveis
          </div>
        </div>

        {/* KPI 4: RESULTADO */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 relative transition hover:border-white/[0.16]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#777780]">
              RESULTADO
            </span>
            <Sparkles className="h-4 w-4 text-[#ef233c]" />
          </div>
          <div className="mt-2.5 font-display text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
            {money(kpis.result)}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#777780]">
            margem projetada
          </div>
        </div>
      </div>

      {/* Grid Principal: Movimentações (Esquerda) e Pulso / Próximos (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUNA ESQUERDA: Movimentações (7 colunas) */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h2 className="font-display text-base font-bold text-white">
              Movimentações
            </h2>
            <button
              type="button"
              onClick={() => setNovoModalOpen(true)}
              className="text-xs font-semibold text-[#ef233c] hover:underline cursor-pointer"
            >
              Lançar
            </button>
          </div>

          {/* Lista de Movimentações */}
          <div className="divide-y divide-white/[0.06]">
            {state.movements.map((m) => {
              const isEntrada = m.kind === "entrada";
              const isPrevisto = m.status === "previsto";

              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-white truncate">
                      {m.title}
                    </div>
                    <div className="font-mono text-xs text-[#777780] mt-0.5">
                      {m.cadence === "mensal"
                        ? `mensal · ${m.status}`
                        : `${shortDate(m.date)} · ${m.status}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-sm font-semibold tabular-nums ${
                        isEntrada ? "text-emerald-400" : "text-[#fda4af]"
                      }`}
                    >
                      {isEntrada ? "+" : "−"}
                      {money(m.amount)}
                    </span>

                    {/* Botão confirmar recebimento */}
                    {isPrevisto && (
                      <button
                        type="button"
                        onClick={() => receiveMovement(m.id)}
                        className="text-xs font-semibold text-[#ef233c] hover:underline cursor-pointer ml-1.5"
                      >
                        confirmar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nota do Rodapé da Caixa */}
          <p className="pt-2 text-xs text-[#777780] leading-relaxed border-t border-white/[0.04]">
            Caixa realizado no mês: <strong className="text-white">{money(kpis.realized)}</strong>. A margem projetada não soma o que já entrou — ela olha o que ainda vem, menos o custo.
          </p>
        </div>

        {/* COLUNA DIREITA: Pulso do Caixa + Próximos Recebimentos (5 colunas) */}
        <div className="space-y-5 lg:col-span-5">
          {/* Card 1: Pulso do Caixa com Gráfico Waveform Oficial */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-white">
                Pulso do caixa
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AO VIVO
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[#777780] pt-1">
              <span>8 SEMANAS ATRÁS</span>
              <span>AGORA</span>
            </div>

            {/* Container do Gráfico SVG do Pulso */}
            <div className="relative pt-2">
              <svg
                className="w-full h-[148px] overflow-visible"
                viewBox={`0 0 ${w} ${h}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef233c" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#ef233c" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Área preenchida do gradiente */}
                <path d={areaPath} fill="url(#pulseFill)" />

                {/* Linha vermelha pulsante */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#ef233c"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Pontos interativos em cada semana */}
                {pts.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === pts.length - 1 ? 4 : 3}
                    className="cursor-pointer transition-all hover:scale-150"
                    fill={idx === pts.length - 1 ? "#fff" : "#ef233c"}
                    onMouseEnter={() =>
                      setHoveredPoint({
                        index: idx,
                        week: idx === pts.length - 1 ? "Agora" : `Semana -${8 - idx}`,
                        value: pt.v,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Ponto Final "AGORA" com duplo halo pulsante */}
                <circle
                  cx={lastPt.x}
                  cy={lastPt.y}
                  r="10"
                  fill="#ef233c"
                  opacity="0.25"
                />
                <circle
                  cx={lastPt.x}
                  cy={lastPt.y}
                  r="3.5"
                  fill="#fff"
                />
              </svg>

              {/* Tooltip flutuante de dados do Pulso */}
              {hoveredPoint && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-lg border border-white/[0.12] bg-[#0c0c0e]/95 px-3 py-1.5 shadow-xl text-center backdrop-blur-sm pointer-events-none z-10">
                  <div className="font-mono text-[9px] uppercase text-[#777780]">
                    {hoveredPoint.week}
                  </div>
                  <div className="font-mono text-xs font-bold text-white">
                    {money(hoveredPoint.value)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Próximos Recebimentos */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-white mb-2">
              Próximos recebimentos
            </h2>

            {upcoming.length === 0 ? (
              <div className="text-xs text-[#777780] py-4 text-center">
                Nada previsto no momento.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {upcoming.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">
                        {m.title}
                      </div>
                      <div className="font-mono text-xs text-[#777780] mt-0.5">
                        {shortDate(m.date)}
                      </div>
                    </div>
                    <b className="font-display text-sm font-bold text-white tabular-nums">
                      {money(m.amount)}
                    </b>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEÇÃO VISUAL AVANÇADA: Fluxograma & Diagrama de Nós do Fluxo de Capital */}
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              TOPOLOGIA & FLUXOGRAMA DE CAPITAL
            </span>
            <h2 className="mt-1 font-display text-lg font-bold text-white">
              Diagrama Visual de Liquidez & Destinação
            </h2>
            <p className="text-xs text-[#777780]">
              Mapeamento visual de onde o dinheiro vem, onde está alocado e qual margem é retida no estúdio.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 text-xs">
            <button
              type="button"
              onClick={() => setDiagramView("fluxo")}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                diagramView === "fluxo"
                  ? "bg-white/[0.08] text-white"
                  : "text-[#777780] hover:text-white"
              }`}
            >
              Nós de Capital
            </button>
            <button
              type="button"
              onClick={() => setDiagramView("resumo")}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                diagramView === "resumo"
                  ? "bg-white/[0.08] text-white"
                  : "text-[#777780] hover:text-white"
              }`}
            >
              Distribuição %
            </button>
          </div>
        </div>

        {/* DIAGRAMA DE NÓS (Fluxo de Capital) */}
        {diagramView === "fluxo" ? (
          <div className="rounded-2xl bg-black/40 border border-white/[0.05] p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* NÓ 1: ENTRADAS */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#777780] tracking-wider block">
                  ORIGEM DO CAPITAL
                </span>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400">
                      Recebido Confirmado
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  </div>
                  <div className="font-display text-xl font-bold text-white">
                    {money(kpis.received)}
                  </div>
                  <span className="font-mono text-[10px] text-[#777780]">
                    1 parcela liquidada (Alpha AI)
                  </span>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#a1a1aa]">
                      Receita Prevista
                    </span>
                    <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                  </div>
                  <div className="font-display text-xl font-bold text-white">
                    {money(kpis.predicted)}
                  </div>
                  <span className="font-mono text-[10px] text-[#777780]">
                    2 parcelas a faturar (Nexus + Alpha)
                  </span>
                </div>
              </div>

              {/* NÓ CENTRAL: HUB DE LIQUIDEZ */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[#ef233c]/40 bg-[#ef233c]/[0.05] shadow-[0_0_30px_rgba(239,35,60,0.1)] text-center relative">
                <div className="h-10 w-10 rounded-xl bg-[#ef233c]/15 text-[#ef233c] grid place-items-center mb-3">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ef233c] font-semibold">
                  HUB DO ESTÚDIO
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  {money(kpis.predicted + kpis.received)}
                </h3>
                <span className="mt-1 text-xs text-[#a1a1aa]">
                  Volume Total em Circulação
                </span>

                <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-[#8a8a93] bg-black/40 px-3 py-1 rounded-full border border-white/[0.06]">
                  <span>Saúde de Caixa: </span>
                  <strong className="text-emerald-400">92.4% Margem</strong>
                </div>
              </div>

              {/* NÓ 3: DESTINAÇÃO & MARGEM */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#777780] tracking-wider block">
                  DESTINAÇÃO DO VALOR
                </span>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-400">
                      Custos de Ferramentas
                    </span>
                    <span className="font-mono text-[10px] text-rose-400">
                      {(
                        (kpis.costs / (kpis.predicted + kpis.received || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="font-display text-xl font-bold text-white">
                    −{money(kpis.costs)}
                  </div>
                  <span className="font-mono text-[10px] text-[#777780]">
                    Figma, hosting, domínios e APIs
                  </span>
                </div>

                <div className="rounded-xl border border-[#ef233c]/30 bg-[#ef233c]/[0.06] p-4 space-y-1 shadow-[0_0_20px_rgba(239,35,60,0.1)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Margem Projetada Retida
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">
                      {(
                        (kpis.result / (kpis.predicted + kpis.received || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="font-display text-xl font-bold text-[#ef233c]">
                    {money(kpis.result)}
                  </div>
                  <span className="font-mono text-[10px] text-[#8a8a93]">
                    Caixa livre para o Victor
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VISÃO BARRAS DE PROPORÇÃO */
          <div className="rounded-2xl bg-black/40 border border-white/[0.05] p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#a1a1aa]">Distribuição de Entradas vs Custos</span>
                <span className="text-white">
                  Total: {money(kpis.predicted + kpis.received)}
                </span>
              </div>
              <div className="h-3.5 w-full rounded-full bg-white/[0.06] overflow-hidden flex">
                <div
                  style={{
                    width: `${((kpis.result / (kpis.predicted + kpis.received || 1)) * 100).toFixed(1)}%`,
                  }}
                  className="h-full bg-gradient-to-r from-[#ef233c] to-[#ff4d6d]"
                  title="Resultado / Margem"
                />
                <div
                  style={{
                    width: `${((kpis.costs / (kpis.predicted + kpis.received || 1)) * 100).toFixed(1)}%`,
                  }}
                  className="h-full bg-rose-900"
                  title="Custos"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#777780] mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ef233c]" />
                  Margem Líquida Retida: {money(kpis.result)} (
                  {(
                    (kpis.result / (kpis.predicted + kpis.received || 1)) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-900" />
                  Custos Operacionais: {money(kpis.costs)} (
                  {(
                    (kpis.costs / (kpis.predicted + kpis.received || 1)) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
