# Victor AI Engineer - Soluções Digitais | Roadmap & TODO

Este arquivo serve como o mapa de execução do projeto. Ele descreve as etapas concluídas e as próximas fases de evolução técnica para transformar a plataforma de recrutamento e prospecção em um sistema SaaS robusto.

---

## 🚀 Concluído (Fase 1: Frontend MVP Imersivo)

### Sprint 1: Setup do Projeto & Design System
- [x] Inicializar o projeto Next.js 16+ com TypeScript e Tailwind CSS v4 na raiz do projeto
- [x] Configurar variáveis globais de tema de cores (Azul Elétrico, Verde Sucesso, Branco/Slate e Dark Cyber) no CSS
- [x] Importar e configurar fontes Google (Outfit para display/títulos e Inter para leitura) no layout principal
- [x] Implementar configurações de Glassmorphism, grids virtuais e transições dinâmicas de tema no globals.css
- [x] Integrar suporte nativo a class-based dark mode com `@custom-variant dark` no Tailwind v4 para evitar piscar de tela (flash)
- [x] Instalar e testar pacotes de animação/gráficos (`framer-motion`, `gsap`, `@gsap/react`, `lucide-react`, `recharts`)
- [x] Validar builds de compilação em ambiente Next.js Turbopack

### Sprint 2: Hero Imersivo & Branding (Victor AI)
- [x] Desenvolver Header/Navbar flutuante com blur ao dar scroll, links de âncoras e botão dinâmico de troca de tema (Lua/Sol)
- [x] Implementar logotipo geométrico estilizado "V" baseado nas cores da marca e fontes dinâmicas
- [x] Criar Hero Section com proposta de valor, badges de oportunidade e CTAs dinâmicos
- [x] Construir Mockup de Laptop interativo em CSS/Framer Motion exibindo um painel digital fictício da agência
- [x] Garantir legibilidade em modo claro e escuro e persistir a preferência no localStorage

### Sprint 3: Seção "Como Funciona" & Prospecção Local
- [x] Criar timeline de passos animada detalhando o fluxo de trabalho do parceiro prospector
- [x] Desenvolver o Simulador de Prospecção (Mapa conceitual interativo da cidade de Franca-SP)
- [x] Implementar 5 pins com negócios que carecem de presença digital (Pizzaria, Clínica, Boutique, Academia, Oficina)
- [x] Construir o painel lateral que detalha a perda financeira de cada empresa e a comissão potencial (única e recorrente)
- [x] Integrar clique do pin para pré-preencher o formulário de indicações automaticamente

### Sprint 4: Calculadora de Comissão & Dashboard
- [x] Criar sliders interativos de simulação para 4 categorias de serviço (Sites, WhatsApp Zap, Sistemas Web, Chatbots de IA)
- [x] Implementar cálculos automáticos de ganhos imediatos (Pix Setup) e acumulados recorrentes mensais
- [x] Integrar gráficos de barras dinâmicos (`recharts`) exibindo a progressão acumulada em 6 meses (efeito bola de neve)
- [x] Tratar a renderização do gráfico do lado do cliente (client-side hydration) para evitar quebras de carregamento no Next.js SSR

### Sprint 5: Portal de Captação & Onboarding Hub
- [x] Desenvolver formulário completo para indicação de lead (Dados da Empresa, Contatos e Chave Pix do parceiro)
- [x] Salvar e persistir novos leads localmente no `localStorage` simulando banco de dados
- [x] Criar a visualização da listagem de leads do parceiro ("Minhas Indicações") com badges de status de negócio (Pendente, Fechado, Em Análise)
- [x] Desenvolver o tutorial interativo de Onboarding divido por abas explicando como fazer auditorias rápidas em empresas locais

### Sprint 6: Polimento, Responsividade & Otimização
- [x] Desenvolver animação de decoder/matrix cyberpunk (`TextScramble`) aplicada à palavra principal "TECNOLOGIA" no Hero
- [x] Validar responsividade em dispositivos móveis (mobile layout de formulários, mapa e calculadora)
- [x] Otimizar metadados SEO, descrições OpenGraph em português (PT-BR) no layout raiz
- [x] Implementar correções de imports de ícones de marca substituindo por SVGs inline nativos no Footer
- [x] Executar build final para deploy de produção na Vercel

---

## 🛠️ Próximas Etapas (Fase 2: Infraestrutura SaaS & Back-End)

### Sprint 7: Core Infrastructure & Database Setup
- [x] Configurar esquema de banco de dados (Schema) em schema.sql para as tabelas `partners` e `leads`
- [x] Criar cliente de banco de dados híbrido (db.ts) com suporte a Supabase e persistência offline-first
- [x] Implementar sistema de Autenticação e sessão global via contexto React (`useAuth.tsx`)
- [x] Criar páginas de Login (`/login`) e Cadastro (`/signup`) com tratamentos de formulário
- [x] Implementar rotas protegidas por ciclo de montagem de sessão cliente-side

### Sprint 8: Área Logada & Painel do Parceiro (Dashboard)
- [x] Desenvolver portal completo do parceiro em `/dashboard`
- [x] Conectar as estatísticas do painel (Indicações, Fechados, Ganhos Pix) ao banco/local adapter
- [x] Implementar formulário modal para novas indicações diretamente pela área logada
- [x] Integrar auto-preenchimento e bloqueio de inputs de dados do parceiro na Home quando logado
- [x] Implementar cálculo dinâmico de níveis do parceiro (gamificação) no dashboard com base nos contratos fechados

### Sprint 9: Painel Administrativo do Victor (Owner Portal)
- [x] Criar portal administrativo em `/admin` restrito ao e-mail comercial vitorborsari11@gmail.com
- [x] Implementar controle estatístico global de leads, contratos fechados e comissões pagas/pendentes
- [x] Desenvolver tabela consolidada de todos os leads enviados com filtros por termo de pesquisa e status
- [x] Implementar dropdown de alteração de status comercial com persistência no banco (db.ts)
- [x] Exibir dados do parceiro (Nome, Celular, Pix) com link direto para o WhatsApp do aluno para envio da comissão

### Sprint 10: Automações, Alertas & Webhooks
- [x] Criar módulo de disparos e webhooks HTTP em notifications.ts integrado com Evolution API e Z-API
- [x] Habilitar modo de simulação visual (console/toast) na ausência de chaves de ambiente
- [x] Implementar alerta automático no WhatsApp do Admin quando um novo lead é enviado por alunos
- [x] Implementar notificação no WhatsApp do Parceiro quando o status da indicação comercial mudar
- [x] Vincular gatilhos de WhatsApp no db.ts nas ações de criação e modificação de leads


### Sprint 11: Auditor de Vendas Automático (Google Places Integration)
- [x] Desenvolver mecanismo de análise e pontuação digital (auditor.ts) baseado nas necessidades indicadas
- [x] Criar página pública e interativa de Relatório de Maturidade Digital em `/audit/[id]`
- [x] Configurar folha de estilo @media print A4 no globals.css para exportação de PDF vetorial nativa e leve
- [x] Integrar botão "Salvar Relatório em PDF" e link de acesso rápido na listagem de leads do Dashboard do Aluno
- [x] Integrar link de abertura rápida do relatório comercial na listagem do painel Admin do Victor


### Sprint 12: Gamificação, Leaderboard & Escola de Vendas
- [x] Desenvolver página /ranking exibindo os líderes e comissões do mês e geral
- [x] Integrar barra de progresso e níveis de consultor no dashboard com recompensas de payout
- [x] Criar hub de manuais e scripts de abordagem comercial por nicho em /academy
- [x] Integrar redirecionamentos de menus do dashboard para as páginas /academy e /ranking
- [x] Validar compilação final em ambiente de produção (Next.js build) com todas as 12 sprints prontas

- [ ] Realizar auditoria de segurança (SQL Injection, CORS, Rate Limiters) e lançar versão de produção
