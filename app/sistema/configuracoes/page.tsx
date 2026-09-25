"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Settings,
  Database,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Unlock,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Key,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";
import { useSistema } from "@/context/sistema-context";
import {
  ORCHESTRATOR_SERVICES,
  UI_KIT_RESOURCES,
  OrchestratorService,
  UiKitResource,
} from "@/data/ecosystem";

export default function ConfiguracoesPage() {
  const {
    state,
    setMode,
    setProfile,
    setPrefs,
    exportBackup,
    importBackup,
    resetToSeed,
    addToast,
  } = useSistema();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabs de Navegação
  const [activeTab, setActiveTab] = useState<
    "geral" | "orquestrador" | "uikits" | "banco"
  >("geral");

  // Formulário de Identidade
  const [workspaceName, setWorkspaceName] = useState(
    state.profile.workspace || "Victor Hub AI"
  );
  const [operatorName, setOperatorName] = useState(
    state.profile.name || "Victor"
  );
  const [city, setCity] = useState(state.profile.city || "Franca, SP");
  const [objective, setObjective] = useState(
    state.profile.objective ||
      "Entregar sistemas, interfaces e automações que vendem — com o estúdio inteiro no mesmo cockpit."
  );

  // Formulário de Domínio e Propriedade
  const [domain, setDomain] = useState(
    state.profile.domain || "https://seudominio.com"
  );
  const [whatsapp, setWhatsapp] = useState(
    state.profile.whatsapp || "5516982141822"
  );

  // Formulário de Preferências (Toggles)
  const [density, setDensity] = useState(
    state.prefs.density === "operational"
  );
  const [alerts, setAlerts] = useState(state.prefs.alerts ?? true);
  const [reduceMotion, setReduceMotion] = useState(
    state.prefs.reduceMotion ?? false
  );

  // Modal / Chaves de Integrações
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [keyTarget, setKeyTarget] = useState<string | null>(null);
  const [keyValue, setKeyValue] = useState("");

  // Modal de Sandbox / Cockpit Embutido
  const [sandboxService, setSandboxService] = useState<OrchestratorService | null>(null);
  const [sandboxUrlType, setSandboxUrlType] = useState<"web" | "local">("web");
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  // Estado de Cópia
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Filtros do Hub de UI Kits
  const [uiCategory, setUiCategory] = useState<string>("todos");
  const [uiSearch, setUiSearch] = useState<string>("");

  // Estatísticas de Armazenamento
  const stateJson = JSON.stringify(state);
  const byteSize = new Blob([stateJson]).size;
  const kbSize = (byteSize / 1024).toFixed(1);
  const totalRecords =
    state.projects.length +
    state.clients.length +
    state.tasks.length +
    state.automations.length +
    state.arsenal.length +
    state.movements.length;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
    addToast(`${label} copiado para a área de transferência!`, "success");
  };

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      workspace: workspaceName.trim(),
      name: operatorName.trim(),
      city: city.trim(),
      objective: objective.trim(),
    });
  };

  const handleSaveOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      domain: domain.trim(),
      whatsapp: whatsapp.trim(),
    });
  };

  const handleSavePrefs = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefs({
      density: density ? "operational" : "compact",
      alerts,
      reduceMotion,
    });
  };

  const handleCopyVsCodeBrief = () => {
    const brief = `// BRIEFING DO AGENTE VS CODE / ANTIGRAVITY — VICTOR HUB AI
// Dono: ${operatorName} (${city})
// Workspace: ${workspaceName}
// Domínio de Produção: ${domain}
// WhatsApp de Vendas: ${whatsapp}
// Storage Key: victor-hub-os-v1
// Banco: localStorage (Reativo) + Portabilidade JSON v1
// Objetivo: ${objective}`;
    handleCopy(brief, "Briefing do VS Code");
  };

  const handleInjectKitToArsenal = (kit: UiKitResource) => {
    const assetId = "kit-" + kit.id;
    const exists = state.arsenal.some((a) => a.id === assetId);
    if (exists) {
      addToast(`"${kit.name}" já está no seu Arsenal!`, "info");
      return;
    }

    state.arsenal.push({
      id: assetId,
      type: "componente",
      name: `UI Kit: ${kit.name}`,
      version: "v1.0",
      summary: kit.summary,
      tags: ["UI KIT", ...kit.tags.slice(0, 3)],
      uses: 1,
      body: `// ${kit.name} — Componentes e Recursos
// Site oficial: ${kit.url}
// Categoria: ${kit.category}
${kit.installCommand ? `// Instalação CLI:\n${kit.installCommand}\n` : ""}
${kit.sampleSnippet ? `\n// Snippet sugerido:\n${kit.sampleSnippet}` : ""}`,
      niche: "Geral / Studio",
    });

    addToast(`"${kit.name}" injetado no Arsenal com sucesso!`, "success");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importBackup(content);
        if (!result.ok) {
          addToast(result.error || "Erro ao importar backup", "error");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Filtragem dos UI Kits
  const filteredUiKits = useMemo(() => {
    return UI_KIT_RESOURCES.filter((kit) => {
      if (uiCategory !== "todos" && kit.category !== uiCategory) return false;
      if (uiSearch.trim()) {
        const q = uiSearch.toLowerCase();
        const matchesName = kit.name.toLowerCase().includes(q);
        const matchesSummary = kit.summary.toLowerCase().includes(q);
        const matchesTags = kit.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSummary && !matchesTags) return false;
      }
      return true;
    });
  }, [uiCategory, uiSearch]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header Principal Oficial (SYSTEM / Configurações do Workspace) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
            SYSTEM
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
            Configurações do Workspace
          </h1>
          <p className="mt-1 text-sm text-[#777780]">
            Identidade, comportamento do painel e integrações do seu ambiente.
          </p>
        </div>

        {/* Tabs de Controle */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("geral")}
            className={`rounded-lg px-3 py-1.5 font-medium transition ${
              activeTab === "geral"
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-[#777780] hover:text-white"
            }`}
          >
            Cockpit Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orquestrador")}
            className={`rounded-lg px-3 py-1.5 font-medium transition flex items-center gap-1.5 ${
              activeTab === "orquestrador"
                ? "bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.35)]"
                : "text-[#777780] hover:text-white"
            }`}
          >
            <span>Orquestrador Open Source</span>
            <span className="font-mono text-[9px] bg-black/30 px-1.5 py-0.2 rounded">
              4
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("uikits")}
            className={`rounded-lg px-3 py-1.5 font-medium transition flex items-center gap-1.5 ${
              activeTab === "uikits"
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-[#777780] hover:text-white"
            }`}
          >
            <span>Hub UI/UX Kits</span>
            <span className="font-mono text-[9px] text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.2 rounded">
              24
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("banco")}
            className={`rounded-lg px-3 py-1.5 font-medium transition ${
              activeTab === "banco"
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-[#777780] hover:text-white"
            }`}
          >
            Banco & Backups
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ABA 1: COCKPIT GERAL (Layout 1:1 com os prints de referência) */}
      {/* ============================================================== */}
      {activeTab === "geral" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* COLUNA ESQUERDA: Identidade e Preferências (6 cols) */}
          <div className="space-y-5 lg:col-span-6">
            {/* PAINEL 1: Identidade */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-white">
                Identidade
              </h2>

              <div className="flex items-center gap-3.5 pb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] font-display text-base font-bold text-white">
                  V
                </div>
                <div>
                  <div className="font-bold text-sm text-white">
                    {workspaceName}
                  </div>
                  <div className="text-xs text-[#777780]">
                    Ambiente operacional · edição liberada
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveIdentity} className="space-y-3.5">
                <div>
                  <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                    Nome do workspace
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#ef233c] transition"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                    Objetivo operacional
                  </label>
                  <textarea
                    rows={3}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-xs text-white outline-none focus:border-[#ef233c] resize-y transition leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                      Seu nome
                    </label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#ef233c] transition"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#ef233c] transition"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition cursor-pointer"
                  >
                    Salvar identidade
                  </button>
                </div>
              </form>
            </section>

            {/* PAINEL 2: Preferências */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-white">
                Preferências
              </h2>

              <form onSubmit={handleSavePrefs} className="space-y-4">
                {/* Toggle: Densidade operacional */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-xs text-white">
                      Densidade operacional
                    </div>
                    <div className="text-[11px] text-[#777780]">
                      Mantém mais informações visíveis no cockpit.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDensity(!density)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      density ? "bg-[#ef233c]" : "bg-white/[0.12]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        density ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle: Alertas críticos */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-xs text-white">
                      Alertas críticos
                    </div>
                    <div className="text-[11px] text-[#777780]">
                      Destaca prazos, falhas e negociações paradas.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAlerts(!alerts)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      alerts ? "bg-[#ef233c]" : "bg-white/[0.12]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        alerts ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle: Reduzir movimento */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-xs text-white">
                      Reduzir movimento
                    </div>
                    <div className="text-[11px] text-[#777780]">
                      Corta animações. O sistema também respeita a preferência do aparelho.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReduceMotion(!reduceMotion)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      reduceMotion ? "bg-[#ef233c]" : "bg-white/[0.12]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        reduceMotion ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition cursor-pointer"
                  >
                    Salvar preferências
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* COLUNA DIREITA: Domínio & Banco + Integrações (6 cols) */}
          <div className="space-y-5 lg:col-span-6">
            {/* PAINEL 3: Domínio e banco */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-white">
                Domínio e banco
              </h2>

              <p className="text-xs text-[#777780] leading-relaxed">
                O sistema é seu. O banco de hoje é este navegador. O domínio de produção você aponta quando quiser — este preview não é o domínio.
              </p>

              <form onSubmit={handleSaveOwnership} className="space-y-3.5">
                <div>
                  <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                    Domínio de produção
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="https://seudominio.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#ef233c] transition"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#ef233c] transition"
                  />
                </div>

                {/* Stat Lines */}
                <div className="space-y-2 border-t border-white/[0.04] pt-3 text-xs">
                  <div className="flex items-center justify-between text-[#777780]">
                    <span>Banco</span>
                    <strong className="text-white font-mono">localStorage</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#777780]">
                    <span>Chave</span>
                    <strong className="text-white font-mono">victor-hub-os-v1</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#777780]">
                    <span>API</span>
                    <strong className="text-white font-mono">não ligada</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#777780]">
                    <span>Este preview</span>
                    <strong className="text-white font-mono truncate max-w-[260px]">
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : "http://127.0.0.1:52525"}
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-[#66666f] leading-relaxed pt-1">
                  Salvar registra o domínio no backup. O site público só anuncia outro número ou outro domínio quando js/config.js muda — é esse arquivo que o agente do VS Code deve editar.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition cursor-pointer"
                  >
                    Salvar propriedade
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyVsCodeBrief}
                    className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition cursor-pointer"
                  >
                    Copiar briefing do VS Code
                  </button>
                </div>
              </form>
            </section>

            {/* PAINEL 4: Integrações */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-3.5">
              <h2 className="font-display text-base font-bold text-white">
                Integrações
              </h2>

              <div className="divide-y divide-white/[0.04] text-xs">
                {/* OpenAI */}
                <div className="flex items-center justify-between py-2.5 first:pt-0">
                  <div>
                    <div className="font-bold text-white">OpenAI</div>
                    <div className="text-[#777780] text-[11px]">
                      Conexão do estúdio
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#777780] text-[11px] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                      Pronta para conectar
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setKeyTarget("OpenAI");
                        setKeyModalOpen(true);
                      }}
                      className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-1 font-semibold text-white hover:bg-white/[0.08] transition"
                    >
                      Conectar
                    </button>
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="font-bold text-white">GitHub</div>
                    <div className="text-[#777780] text-[11px]">
                      Snapshot noturno ativo
                    </div>
                  </div>
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    Operacional
                  </span>
                </div>

                {/* n8n */}
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="font-bold text-white">n8n</div>
                    <div className="text-[#777780] text-[11px]">
                      Stripe Sync monitorado
                    </div>
                  </div>
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    Operacional
                  </span>
                </div>

                {/* Stripe */}
                <div className="flex items-center justify-between py-2.5 last:pb-0">
                  <div>
                    <div className="font-bold text-white">Stripe</div>
                    <div className="text-[#777780] text-[11px]">
                      Webhook com assinatura inválida
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 text-[11px] flex items-center gap-1.5 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                      Requer chave
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setKeyTarget("Stripe");
                        setKeyModalOpen(true);
                      }}
                      className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-1 font-semibold text-white hover:bg-white/[0.08] transition"
                    >
                      Conectar
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#66666f] leading-relaxed pt-2 border-t border-white/[0.04]">
                Nenhuma chave sai deste navegador. O campo só marca a conexão — o segredo não é armazenado.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: ORQUESTRADOR OPEN SOURCE (Twenty CRM, Open SEO, n8n, OpenClaw) */}
      {/* ============================================================== */}
      {activeTab === "orquestrador" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#ef233c]/30 bg-[#ef233c]/[0.04] p-5 sm:p-6 space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              ECOSSISTEMA BIG TECH SELF-HOSTED
            </span>
            <h2 className="font-display text-xl font-bold text-white">
              Painel de Orquestração Open Source
            </h2>
            <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-3xl">
              Arquitetura de microsserviços integrados para operar o estúdio como uma startup de alta tecnologia. Conecte o Victor Hub AI com instâncias locais do Twenty CRM, auditorias de SEO e agentes em sandbox do n8n e OpenClaw.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ORCHESTRATOR_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-white/[0.16] transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-[#8a8a93] uppercase font-semibold">
                      {srv.category}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        srv.status === "operacional"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : srv.status === "pronto"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          srv.status === "operacional"
                            ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                            : srv.status === "pronto"
                            ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                            : "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                        }`}
                      />
                      {srv.status === "operacional"
                        ? "Operacional"
                        : srv.status === "pronto"
                        ? "Pronto p/ Orquestrar"
                        : "Sandbox Ativo"}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold text-white">
                    {srv.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#8a8a93] leading-relaxed">
                    {srv.summary}
                  </p>

                  {/* Recursos */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {srv.features.map((f) => (
                      <span
                        key={f}
                        className="rounded bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 text-[10px] text-[#a1a1aa]"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>

                  {/* Comando de Terminal */}
                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#66666f]">
                      <span className="flex items-center gap-1">
                        <Terminal className="h-3 w-3 text-[#ef233c]" />
                        Comando Docker / Setup
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(srv.dockerCommand, srv.name)}
                        className="text-xs text-[#777780] hover:text-white"
                        title="Copiar comando"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <code className="block font-mono text-[11px] text-[#e4e4e7] overflow-x-auto whitespace-pre">
                      {srv.dockerCommand}
                    </code>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#777780]">
                      Porta: <strong className="text-white">:{srv.defaultPort}</strong>
                    </span>
                    <span className="text-[#333338]">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSandboxService(srv);
                        setSandboxUrlType("web");
                        setTestWebhookStatus(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition cursor-pointer"
                      title="Operar serviço dentro do Cockpit"
                    >
                      <Activity className="h-3 w-3 text-purple-400" />
                      <span>Sandbox Cockpit</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={srv.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-2.5 py-1 text-xs text-[#a1a1aa] hover:text-white hover:bg-white/[0.04] transition"
                      title="Ver Repositório no GitHub"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <a
                      href={srv.defaultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white hover:bg-white/[0.08] transition"
                      title="Abrir porta local (http://localhost:...)"
                    >
                      <span>Local (:{srv.defaultPort})</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <a
                      href={srv.liveWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#ef233c] px-3 py-1 text-xs font-bold text-white hover:bg-[#ff3b50] shadow-[0_0_12px_rgba(239,35,60,0.3)] transition"
                      title="Abrir Web Oficial em Nova Aba"
                    >
                      <Globe className="h-3 w-3" />
                      <span>Abrir Web</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: HUB UI/UX KITS (+24 Bibliotecas Tailwind CSS) */}
      {/* ============================================================== */}
      {activeTab === "uikits" && (
        <div className="space-y-6">
          {/* Header do Hub */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold flex items-center gap-2">
                <span>UI/UX DESIGN SYSTEM HUB</span>
                <span>/</span>
                <span className="text-white">24 KITS TAILWIND CSS</span>
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-white">
                Diretório de Bibliotecas & Componentes
              </h2>
              <p className="mt-1 text-xs text-[#777780]">
                Acesse com 1 clique os melhores kits de UI/UX do mundo ou injete-os no seu Arsenal de Produção.
              </p>
            </div>

            {/* Barra de Pesquisa */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#55555c]" />
              <input
                type="text"
                value={uiSearch}
                onChange={(e) => setUiSearch(e.target.value)}
                placeholder="Buscar kit, efeito ou tecnologia..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#55555c] outline-none focus:border-[#ef233c] transition"
              />
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              "todos",
              "3D & Shaders",
              "Micro-interações",
              "Layouts SaaS",
              "Design System",
              "Inputs & Forms",
              "Animações",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setUiCategory(cat)}
                className={`rounded-full px-3 py-1 font-mono text-[10px] transition ${
                  uiCategory === cat
                    ? "bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]"
                    : "bg-white/[0.03] text-[#777780] border border-white/[0.06] hover:text-white"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid com os Kits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUiKits.map((kit) => (
              <div
                key={kit.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col justify-between space-y-3.5 hover:border-[#ef233c]/60 hover:bg-white/[0.03] transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#ef233c] font-semibold">
                      {kit.category}
                    </span>

                    {kit.isOpenSource ? (
                      <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[9px] text-emerald-400 font-bold">
                        OPEN SOURCE
                      </span>
                    ) : (
                      <span className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-[#a1a1aa]">
                        FREE / PREMIUM
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2.5 font-display text-base font-bold text-white group-hover:text-white transition">
                    {kit.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#777780] leading-relaxed line-clamp-2">
                    {kit.summary}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {kit.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[8px] text-[#8a8a93]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleInjectKitToArsenal(kit)}
                    title="Salvar referência e snippet no Arsenal de Produção"
                    className="inline-flex items-center gap-1 rounded-lg border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/[0.08] transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3 text-[#ef233c]" />
                    <span>Ao Arsenal</span>
                  </button>

                  <a
                    href={kit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#ef233c]/15 border border-[#ef233c]/30 px-3 py-1 text-[11px] font-bold text-white hover:bg-[#ef233c] transition shadow-sm"
                  >
                    <span>Visitar</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 4: BANCO & BACKUPS (localStorage, JSON export/import, Reset) */}
      {/* ============================================================== */}
      {activeTab === "banco" && (
        <div className="space-y-5">
          {/* Modo do Cockpit */}
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Modo de Operação
                </h2>
                <p className="text-xs text-[#777780]">
                  Alterne entre edição liberada no navegador ou modo de visualização protegido contra alterações acidentais.
                </p>
              </div>

              <span
                className={`font-mono text-xs uppercase px-2.5 py-1 rounded-full font-bold ${
                  state.prefs.mode === "operacional"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {state.prefs.mode === "operacional"
                  ? "Modo Operacional"
                  : "Modo Visualização"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setMode("operacional")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition ${
                  state.prefs.mode === "operacional"
                    ? "bg-emerald-500 text-black shadow-[0_0_16px_rgba(52,211,153,0.3)]"
                    : "border border-white/[0.1] bg-white/[0.02] text-white hover:bg-white/[0.06]"
                }`}
              >
                <Unlock className="h-4 w-4" />
                <span>Ativar Modo Operacional (Edição Liberada)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("publico")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition ${
                  state.prefs.mode === "publico"
                    ? "bg-amber-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.3)]"
                    : "border border-white/[0.1] bg-white/[0.02] text-white hover:bg-white/[0.06]"
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>Travar para Demonstração (Somente Leitura)</span>
              </button>
            </div>
          </section>

          {/* Estatísticas e Ações de Backup */}
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-[#ef233c]" />
                Banco de Dados Local (localStorage)
              </h2>

              <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Sincronizado
              </span>
            </div>

            {/* Métricas do Banco */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="font-mono text-[9px] text-[#66666f] uppercase">
                  Chave
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">
                  victor-hub-os-v1
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="font-mono text-[9px] text-[#66666f] uppercase">
                  Schema
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">
                  v1.0 (Portátil)
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="font-mono text-[9px] text-[#66666f] uppercase">
                  Tamanho
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-emerald-400">
                  {kbSize} KB
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="font-mono text-[9px] text-[#66666f] uppercase">
                  Registros
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">
                  {totalRecords} entidades
                </div>
              </div>
            </div>

            {/* Ações de Backup */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={exportBackup}
                className="flex items-center gap-2 rounded-xl bg-[#ef233c] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Backup JSON</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08] transition cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Importar Backup JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "Deseja realmente restaurar os dados originais de fábrica? Todas as alterações não exportadas serão perdidas."
                    )
                  ) {
                    resetToSeed();
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-[#8a8a93] hover:text-white hover:bg-white/[0.08] transition ml-auto cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Restaurar Fábrica</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* MODAL: Conexão Segura de Chave de API */}
      {keyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#101012] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
                  INTEGRAÇÃO
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  Conectar {keyTarget}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setKeyModalOpen(false)}
                className="text-[#777780] hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#777780] leading-relaxed">
              Insira a chave de API para o serviço <strong>{keyTarget}</strong>. Ela será utilizada exclusivamente nas chamadas do cockpit neste navegador.
            </p>

            <div className="space-y-3">
              <input
                type="password"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ef233c] font-mono"
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setKeyModalOpen(false)}
                  className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-[#8a8a93] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToast(`Chave de ${keyTarget} salva localmente!`, "success");
                    setKeyModalOpen(false);
                    setKeyValue("");
                  }}
                  className="rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition"
                >
                  Salvar Conexão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Operação em Sandbox / Cockpit Embutido */}
      {sandboxService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-5">
          <div className="relative flex flex-col w-full max-w-6xl h-[92vh] rounded-2xl border border-white/[0.12] bg-[#0c0c0e] shadow-2xl overflow-hidden">
            {/* Modal Top Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] px-4 sm:px-6 py-3 bg-white/[0.02] gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef233c]/10 border border-[#ef233c]/20 text-[#ef233c]">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-white">
                      {sandboxService.name}
                    </h3>
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/[0.06] text-[#8a8a93]">
                      {sandboxService.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#777780] hidden sm:block truncate max-w-md">
                    {sandboxService.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch entre URL Web Oficial e Instância Local */}
                <div className="flex items-center rounded-lg border border-white/[0.08] bg-black/60 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSandboxUrlType("web")}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                      sandboxUrlType === "web"
                        ? "bg-white/[0.12] text-white shadow-sm"
                        : "text-[#777780] hover:text-white"
                    }`}
                  >
                    Web Oficial
                  </button>
                  <button
                    type="button"
                    onClick={() => setSandboxUrlType("local")}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                      sandboxUrlType === "local"
                        ? "bg-white/[0.12] text-white shadow-sm"
                        : "text-[#777780] hover:text-white"
                    }`}
                  >
                    Local (:{sandboxService.defaultPort})
                  </button>
                </div>

                <a
                  href={sandboxUrlType === "web" ? sandboxService.liveWebUrl : sandboxService.defaultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#ef233c] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#ff3b50] shadow-[0_0_12px_rgba(239,35,60,0.3)] transition"
                >
                  <Globe className="h-3 w-3" />
                  <span>Abrir em Nova Aba</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={() => setSandboxService(null)}
                  className="rounded-lg border border-white/[0.08] p-1.5 text-[#777780] hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
                  title="Fechar Sandbox"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sub-bar de Ações Rápidas & Disparo de Webhook */}
            <div className="border-b border-white/[0.06] bg-black/40 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#8a8a93] text-[11px]">
                <span className="font-mono text-emerald-400">● LIVE SANDBOX:</span>
                <span className="truncate max-w-xs sm:max-w-md font-mono text-white/90">
                  {sandboxUrlType === "web" ? sandboxService.liveWebUrl : sandboxService.defaultUrl}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isSendingWebhook}
                  onClick={async () => {
                    setIsSendingWebhook(true);
                    try {
                      const res = await fetch("/api/webhook", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          service: sandboxService.id,
                          serviceName: sandboxService.name,
                          event: "sandbox.ping",
                          timestamp: new Date().toISOString(),
                          origin: "Cockpit Orchestrator Modal",
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setTestWebhookStatus(`✓ Webhook 200 OK (${new Date().toLocaleTimeString("pt-BR")})`);
                        addToast(`Webhook disparado para ${sandboxService.name}!`, "success");
                      } else {
                        setTestWebhookStatus("Erro ao processar");
                      }
                    } catch {
                      setTestWebhookStatus("Falha de conexão com /api/webhook");
                    } finally {
                      setIsSendingWebhook(false);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white hover:bg-white/[0.08] transition cursor-pointer"
                >
                  <Terminal className="h-3.5 w-3.5 text-[#ef233c]" />
                  <span>{isSendingWebhook ? "Enviando payload..." : "Disparar Webhook Teste"}</span>
                </button>

                {testWebhookStatus && (
                  <span className="font-mono text-[11px] text-emerald-400 font-medium">
                    {testWebhookStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Área do Navegador / Frame Sandbox */}
            <div className="relative flex-1 bg-black overflow-hidden">
              <iframe
                src={sandboxUrlType === "web" ? sandboxService.liveWebUrl : sandboxService.defaultUrl}
                title={sandboxService.name}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />

              {/* Box flutuante explicativo do cockpit */}
              <div className="pointer-events-none absolute bottom-4 right-4 max-w-sm rounded-xl border border-white/[0.08] bg-black/90 backdrop-blur-md p-3.5 text-[11px] text-[#8a8a93] space-y-1 shadow-lg">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-[#ef233c]" />
                  Dica de Orquestração Cockpit
                </div>
                <p>
                  GitHub e certos serviços em nuvem limitam incorporação direta por cabeçalhos <code>X-Frame-Options</code>. Caso a pré-visualização seja bloqueada, use o botão <strong>&quot;Abrir em Nova Aba&quot;</strong> acima para acesso direto e instantâneo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
