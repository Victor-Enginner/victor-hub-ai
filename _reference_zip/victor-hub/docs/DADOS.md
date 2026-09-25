# Banco de dados — contrato

Hoje não existe banco remoto. O banco é o navegador.

- Chave: `victor-hub-os-v1` (`js/config.js` → `storageKey`)
- Formato: um JSON, `version: 1`
- Exportar em Configurações gera esse JSON. Esse arquivo é o banco portátil.
- Importar substitui o estado local. Não há merge.

Não troque a chave sem migração. Quem já abriu o sistema perde o cockpit se a chave mudar.

## Como ligar um banco seu, depois

Só quando o dono pedir. O ponto de troca é `load()` e `persist()` em `js/store.js`. O resto do sistema fala com `window.VH`. Não espalhe `fetch` pelas telas.

Contrato do adaptador:

1. `load()` devolve o mesmo objeto da semente, ou o JSON importado.
2. `persist()` grava o objeto inteiro. Falha local não pode apagar a cópia anterior.
3. `exportState()` continua devolvendo o JSON completo.
4. `VHConfig.dataMode` passa de `"local"` para `"api"` e `apiBase` recebe a origem do seu servidor.
5. Segredo de banco fica no servidor, nunca em `js/config.js` e nunca no front.

Enquanto `dataMode` for `"local"`, o validate recusa tratar o projeto como se já tivesse API.

## Forma do estado

```text
version            1
seededAt           ISO
welcomed           boolean
seen               string[]
profile            name, workspace, role, version, objective, whatsapp, city, domain
prefs              density, alerts, reduceMotion, mode
funnel             qualificados, propostas, negociacoes, fechamentos
integrations       openai, github, n8n, stripe → { status, hint }
clients[]          id, name, initials, company, email, phone, stage, value, contactAt, nextAction, projectId, notes, timeline[]
projects[]         id, letter, name, clientId, status, progress, value, paid, milestone, deadline, critical, stack[], brief, notes, milestones[]
tasks[]            id, title, projectId, automationId?, tag, priority, time, block, date, done, order, detail
automations[]      id, name, platform, status, runs, lastRun, successRate, avg, summary, trigger?, error?, nodes[], fixes, logs[]
arsenal[]          id, type, version, name, summary, tags[], uses, body, star?
movements[]        id, title, kind, amount, status, cadence, date, projectId?, note
pulse              number[8]
activity[]         { at, text }
```

Etapas de cliente: `lead`, `qualificado`, `proposta`, `negociacao`, `ativo`, `perdido`.
Status de projeto: `descoberta`, `producao`, `revisao`, `entregue`.

A semente em `js/data.js` é operacional do cockpit (Lux, Alpha AI, Nexus; Camila, Rafael Lima, Marina; pipeline R$ 84.500; recebido R$ 6.000). Não é depoimento público. Não publique esses nomes na página de vendas como prova social.
