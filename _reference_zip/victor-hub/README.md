# Victor Hub AI

Site de vendas e Production OS do Victor. App estático, preto e vermelho, sem framework.

Se você é o agente do VS Code: leia `docs/AGENTE.md` e rode `python3 scripts/validate.py` antes de editar. A validação tem que terminar em `VALIDATION PASS`.

## Rodar

```bash
cd victor-hub
python3 server.py
```

Abra `http://localhost:8080`.

- `/` — site público
- `/sistema` — Central de Comando
- `/sistema/projetos` `/clientes` `/tarefas` `/automacoes` `/arsenal` `/financeiro` `/configuracoes`
- `/health` — só no servidor Python, para a validação

Porta: `PORT` (padrão 8080). Veja `.env.example`.

## O que é seu

| Controle | Hoje | Onde muda |
| --- | --- | --- |
| Banco | `localStorage`, chave `victor-hub-os-v1` | `js/config.js` e, no futuro, `load()` / `persist()` em `js/store.js`. Contrato em `docs/DADOS.md` |
| Domínio | ainda não apontado | `js/config.js` → `publicOrigin`. Rewrite de `/sistema` em `server.py`, `_redirects` e `vercel.json` |
| Sistema | esta pasta | não recriar em outro framework sem pedido |

O backup JSON de Configurações é o banco portátil. Exporte antes de trocar de máquina.

## O que o cockpit faz

- O comando calcula a próxima ação.
- Projetos abre em tabela ou quadro. O clique entra na sala.
- Clientes abre em radar ou pipeline.
- O arsenal executa uma peça em cima de um projeto real.
- Configurações registra o domínio pretendido e copia o briefing para o agente.

Nomes e valores da semente são operacionais: Lux, Alpha AI, Nexus; Camila, Rafael Lima, Marina; pipeline R$ 84.500; recebido R$ 6.000. Não são depoimento público.

A página de vendas não cita cliente que o Victor não atendeu.
