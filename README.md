# Automation Platform (n8n-style Architecture)

This repository now contains a production-oriented blueprint for an automation platform similar to n8n, with:

- **Mobile-first Flutter frontend** (`frontend_mobile/`)
- **Node.js + Express backend** (`backend/`)
- **Firestore persistence** for workflows, executions, logs, users, credentials
- **BullMQ + Redis queueing** for asynchronous execution
- **Modular node plugin system** for integrations

## Folder Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── firebase.ts
│   │   │   └── redis.ts
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── queue/
│   │   ├── engine/
│   │   │   ├── executionEngine.ts
│   │   │   ├── nodeRegistry.ts
│   │   │   └── nodes/plugins/
│   │   ├── types/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
├── frontend_mobile/
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart
│       ├── app/
│       ├── core/
│       └── features/
└── docs/
    └── architecture.md
```

## Core Workflow JSON Model

Workflows are saved as JSON documents with nodes + connections:

```json
{
  "id": "wf_123",
  "name": "Telegram Alert",
  "ownerId": "user_001",
  "triggerType": "webhook",
  "webhookPath": "incoming-alert",
  "isActive": true,
  "nodes": [
    { "id": "1", "type": "webhookTrigger", "name": "Webhook", "config": {} },
    { "id": "2", "type": "ifCondition", "name": "Validate", "config": { "field": "severity", "equals": "high" } },
    { "id": "3", "type": "telegramSendMessage", "name": "Send Alert", "config": { "chatId": "123", "message": "High severity" } }
  ],
  "connections": [
    { "from": "1", "to": "2", "condition": "always" },
    { "from": "2", "to": "3", "condition": "true" }
  ]
}
```

## REST API Endpoints

- `POST /api/v1/workflows` → create workflow
- `PUT /api/v1/workflows/:id` → update workflow
- `POST /api/v1/workflows/:workflowId/execute` → queue execution
- `GET /api/v1/workflows/:workflowId/executions` → execution history
- `GET /api/v1/executions/:executionId/logs` → execution logs
- `POST /api/v1/credentials` → create encrypted credentials
- `POST /api/v1/webhooks/:path` → external webhook trigger

## Built-in Node Plugins

- Webhook Trigger
- HTTP Request
- Telegram Send Message
- OpenAI API
- Delay Node
- If Condition Node

## Queue Execution

Execution requests are persisted, enqueued in BullMQ, and processed by workers:

1. API receives execution request.
2. Execution record created with status `queued`.
3. Job pushed to Redis queue.
4. Worker loads workflow JSON and runs node-by-node in execution engine.
5. Execution logs and final status written to Firestore.

## Firestore Collections

- `users`
- `workflows`
- `executions`
- `logs` (optional externalized logs, in this blueprint logs are embedded per execution)
- `credentials` (encrypted payloads)

## Security

Credentials are encrypted with AES-256-GCM before storing in Firestore.

## Running Backend

```bash
cd backend
npm install
npm run dev
```

Required env vars:

- `PORT`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `REDIS_HOST`
- `REDIS_PORT`
- `ENCRYPTION_SECRET`
- `OPENAI_API_KEY` (optional)
- `TELEGRAM_BOT_TOKEN` (optional)
