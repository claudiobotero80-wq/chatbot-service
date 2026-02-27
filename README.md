# Chatbot Service — Juan Paz Studio

Sistema de chatbot as-a-service para PyMEs. Configuración rápida, sin código para el cliente.

## Arquitectura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Widget JS   │────▶│  n8n Webhook  │────▶│  Router de      │
│  (embebible) │◀────│  (backend)    │◀────│  intenciones    │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                                          │
       ▼                                          ▼
┌─────────────┐                          ┌─────────────────┐
│  Next.js     │                          │  Config JSON     │
│  Landing     │                          │  (por cliente)   │
└─────────────┘                          └─────────────────┘
```

### Componentes

- **`/backend`** — Workflows n8n exportados (JSON), webhooks, lógica de routing
- **`/widget`** — Script JS embebible (`<script>` tag). Configurable via `data-*` attributes
- **`/landing`** — Next.js landing page de servicio (pricing, demo, CTA)
- **`/docs`** — Documentación: onboarding, configuración, troubleshooting

### Stack

| Capa | Tech |
|------|------|
| Backend/Logic | n8n (self-hosted) + webhooks |
| Widget | Vanilla JS, iframe-based |
| Landing | Next.js + Vercel |
| Config | JSON por cliente |

### Pricing modelo

- **Setup:** $500 USD (one-time)
- **Mantenimiento:** $200 USD/mes
- **Incluye:** WhatsApp + Web widget, hasta 10 FAQs, soporte básico

### Quick Start

```bash
# Clonar
git clone https://github.com/claudiobotero80-wq/chatbot-service.git

# Landing (dev)
cd landing && npm install && npm run dev
```

---

**Juan Paz Studio** — Automatización inteligente para negocios reales.
