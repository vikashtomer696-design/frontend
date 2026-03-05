# Automation Platform (n8n-style)

Production-oriented starter architecture for a modular workflow automation platform with:

- Flutter mobile-first client
- Node.js + Express backend
- Firestore persistence
- Redis + BullMQ execution queue
- Pluggable workflow nodes

See `docs/architecture.md` for full details.

## Quick start (backend)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Included node plugins

- Webhook Trigger
- HTTP Request
- Telegram Send Message
- OpenAI API
- Delay Node
- If Condition Node

## API surface

- `POST /api/v1/workflows`
- `PUT /api/v1/workflows/:workflowId`
- `POST /api/v1/workflows/:workflowId/execute`
- `GET /api/v1/workflows/:workflowId/executions`
- `GET /api/v1/executions/:executionId/logs`
- `POST /api/v1/webhooks/:workflowId`
