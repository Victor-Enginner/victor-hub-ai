"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Plus,
  X,
  Play,
  FileCode,
  FileText,
  Bot,
  Layers,
  ArrowRight,
  Search,
  Download,
  Upload,
  MessageSquare,
  Tag,
  Briefcase,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useSistema } from "@/context/sistema-context";
import { prompts as businessPrompts } from "@/data/prompts";
import { salesMessages } from "@/data/sales";
import { ArsenalItem } from "@/lib/types";

export default function ArsenalPage() {
  const {
    state,
    composeAsset,
    addToast,
    composeModal,
    setComposeModal,
  } = useSistema();

  // Primary tab
  const [activeTab, setActiveTab] = useState<
    "todos" | "prompt" | "agente" | "template" | "componente" | "script"
  >("todos");

  // Niche filter
  const [selectedNiche, setSelectedNiche] = useState<string>("todos");

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Drawer inspection
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New item modal
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [newType, setNewType] = useState<
    "prompt" | "agente" | "template" | "componente" | "script"
  >("prompt");
  const [newNiche, setNewNiche] = useState("");
  const [newName, setNewName] = useState("");
  const [newVersion, setNewVersion] = useState("v1.0");
  const [newSummary, setNewSummary] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newBody, setNewBody] = useState("");

  // JSON Import modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");

  // Merge state.arsenal with transformed business prompts and sales scripts
  const allArsenalItems = useMemo<ArsenalItem[]>(() => {
    // 1. Built-in studio arsenal
    const studioItems: ArsenalItem[] = state.arsenal.map((item) => ({
      ...item,
      niche: item.niche || "Geral / Studio",
    }));

    // 2. Business niche prompts from data/prompts.ts
    const transformedPrompts: ArsenalItem[] = businessPrompts.map((p) => ({
      id: p.id,
      type: "prompt" as const,
      version: "v1.0",
      star: false,
      name: `Prompt: ${p.headline || p.niche + " - " + p.goal}`,
      summary: `${p.goal} (${p.format}) — Estilo: ${p.style}`,
      tags: [p.category.toUpperCase(), p.niche.toUpperCase(), "IA"],
      uses: 12,
      body: p.prompt,
      niche: p.niche,
    }));

    // 3. Sales DMs from data/sales.ts
    const transformedSales: ArsenalItem[] = salesMessages.map((s, idx) => {
      const nichePart = s.title.replace("DM inicial — ", "").trim();
      return {
        id: `sales-${idx + 1}`,
        type: "script" as const,
        version: "v1.0",
        star: false,
        name: `Script DM: Prospecção ${nichePart}`,
        summary: `Mensagem de abordagem inicial fria de alta conversão para ${nichePart}.`,
        tags: ["DM", "PROSPECÇÃO", nichePart.toUpperCase()],
        uses: 38,
        body: s.message,
        niche: nichePart,
      };
    });

    return [...studioItems, ...transformedPrompts, ...transformedSales];
  }, [state.arsenal]);

  // Available Niches
  const availableNiches = useMemo(() => {
    const set = new Set<string>();
    allArsenalItems.forEach((item) => {
      if (item.niche && item.niche !== "Geral / Studio") {
        set.add(item.niche);
      }
    });
    return ["todos", "Geral / Studio", ...Array.from(set).sort()];
  }, [allArsenalItems]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return allArsenalItems.filter((item) => {
      // Tab filter
      if (activeTab !== "todos" && item.type !== activeTab) {
        return false;
      }

      // Niche filter
      if (selectedNiche !== "todos") {
        if (selectedNiche === "Geral / Studio") {
          if (item.niche && item.niche !== "Geral / Studio") return false;
        } else if (item.niche?.toLowerCase() !== selectedNiche.toLowerCase()) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesBody = item.body.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesNiche = item.niche?.toLowerCase().includes(q);
        if (!matchesName && !matchesSummary && !matchesBody && !matchesTags && !matchesNiche) {
          return false;
        }
      }

      return true;
    });
  }, [allArsenalItems, activeTab, selectedNiche, searchQuery]);

  const selectedAsset = allArsenalItems.find((a) => a.id === selectedAssetId);

  const handleCopyAsset = (asset: ArsenalItem) => {
    navigator.clipboard.writeText(asset.body);
    asset.uses = (asset.uses || 0) + 1;
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast(`"${asset.name}" copiado para a área de transferência.`, "success");
  };

  const handleDownloadAsset = (asset: ArsenalItem) => {
    const ext =
      asset.type === "componente" ? "tsx" : asset.type === "prompt" ? "md" : "txt";
    const filename = `${asset.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${ext}`;
    const blob = new Blob([asset.body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Download iniciado: ${filename}`, "info");
  };

  const handleExportFullArsenal = () => {
    const dataStr = JSON.stringify(allArsenalItems, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `victor-hub-arsenal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Exportação completa do Arsenal gerada com sucesso!", "success");
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      const itemsToAdd = Array.isArray(parsed) ? parsed : [parsed];
      let count = 0;
      for (const item of itemsToAdd) {
        if (item.name && item.body) {
          state.arsenal.push({
            id: item.id || "import-" + Date.now().toString(36) + "-" + count,
            type: item.type || "componente",
            version: item.version || "v1.0",
            name: item.name,
            summary: item.summary || "Importado via JSON",
            tags: Array.isArray(item.tags) ? item.tags : ["IMPORTADO"],
            uses: 0,
            body: item.body,
            niche: item.niche || "Geral / Studio",
          });
          count++;
        }
      }
      addToast(`${count} item(ns) importados para o Arsenal com sucesso!`, "success");
      setImportModalOpen(false);
      setImportJsonText("");
    } catch (err) {
      addToast("Erro ao interpretar JSON. Verifique a formatação.", "warn");
    }
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBody.trim()) {
      addToast("Preencha o nome e o conteúdo do item.", "warn");
      return;
    }
    const tagsArr = newTags
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    state.arsenal.push({
      id: "custom-" + Date.now().toString(36),
      type: newType,
      name: newName.trim(),
      version: newVersion.trim() || "v1.0",
      summary: newSummary.trim() || "Item adicionado à biblioteca de produção.",
      tags: tagsArr.length ? tagsArr : ["CUSTOM"],
      uses: 0,
      body: newBody.trim(),
      niche: newNiche.trim() || "Geral / Studio",
    });

    addToast(`"${newName}" adicionado ao arsenal com sucesso!`, "success");
    setNewItemOpen(false);
    setNewName("");
    setNewSummary("");
    setNewTags("");
    setNewBody("");
    setNewNiche("");
  };

  const typeBadge = (t: string) => {
    switch (t) {
      case "prompt":
        return { label: "PROMPT", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "agente":
        return { label: "AGENTE", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
      case "template":
        return { label: "TEMPLATE", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "componente":
        return { label: "COMPONENTE", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "script":
        return { label: "SCRIPT DM", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
      default:
        return { label: t.toUpperCase(), bg: "bg-white/[0.06] text-[#777780] border-white/[0.08]" };
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold flex items-center gap-2">
            <span>KNOWLEDGE VAULT</span>
            <span className="text-[#333339]">/</span>
            <span className="text-[#a1a1aa]">{allArsenalItems.length} ATIVOS PRONTOS</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
            Biblioteca de Produção & Arsenal
          </h1>
          <p className="mt-1 text-sm text-[#777780]">
            Prompts por nicho de negócio, agentes autônomos, templates comerciais e componentes prontos para entrega.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportFullArsenal}
            title="Exportar base completa em JSON"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-[#a1a1aa] hover:text-white hover:bg-white/[0.08] transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-[#a1a1aa] hover:text-white hover:bg-white/[0.08] transition"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Importar Snippets</span>
          </button>

          <button
            type="button"
            onClick={() => setNewItemOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#ef233c]/40 bg-[#ef233c]/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#ef233c]/20 transition"
          >
            <Plus className="h-3.5 w-3.5 text-[#ef233c]" />
            <span>Adicionar Ativo</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setComposeModal({ assetId: state.arsenal[0]?.id || "proposta" })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#ef233c] px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,35,60,0.35)] hover:bg-[#ff3b50] transition"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Executar no projeto</span>
          </button>
        </div>
      </div>

      {/* Barra de Busca e Tabs de Categoria */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "todos", label: "Todos", count: allArsenalItems.length },
              {
                id: "prompt",
                label: "Prompts IA",
                count: allArsenalItems.filter((i) => i.type === "prompt").length,
              },
              {
                id: "agente",
                label: "Agentes",
                count: allArsenalItems.filter((i) => i.type === "agente").length,
              },
              {
                id: "template",
                label: "Templates",
                count: allArsenalItems.filter((i) => i.type === "template").length,
              },
              {
                id: "componente",
                label: "Componentes",
                count: allArsenalItems.filter((i) => i.type === "componente").length,
              },
              {
                id: "script",
                label: "Scripts DM",
                count: allArsenalItems.filter((i) => i.type === "script").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition inline-flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white/[0.08] text-white border border-white/[0.12]"
                    : "text-[#777780] hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="font-mono text-[10px] text-[#55555c]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#55555c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nicho, headline, tag ou código..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#55555c] outline-none focus:border-[#ef233c] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777780] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Seletor de Nichos Rápidos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="font-mono text-[10px] uppercase text-[#66666f] shrink-0 flex items-center gap-1">
            <Filter className="h-3 w-3 text-[#ef233c]" />
            Nicho:
          </span>
          {availableNiches.map((niche) => {
            const isSelected = selectedNiche.toLowerCase() === niche.toLowerCase();
            return (
              <button
                key={niche}
                type="button"
                onClick={() => setSelectedNiche(niche)}
                className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] transition ${
                  isSelected
                    ? "bg-[#ef233c] text-white font-semibold shadow-[0_0_12px_rgba(239,35,60,0.4)]"
                    : "bg-white/[0.03] text-[#777780] border border-white/[0.06] hover:text-white hover:border-white/[0.14]"
                }`}
              >
                {niche === "todos" ? "TODOS OS NICHOS" : niche.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contagem de Resultados */}
      <div className="flex items-center justify-between text-[11px] text-[#66666f] font-mono border-t border-white/[0.04] pt-3">
        <span>
          Mostrando <strong className="text-white">{filteredItems.length}</strong> de{" "}
          {allArsenalItems.length} ativos disponíveis
        </span>
        {searchQuery && (
          <span className="text-[#a1a1aa]">
            Filtrado por: <em className="text-white">"{searchQuery}"</em>
          </span>
        )}
      </div>

      {/* Grid de Ativos (2 colunas em desktop, layout dos prints) */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] p-12 text-center space-y-3">
          <Sparkles className="h-8 w-8 text-[#55555c] mx-auto" />
          <h3 className="font-display text-base font-semibold text-white">
            Nenhum ativo encontrado para os filtros atuais
          </h3>
          <p className="text-xs text-[#777780] max-w-md mx-auto">
            Tente trocar o nicho selecionado, limpar o termo de busca ou adicione um novo ativo personalizado.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("todos");
              setSelectedNiche("todos");
              setSearchQuery("");
            }}
            className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.04]"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const isSelected = selectedAssetId === item.id;
            const badge = typeBadge(item.type);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedAssetId(item.id)}
                className={`rounded-2xl border p-5 text-left cursor-pointer transition relative flex flex-col justify-between min-h-[175px] group ${
                  isSelected
                    ? "border-[#ef233c] bg-white/[0.03] shadow-[0_0_0_1px_rgba(239,35,60,0.3),0_0_36px_rgba(239,35,60,0.06)]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-[#ef233c]/60 hover:bg-white/[0.03]"
                }`}
              >
                <div>
                  {/* Top Row: Tipo Badge + Versão + Nicho */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ef233c]/10 text-[#ef233c] group-hover:scale-105 transition">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span
                        className={`rounded border px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      {item.niche && item.niche !== "Geral / Studio" && (
                        <span className="hidden sm:inline rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-[#a1a1aa]">
                          {item.niche}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#66666f]">
                        {item.star && "★ "}
                        {item.version}
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="mt-3.5 font-display text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-white transition">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#777780] leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                {/* Foot: Tags e Ações Rápidas */}
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-[#777780]"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="font-mono text-[9px] text-[#55555c]">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#66666f]">
                      {item.uses} usos
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAsset(item);
                      }}
                      title="Copiar conteúdo"
                      className="p-1 rounded-md text-[#777780] hover:text-white hover:bg-white/[0.06] transition"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DRAWER LATERAL: Detalhes do Ativo Selecionado */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedAssetId(null)}
          />
          <div className="relative z-10 w-full max-w-xl bg-[#0b0b0d] border-l border-white/[0.1] p-6 overflow-y-auto shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Header do Drawer */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
                    {selectedAsset.type.toUpperCase()} · {selectedAsset.version}
                  </span>
                  {selectedAsset.niche && (
                    <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-[#a1a1aa]">
                      {selectedAsset.niche}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAssetId(null)}
                  className="rounded-lg p-1 text-[#777780] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-white tracking-tight">
                  {selectedAsset.name}
                </h2>
                <p className="mt-1.5 text-xs text-[#a1a1aa] leading-relaxed">
                  {selectedAsset.summary}
                </p>
              </div>

              {/* Tags & Metadados */}
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#777780] border-t border-white/[0.06] pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {selectedAsset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/[0.06] px-2 py-0.5 text-[9px] text-[#a1a1aa]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span>{selectedAsset.uses} execuções acumuladas</span>
              </div>

              {/* Code/Prompt Body */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66666f]">
                    Conteúdo / Prompt / Código
                  </span>
                  <span className="font-mono text-[10px] text-[#55555c]">
                    {selectedAsset.body.length} caracteres
                  </span>
                </div>
                <pre className="max-h-[380px] overflow-auto rounded-xl border border-white/[0.08] bg-black/60 p-4 font-mono text-xs leading-relaxed text-[#e4e4e7] whitespace-pre-wrap select-all">
                  {selectedAsset.body}
                </pre>
              </div>
            </div>

            {/* Ações do Drawer */}
            <div className="flex items-center gap-2.5 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  const id = selectedAsset.id;
                  setSelectedAssetId(null);
                  setComposeModal({ assetId: id });
                }}
                className="flex-1 rounded-xl bg-[#ef233c] py-2.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition inline-flex items-center justify-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Executar no projeto</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyAsset(selectedAsset)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08] transition"
              >
                {copiedId === selectedAsset.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownloadAsset(selectedAsset)}
                title="Baixar arquivo individual"
                className="rounded-xl border border-white/[0.12] bg-white/[0.04] p-2.5 text-xs text-[#a1a1aa] hover:text-white hover:bg-white/[0.08] transition"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Adicionar Novo Ativo ao Arsenal */}
      {newItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#101012] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
                  NOVO ATIVO
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  Adicionar ao Arsenal de Produção
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewItemOpen(false)}
                className="text-[#777780] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                    Tipo
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#ef233c]"
                  >
                    <option value="prompt">Prompt IA</option>
                    <option value="agente">Agente</option>
                    <option value="template">Template</option>
                    <option value="componente">Componente UI</option>
                    <option value="script">Script DM / Vendas</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                    Nicho de Negócio
                  </label>
                  <input
                    type="text"
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    placeholder="Ex: Clínica, SaaS, Imobiliária..."
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#ef233c]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                    Versão
                  </label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                  Nome do Ativo
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Template: Dashboard SaaS / Prompt: VSL Clínica de Estética"
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#ef233c]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                  Resumo / Finalidade
                </label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Breve resumo da finalidade e resultado..."
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#ef233c]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="UI/UX, NEXT.JS, TAILWIND, AI, CONVERSÃO"
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#ef233c]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#777780] uppercase mb-1">
                  Conteúdo / Código / Prompt
                </label>
                <textarea
                  required
                  rows={6}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Cole aqui o prompt, código do componente React, template ou script..."
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] p-3 font-mono text-xs text-white outline-none focus:border-[#ef233c] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setNewItemOpen(false)}
                  className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-[#8a8a93] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#ef233c] px-5 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition"
                >
                  Salvar no Arsenal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Importar JSON de Templates / Snippets */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#101012] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef233c] font-semibold">
                  IMPORTAÇÃO EM MASSA
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  Importar Componentes e Templates
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-[#777780] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#777780] leading-relaxed">
              Cole aqui a estrutura JSON dos seus componentes ou templates salvos em zip para injetar diretamente no seu banco de produção:
            </p>

            <form onSubmit={handleImportJson} className="space-y-3.5">
              <textarea
                required
                rows={9}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder={`[\n  {\n    "name": "Componente: Hero Glow",\n    "type": "componente",\n    "niche": "SaaS",\n    "version": "v1.0",\n    "summary": "Hero interativo com glow vermelho e framer-motion",\n    "tags": ["REACT", "TAILWIND"],\n    "body": "export default function Hero() { ... }"\n  }\n]`}
                className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] p-3 font-mono text-xs text-white outline-none focus:border-[#ef233c] resize-y"
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-[#8a8a93] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#ef233c] px-5 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(239,35,60,0.3)] hover:bg-[#ff3b50] transition"
                >
                  Importar para o Arsenal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
