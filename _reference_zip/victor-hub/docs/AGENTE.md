# Instruções para o agente do VS Code

Leia este arquivo inteiro antes de editar. Depois rode a validação. Se ela falhar, pare e mostre o erro. Não "conserte" inventando banco, domínio ou cliente.

```bash
python3 scripts/validate.py
```

A saída tem que terminar em `VALIDATION PASS`.

## O que é este projeto

Victor Hub AI é o site de vendas e o Production OS do Victor. É um app estático, sem framework.

- `/` serve `index.html`
- `/sistema` e `/sistema/*` servem `sistema.html`
- O servidor de referência é `server.py` (porta `PORT`, padrão 8080)
- Em Netlify, `_redirects` faz o mesmo rewrite. Em Vercel, `vercel.json`.

Não recrie o sistema em React, Next ou banco novo sem o Victor pedir. O trabalho é assumir este código.

A trava de entrega não é um bug. Avançar um projeto para `entregue` com marco, tarefa ou saldo aberto abre o modal e só passa com "Entregar mesmo assim". Não remova isso.

## Propriedade — três controles

### Domínio

Ainda não há domínio de produção. `js/config.js` → `publicOrigin` fica vazio até o Victor informar o domínio.

Quando ele informar:

1. Grave em `js/config.js` (`publicOrigin`, sem barra no final).
2. Aponte o DNS para o host que servir esta pasta.
3. Garanta o rewrite de `/sistema/*` para `sistema.html`. Sem isso o OS abre a home no refresh.
4. Não invente um domínio.

O preview em que este zip foi feito não é o domínio. Não fixe `localhost` nem o host do preview no código.

### Banco

Hoje o banco é `localStorage`, chave `victor-hub-os-v1`. O backup JSON exportado em Configurações é a cópia portátil.

Não crie Postgres, Supabase, Firebase ou Prisma neste passo. O contrato está em `docs/DADOS.md`. Quando o Victor pedir o banco dele, troque só `load()` e `persist()` em `js/store.js` e mantenha o formato do JSON.

`dataMode` permanece `"local"` até esse adaptador existir e o validate ser atualizado de propósito.

### Sistema

O cockpit está em `js/os.js`. O estado está em `js/store.js`. A semente está em `js/data.js`. A identidade pública (marca, WhatsApp, domínio) está em `js/config.js`.

Não duplique lógica de gravação fora do store. Não quebre o IIFE: o arquivo `js/os.js` tem que terminar uma única vez em `boot();` e `})();`.

## Proibido

- Recolocar depoimento, estrela de review ou cliente falso na página de vendas. Rafael Nogueira e Nortech Soluções foram removidos porque o Victor nunca prestou esse serviço. Não volte.
- Publicar Camila Rocha, Rafael Lima ou Marina Costa como prova social. Eles são semente operacional do cockpit.
- Mudar os valores de referência da semente (pipeline R$ 84.500, recebido R$ 6.000, custo R$ 1.380) sem pedido.
- Gravar chave de API, token ou senha no repositório.
- Tratar o modo público como login. Ele só trava edição no navegador.

## Como validar no VS Code

```bash
python3 -m py_compile server.py scripts/validate.py
python3 scripts/validate.py
```

Abra `http://localhost:8080` e `http://localhost:8080/sistema`. Confira:

- A home não tem faixa vermelha de depoimento.
- O comando mostra o cartão Agora.
- Projetos alterna Tabela e Quadro. O clique abre a sala, não só um drawer.
- Clientes alterna Radar e Pipeline.
- Arsenal tem Executar no projeto.
- Configurações mostra banco local, chave e domínio ainda não definido.
- Exportar backup baixa um JSON com `version: 1`.

## Mapa

| Arquivo | Função |
| --- | --- |
| `js/config.js` | Domínio, WhatsApp, chave do banco, modo de dados |
| `js/data.js` | Semente. Datas relativas a hoje |
| `js/store.js` | Única escrita. Export, import, regras |
| `js/os.js` | Interface do sistema |
| `js/site.js` | Home. Links de WhatsApp saem do config |
| `server.py` | Servidor local e `/health` |
| `scripts/validate.py` | Porta de entrada do agente |
| `docs/DADOS.md` | Contrato do banco |
