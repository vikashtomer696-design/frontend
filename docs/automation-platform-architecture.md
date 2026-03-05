# Automation Platform Architecture (n8n-style)

## 1) Monorepo Folder Structure

```text
frontend/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  ├─ firebase.js
│  │  │  ├─ redis.js
│  │  │  └─ encryption.js
│  │  ├─ controllers/
│  │  │  ├─ workflows/
│  │  │  │  ├─ createWorkflowController.js
│  │  │  │  ├─ updateWorkflowController.js
│  │  │  │  └─ webhookTriggerController.js
│  │  │  ├─ executions/
│  │  │  │  ├─ executeWorkflowController.js
│  │  │  │  └─ listExecutionsController.js
│  │  │  └─ logs/
│  │  │     └─ listLogsController.js
│  │  ├─ engine/
│  │  │  └─ workflowExecutor.js
│  │  ├─ middleware/
│  │  │  ├─ mockAuth.js
│  │  │  └─ errorHandler.js
│  │  ├─ nodes/
│  │  │  ├─ baseNode.js
│  │  │  ├─ nodeRegistry.js
│  │  │  └─ plugins/
│  │  │     ├─ webhookTriggerNode.js
│  │  │     ├─ httpRequestNode.js
│  │  │     ├─ telegramSendMessageNode.js
│  │  │     ├─ openAiApiNode.js
│  │  │     ├─ delayNode.js
│  │  │     └─ ifConditionNode.js
│  │  ├─ queue/
│  │  │  ├─ workflowQueue.js
│  │  │  └─ worker.js
│  │  ├─ routes/
│  │  │  ├─ workflowRoutes.js
│  │  │  ├─ logRoutes.js
│  │  │  └─ webhookRoutes.js
│  │  ├─ services/
│  │  │  └─ workflowService.js
│  │  ├─ utils/
│  │  │  └─ httpClient.js
│  │  └─ server.js
│  ├─ package.json
│  └─ .env.example
├─ flutter_app/
│  ├─ lib/
│  │  └─ main.dart
│  └─ pubspec.yaml
└─ docs/
   └─ automation-platform-architecture.md
```

## 2) Core Data Model (Firestore)

All collections are top-level for horizontal scalability.

### `users`
- `id: string`
- `email: string`
- `name: string`
- `role: "admin" | "member"`
- `createdAt: timestamp`

### `workflows`
- `id: string`
- `userId: string`
- `name: string`
- `active: boolean`
- `webhookKey: string`
- `nodes: WorkflowNode[]`
- `connections: WorkflowConnection[]`
- `createdAt: timestamp`
- `updatedAt: timestamp`

### `executions`
- `id: string`
- `workflowId: string`
- `status: "queued" | "running" | "completed" | "failed"`
- `input: map`
- `output: map`
- `error: string | null`
- `startedAt: timestamp`
- `finishedAt: timestamp`

### `logs`
- `id: string`
- `executionId: string`
- `workflowId: string`
- `nodeId: string`
- `output: map`
- `createdAt: timestamp`

### `credentials`
- `id: string`
- `userId: string`
- `provider: string`
- `encryptedPayload: string` (AES-256-GCM ciphertext)
- `createdAt: timestamp`

### Workflow JSON Contract

```json
{
  "id": "wf_123",
  "name": "Telegram Alert",
  "active": true,
  "nodes": [
    { "id": "n1", "type": "webhookTrigger", "config": {} },
    { "id": "n2", "type": "httpRequest", "config": { "url": "https://api.example.com" } },
    { "id": "n3", "type": "telegramSendMessage", "config": { "chatId": "123" } }
  ],
  "connections": [
    { "source": "n1", "target": "n2" },
    { "source": "n2", "target": "n3" }
  ]
}
```

## 3) Execution Engine

1. Workflow is enqueued to BullMQ (`workflow-executions`).
2. Worker fetches workflow JSON from Firestore.
3. Engine resolves first node, then executes sequentially by `connections`.
4. Every node output is persisted in `logs`.
5. Final output and status update are written to `executions`.

## 4) Node Plugin System

- `BaseNode` defines a common `execute(context)` interface.
- `nodeRegistry` maps `type -> NodeClass`.
- New integrations are added by:
  1. creating a new plugin class,
  2. registering it in `nodeRegistry`,
  3. adding UI config schema in Flutter.

Bundled plugins:
- Webhook Trigger
- HTTP Request
- Telegram Send Message
- OpenAI API
- Delay
- If Condition

## 5) API Routes

### Workflows
- `POST /api/workflows` → Create workflow
- `PUT /api/workflows/:workflowId` → Update workflow
- `POST /api/workflows/:workflowId/execute` → Queue execution
- `GET /api/workflows/:workflowId/executions` → Execution history

### Logs
- `GET /api/executions/:executionId/logs` → Node-by-node logs

### Webhooks
- `POST /webhooks/:workflowId/:key` → External trigger endpoint

## 6) Mobile-first Flutter Frontend

- Uses responsive `LayoutBuilder` to switch compact/mobile and tablet layouts.
- Workflow builder renders node cards first for mobile usability.
- Node editor panel appears on larger screens.
- API-ready app shell for authentication, workflow CRUD, and execution monitoring.

## 7) Production Hardening Checklist

- Replace `mockAuth` with JWT + refresh-token auth.
- Add rate limits, RBAC, and tenant isolation.
- Add dead-letter queue and retry dashboards.
- Add OpenTelemetry tracing and structured logs.
- Add encrypted secrets rotation and KMS-backed key management.
- Add CI/CD + integration tests + Firestore security rules.
