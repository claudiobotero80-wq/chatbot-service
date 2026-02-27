# WhatsApp Chatbot Template v1 — Guía de instalación

## Descripción
Template n8n reutilizable para chatbot WhatsApp rule-based (sin AI). Recibe mensajes via webhook, clasifica intención por keywords y responde automáticamente. Configurable por JSON para cada cliente.

## Requisitos
- n8n (self-hosted o cloud) v1.0+
- Cuenta de WhatsApp Business API (Meta, Twilio, o 360dialog)
- 15-30 minutos para configurar

## Instalación paso a paso

### 1. Importar workflow en n8n
1. Abrí n8n → menú → **Import from File**
2. Seleccioná `backend/n8n-whatsapp-template.json`
3. El workflow aparece con 4 nodos: Webhook → Parse → Router → Respond

### 2. Configurar datos del cliente
1. Copiá `backend/config/client-config.example.json` a `client-config.json`
2. Editá los campos:
   - `business_name`: nombre del negocio
   - `greeting`: mensaje de bienvenida
   - `hours`: horarios de atención
   - `faqs`: array de `{question, answer}` — `question` son keywords separadas por `|`
   - `handoff_message`: mensaje al derivar a humano
   - `fallback_message`: mensaje cuando no entiende
3. **Opción A (inline):** Pegá el JSON en el nodo "Intent Router" reemplazando el `config`
4. **Opción B (archivo externo):** Descomentá la línea `require('fs')` en el código del router

### 3. Conectar WhatsApp Business API

#### Meta (directo)
1. Meta Business Suite → WhatsApp → Configuration
2. Webhook URL: `https://tu-n8n.com/webhook/whatsapp-webhook`
3. Suscribite a: `messages`

#### Twilio
1. Twilio Console → Messaging → WhatsApp
2. Webhook URL: `https://tu-n8n.com/webhook/whatsapp-webhook` (POST)

### 4. Activar
1. Activá el workflow (toggle arriba a la derecha)
2. Enviá un mensaje de prueba
3. Verificá en Executions

## Clonar para nuevo cliente (<30 min)
1. Duplicá el workflow en n8n (o re-importá el JSON)
2. Cambiá el path del webhook (ej: `whatsapp-webhook-cliente2`)
3. Actualizá el `config` con los datos del nuevo cliente
4. Activá y conectá el nuevo número WhatsApp

## Intenciones soportadas

| Intent | Keywords | Respuesta |
|--------|----------|-----------|
| `greeting` | hola, buenas, hey | `greeting` del config |
| `hours` | horario, abierto, cierran | Horarios del config |
| `faq` | configurable por cliente | FAQ matcheado |
| `handoff` | humano, persona, alguien | `handoff_message` |
| `fallback` | cualquier otro | `fallback_message` |

## Roadmap
- v2: AI (OpenAI) para NLU
- v3: Multi-idioma
- v4: Analytics dashboard
