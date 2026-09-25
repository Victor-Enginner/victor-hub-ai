"use client";

import { useState } from "react";
import Link from "next/link";
import DavidAsciiCanvas from "@/components/david-ascii-canvas";
import {
  Zap,
  Layers,
  Cpu,
  Workflow,
  Rocket,
  ArrowRight,
  Check,
  LayoutGrid,
  MessageCircle,
  ShieldCheck,
  Lock,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [planModalOpen, setPlanModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-[#f7f7f8]">
      {/* Background DAVID ASCII Matrix cobrindo a tela inteira (Full Page / Fullscreen) */}
      <DavidAsciiCanvas
        imageSrc="/david.jpg"
        opacity={0.32}
        className="fixed inset-0 z-0 h-screen w-screen pointer-events-none"
      />

      {/* Overlay gradiente para garantir 100% de legibilidade em toda a rolagem */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/80" />

      {/* Luzes difusas de ambiente otimizadas via Radial Gradient (Zero GPU Blur Lag) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[-10%] h-[620px] w-[620px] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239, 35, 60, 0.12) 0%, rgba(239, 35, 60, 0) 70%)",
          }}
        />
        <div
          className="absolute right-[-10%] top-1/3 h-[450px] w-[450px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239, 35, 60, 0.07) 0%, rgba(239, 35, 60, 0) 70%)",
          }}
        />
      </div>

      {/* Header Sticky */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/[0.09] bg-[#090909]/75 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef233c] text-white shadow-[0_0_22px_rgba(239,35,60,0.4)]">
              <Zap className="h-4 w-4" />
            </span>
            <span className="font-display text-[16px] font-extrabold tracking-tight text-white">
              Victor Hub <span className="text-[#ef233c]">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <a href="#servicos" className="text-sm text-[#a1a1aa] transition hover:text-white">
              Serviços
            </a>
            <a href="#como" className="text-sm text-[#a1a1aa] transition hover:text-white">
              Como funciona
            </a>
            <a href="#planos" className="text-sm text-[#a1a1aa] transition hover:text-white">
              Planos
            </a>
            <a
              href="https://wa.me/5516982141822?text=Ol%C3%A1%20Victor!%20Quero%20um%20or%C3%A7amento%20—%20Victor%20Hub%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#a1a1aa] transition hover:text-white"
            >
              Contato
            </a>
          </div>

          <Link
            href="/sistema"
            className="focus-ring flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#ef233c] hover:bg-[#ef233c]/10"
          >
            Entrar <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28">
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#ef233c] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ef233c]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#a1a1aa]">
                Disponível para novos projetos
              </span>
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl text-white">
              Arsenal Pessoal
              <br />
              de{" "}
              <span className="bg-gradient-to-b from-[#ff5566] to-[#ef233c] bg-clip-text text-transparent">
                Produção Real
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#a1a1aa] sm:text-xl">
              Sou <span className="font-semibold text-white">Victor</span> — Dev Web &amp; Designer Full Stack.
              Transformo posicionamento digital em código, interfaces animadas e sistemas que vendem.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/sistema"
                className="focus-ring group flex h-12 items-center gap-2 rounded-full bg-[#ef233c] px-7 text-sm font-bold text-white shadow-[0_0_40px_rgba(239,35,60,0.35)] transition hover:bg-[#ff3b50]"
              >
                Acessar o Sistema
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#planos"
                className="focus-ring flex h-12 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-7 text-sm font-semibold text-[#e4e4e7] transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <LayoutGrid className="h-4 w-4" /> Ver planos
              </a>
            </div>

            {/* Stack Banner */}
            <div className="mt-16 w-full border-y border-white/[0.06] bg-white/[0.015] py-5">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#66666f]">
                  Stack &amp; ferramentas
                </span>
                {["React", "Next.js", "Three.js", "Figma", "Prompt Eng", "Automações"].map((tech) => (
                  <span key={tech} className="font-display text-sm font-semibold text-[#a1a1aa]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Mockup Frame do Cockpit (Idêntico ao do site publicado) */}
            <div className="mx-auto mt-14 w-full max-w-4xl text-left">
              <div className="relative rounded-2xl border border-white/[0.14] bg-[#0c0c0e] shadow-[0_0_60px_rgba(239,35,60,0.12)] overflow-hidden">
                {/* Window topbar */}
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#08080a] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ef233c]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#66666f]">
                    victor hub os · comando
                  </div>
                  <div className="w-8" />
                </div>

                {/* Window body */}
                <div className="grid grid-cols-12 min-h-[300px]">
                  {/* Mini Sidebar */}
                  <div className="hidden sm:block col-span-3 border-r border-white/[0.08] bg-[#08080a]/60 p-3 space-y-1">
                    <div className="rounded-lg bg-[#ef233c]/15 px-3 py-1.5 text-xs font-bold text-[#ef233c]">
                      Comando
                    </div>
                    {["Projetos", "Clientes", "Tarefas", "Automações", "Arsenal"].map((tab) => (
                      <div key={tab} className="rounded-lg px-3 py-1.5 text-xs text-[#66666f]">
                        {tab}
                      </div>
                    ))}
                  </div>

                  {/* Mini Main Content */}
                  <div className="col-span-12 sm:col-span-9 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-[9px] uppercase text-[#ef233c] tracking-wider">
                          COMMAND CENTER
                        </div>
                        <h4 className="text-base font-bold text-white">Central de Comando</h4>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    {/* 4 Mini KPIs */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <div className="font-mono text-[9px] text-[#66666f]">Projetos</div>
                        <div className="text-base font-bold text-white">3</div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <div className="font-mono text-[9px] text-[#66666f]">Tarefas</div>
                        <div className="text-base font-bold text-white">4</div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <div className="font-mono text-[9px] text-[#66666f]">Pipeline</div>
                        <div className="text-xs sm:text-sm font-bold text-white">R$ 84.500</div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <div className="font-mono text-[9px] text-[#66666f]">Recebido</div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-400">R$ 6.000</div>
                      </div>
                    </div>

                    {/* 2 Live Tasks Preview */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-xs">
                        <span className="font-medium text-white">Preparar proposta Portal Lux</span>
                        <span className="font-mono text-[10px] text-amber-400">17:00 · alta</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-xs">
                        <span className="font-medium text-white">Debug Webhook Stripe → Discord</span>
                        <span className="font-mono text-[10px] text-[#ef233c] font-bold">12:00 · crítica</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços Section */}
        <section id="servicos" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ef233c]">
              Serviços
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Tudo que sua marca precisa em um único hub
            </h2>
            <p className="mt-4 text-[#8a8a93]">
              Do posicionamento digital ao código em produção — serviços completos para empresas que querem escalar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel-hover group rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ef233c]/25 bg-[#ef233c]/10 text-[#ef233c]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">UI/UX &amp; Sites Animados</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8a8a93]">
                Interfaces sob medida com micro-interações, motion design e experiências 3D imersivas que elevam a percepção de valor da marca e convertem visitantes em clientes.
              </p>
            </div>

            <div className="panel-hover group rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ef233c]/25 bg-[#ef233c]/10 text-[#ef233c]">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Arquitetura de Software</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8a8a93]">
                Sistemas robustos, escaláveis e bem documentados, construídos com padrões da indústria e código limpo de ponta a ponta.
              </p>
            </div>

            <div className="panel-hover group rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ef233c]/25 bg-[#ef233c]/10 text-[#ef233c]">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Automações</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8a8a93]">
                Fluxos que eliminam tarefas repetitivas e conectam suas ferramentas de negócio para operar no piloto automático.
              </p>
            </div>

            <div className="panel-hover group rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ef233c]/25 bg-[#ef233c]/10 text-[#ef233c]">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Landing Pages</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8a8a93]">
                Páginas de alta conversão, feitas para vender enquanto você dorme — copy, design e performance alinhados.
              </p>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ef233c]">
              Como funciona
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Da compra ao sistema, em minutos
            </h2>
            <p className="mt-4 text-[#8a8a93]">
              Um fluxo SaaS de verdade: escolha, acesse e opere seu negócio no mesmo lugar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <div className="font-display text-4xl font-extrabold text-[#ef233c]/30">01</div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">Escolha seu plano</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8a8a93]">
                Da presença digital ao sistema completo, você começa pelo nível certo para o momento do seu negócio.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <div className="font-display text-4xl font-extrabold text-[#ef233c]/30">02</div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">Acesse o Hub</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8a8a93]">
                Entre no Victor Hub OS — seu painel de comando com projetos, clientes, automações e arsenal.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <div className="font-display text-4xl font-extrabold text-[#ef233c]/30">03</div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">Opere e escale</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8a8a93]">
                Acompanhe entregas, finanças e automações em um único lugar, com tudo sincronizado em tempo real.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback B2B & Padrão de Engenharia */}
        <section className="bg-[#ef233c] py-20 text-black">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-black">
              <Lock className="h-3.5 w-3.5" />
              Padrão Operacional &amp; Garantia Técnica
            </div>

            <h3 className="mt-6 font-display text-2xl font-extrabold leading-snug sm:text-3xl">
              “Não usamos templates genéricos nem código descartável. Toda arquitetura é construída com padrão internacional de engenharia, foco em velocidade e inteligência prática para gerar receita.”
            </h3>

            {/* 3 Pilares de Transparência e Confiança */}
            <div className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-black/15 bg-black/5 p-4 backdrop-blur-sm">
                <div className="font-bold text-black text-sm">Código 100% Proprietário</div>
                <div className="mt-1 text-xs text-black/80">
                  Sem plataformas engessadas. O repositório e os sistemas pertencem à sua empresa.
                </div>
              </div>
              <div className="rounded-xl border border-black/15 bg-black/5 p-4 backdrop-blur-sm">
                <div className="font-bold text-black text-sm">Sigilo &amp; NDA Garantido</div>
                <div className="mt-1 text-xs text-black/80">
                  Seus dados estratégicos, modelos de negócio e regras de automação são confidenciais.
                </div>
              </div>
              <div className="rounded-xl border border-black/15 bg-black/5 p-4 backdrop-blur-sm">
                <div className="font-bold text-black text-sm">Padrão Internacional</div>
                <div className="mt-1 text-xs text-black/80">
                  Next.js de alta performance, estética cyberpunk refinada e foco em conversão.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planos Section */}
        <section id="planos" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ef233c]">
              Planos
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Planos sob medida para seu negócio
            </h2>
            <p className="mt-4 text-[#8a8a93]">
              Comece com o essencial, escale conforme sua empresa cresce.
            </p>
          </div>

          <div className="grid items-start gap-5 md:grid-cols-3">
            {/* Plano 1 */}
            <div className="relative flex flex-col rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <h3 className="font-display text-lg font-bold text-white">Presença</h3>
              <p className="mt-2 min-h-[40px] text-xs text-[#8a8a93]">
                Para quem precisa validar rápido no digital.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-[#66666f]">R$</span>
                <span className="font-display text-5xl font-extrabold tracking-tight text-white">1.497</span>
                <span className="text-xs text-[#66666f]">/projeto</span>
              </div>
              <ul className="mt-7 flex-1 space-y-3">
                {[
                  "1 Landing Page premium",
                  "Design responsivo",
                  "Otimização de conversão",
                  "Suporte via WhatsApp",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#d4d4d8]">
                    <Check className="h-4 w-4 shrink-0 text-[#ef233c]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/5516982141822?text=Ol%C3%A1%20Victor!%20Quero%20um%20or%C3%A7amento%20—%20Victor%20Hub%20AI"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-8 flex h-11 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-sm font-bold uppercase tracking-wider text-white transition hover:border-white/25"
              >
                Começar
              </a>
            </div>

            {/* Plano 2 (Destaque) */}
            <div className="relative flex flex-col rounded-2xl border border-[#ef233c] bg-[#ef233c]/[0.05] p-7 shadow-[0_0_50px_rgba(239,35,60,0.12)] md:-mt-3">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ef233c] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
                Mais escolhido
              </span>
              <h3 className="font-display text-lg font-bold text-white">Escala Digital</h3>
              <p className="mt-2 min-h-[40px] text-xs text-[#8a8a93]">
                Para empresas que querem crescer com posicionamento forte.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-[#66666f]">R$</span>
                <span className="font-display text-5xl font-extrabold tracking-tight text-white">4.997</span>
                <span className="text-xs text-[#66666f]">/projeto</span>
              </div>
              <ul className="mt-7 flex-1 space-y-3">
                {[
                  "Site institucional completo",
                  "Animações &amp; 3D sob medida",
                  "Automações de captação",
                  "Acesso ao Victor Hub OS",
                  "Suporte prioritário",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#d4d4d8]">
                    <Check className="h-4 w-4 shrink-0 text-[#ef233c]" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setPlanModalOpen(true)}
                className="focus-ring mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-[#ef233c] text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ff3b50]"
              >
                Assinar e acessar
              </button>
            </div>

            {/* Plano 3 */}
            <div className="relative flex flex-col rounded-2xl border border-white/[0.09] bg-white/[0.02] p-7">
              <h3 className="font-display text-lg font-bold text-white">Sistema Completo</h3>
              <p className="mt-2 min-h-[40px] text-xs text-[#8a8a93]">
                Para empresas que precisam de sistemas e arquitetura sob medida.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-[#66666f]">R$</span>
                <span className="font-display text-5xl font-extrabold tracking-tight text-white">12.900</span>
                <span className="text-xs text-[#66666f]">/projeto</span>
              </div>
              <ul className="mt-7 flex-1 space-y-3">
                {[
                  "Sistema web sob medida",
                  "Arquitetura escalável",
                  "Integrações &amp; API",
                  "Painel operacional dedicado",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#d4d4d8]">
                    <Check className="h-4 w-4 shrink-0 text-[#ef233c]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/5516982141822?text=Ol%C3%A1%20Victor!%20Quero%20um%20or%C3%A7amento%20—%20Victor%20Hub%20AI"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-8 flex h-11 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-sm font-bold uppercase tracking-wider text-white transition hover:border-white/25"
              >
                Falar com Victor
              </a>
            </div>
          </div>
        </section>

        {/* CTA Banner Final */}
        <section className="mx-auto max-w-4xl px-6 pb-28 text-center">
          <div className="glass rounded-3xl px-8 py-16">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
              Pronto para <span className="text-[#ef233c]">construir?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[#a1a1aa]">
              Acesse o Victor Hub OS e veja por dentro o sistema que organiza projetos, clientes, automações e finanças.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sistema"
                className="focus-ring flex h-12 items-center gap-2 rounded-full bg-[#ef233c] px-8 text-sm font-bold text-white shadow-[0_0_40px_rgba(239,35,60,0.35)] transition hover:bg-[#ff3b50]"
              >
                Entrar no sistema <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/5516982141822?text=Ol%C3%A1%20Victor!%20Quero%20um%20or%C3%A7amento%20—%20Victor%20Hub%20AI"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex h-12 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-8 text-sm font-semibold transition hover:border-white/25 text-white"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ef233c] text-white">
              <Zap className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-sm font-bold text-white">Victor Hub AI</span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#66666f]">
            © 2026 Victor Hub AI · Produção Real
          </p>
          <Link href="/sistema" className="text-xs text-[#a1a1aa] transition hover:text-white">
            Acessar o sistema →
          </Link>
        </div>
      </footer>

      {/* Modal Plano Escala Digital */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.15] bg-[#0c0c0e] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-3">
              <span className="font-mono text-[10px] uppercase text-[#ef233c] font-bold">Escala Digital</span>
              <button onClick={() => setPlanModalOpen(false)} className="text-[#8a8a93] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-display text-xl font-bold text-white">Assinar e entrar no Hub</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              O plano de R$ 4.997 inclui site institucional completo, animações 3D, automações de captação e acesso direto ao Victor Hub OS. A contratação segue via WhatsApp — o sistema, você pode explorar agora.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href="https://wa.me/5516982141822?text=Ol%C3%A1%20Victor!%20Quero%20o%20plano%20Escala%20Digital%20—%20Victor%20Hub%20AI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#ef233c] py-2.5 px-4 text-xs font-bold text-white hover:brightness-110 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Falar no WhatsApp</span>
              </a>
              <Link
                href="/sistema"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] py-2.5 px-4 text-xs font-semibold text-white hover:bg-white/[0.08] transition"
              >
                Ver o OS
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
