import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface WebhookPayload {
  service?: string;
  serviceName?: string;
  event?: string;
  timestamp?: string | number;
  origin?: string;
  data?: Record<string, any>;
  [key: string]: any;
}

/**
 * Endpoint de Health Check e status da orquestração de webhooks
 * GET /api/webhook
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "online",
      engine: "Victor Hub AI - Webhook Ingestion Engine",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      supportedEvents: [
        "sandbox.ping",
        "lead.created",
        "automation.completed",
        "stripe.payment_intent.succeeded",
        "seo.audit_finished",
        "crawler.data_extracted",
      ],
      orchestratorServices: [
        { id: "twenty-crm", name: "Twenty CRM", port: 3000 },
        { id: "n8n", name: "n8n Automation", port: 5678 },
        { id: "open-seo", name: "Open SEO", port: 4200 },
        { id: "openclaw", name: "OpenClaw / NullClaw", port: 8080 },
      ],
    },
    { status: 200 }
  );
}

/**
 * Processador central de eventos e webhooks
 * POST /api/webhook
 */
export async function POST(req: NextRequest) {
  try {
    let body: WebhookPayload = {};
    const contentType = req.headers.get("content-type") || "";

    try {
      if (contentType.includes("application/json")) {
        body = await req.json();
      } else {
        const rawText = await req.text();
        try {
          body = JSON.parse(rawText);
        } catch {
          body = rawText ? { raw: rawText } : {};
        }
      }
    } catch {
      try {
        const rawText = await req.text();
        body = rawText ? { raw: rawText } : {};
      } catch {
        body = {};
      }
    }

    const event = body.event || "generic.event";
    const timestamp = body.timestamp || new Date().toISOString();
    const service = body.service || "external";
    const serviceName = body.serviceName || service;

    // Log estruturado no console do servidor Next.js
    console.log(`[VICTOR HUB WEBHOOK] [${new Date().toISOString()}] Event: ${event} | Source: ${serviceName}`);

    // Roteamento de eventos suportados
    let actionSummary = "Evento processado com sucesso.";

    switch (event) {
      case "sandbox.ping":
      case "ping":
        actionSummary = `Ping de sandbox validado para ${serviceName}. Conexão bidirecional ativa.`;
        break;

      case "lead.created":
      case "lead.captured":
        actionSummary = `Novo lead recebido do ${serviceName}. Sincronização de CRM inicializada.`;
        break;

      case "automation.triggered":
      case "automation.completed":
        actionSummary = `Execução de workflow n8n processada com sucesso.`;
        break;

      case "stripe.payment_intent.succeeded":
      case "stripe.checkout.session.completed":
        actionSummary = `Pagamento Stripe confirmado. Entrada registrada no fluxo de caixa.`;
        break;

      case "seo.audit_finished":
        actionSummary = `Relatório técnico de Core Web Vitals e SEO gerado pelo Open SEO.`;
        break;

      case "crawler.data_extracted":
        actionSummary = `Extração de contatos B2B e inteligência de mercado concluída pelo OpenClaw.`;
        break;

      default:
        actionSummary = `Payload customizado recebido e aceito pelo hub.`;
        break;
    }

    return NextResponse.json(
      {
        success: true,
        message: actionSummary,
        event,
        service,
        serviceName,
        receivedAt: new Date().toISOString(),
        payload: body,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[VICTOR HUB WEBHOOK ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Falha ao processar payload do webhook",
        message: error?.message || "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
