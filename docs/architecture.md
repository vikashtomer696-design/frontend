# Automation Platform Architecture (n8n-style)

## 1) High-level architecture

- **Flutter mobile app** (mobile-first UX) for workflow creation/execution monitoring.
- **Node.js + Express API** for workflow CRUD, execution orchestration, webhooks, logs.
- **Firestore** as primary document database.
- **Redis + BullMQ** for async execution queue and horizontal worker scaling.
- **Execution Workers** that run workflow JSON via a modular node runtime.
- **Credential Vault Service** using AES-256-GCM encryption before persistence.

## 2) Folder structure

```text
backend/
  src/
    app.js
    server.js
    worker.js
    container.js
    config/
      env.js
      firebase.js
    controllers/
      workflowController.js
    middleware/
      validate.js
    queue/
      queue.js
    routes/
      workflowRoutes.js
    services/
      executionEngine.js
      workflowService.js
      credentialService.js
      nodes/
        baseNode.js
        nodeRegistry.js
        plugins/
          webhookTriggerNode.js
          httpRequestNode.js
          telegramSendMessageNode.js
          openAiNode.js
          delayNode.js
          ifConditionNode.js
      repositories/
        baseRepository.js
        workflowRepository.js
        executionRepository.js
        logRepository.js
        credentialRepository.js
    utils/
      encryption.js
      logger.js
frontend_flutter/
  lib/
    main.dart
    models/workflow.dart
    services/
      api_client.dart
      workflow_service.dart
    screens/
      workflow_builder/
        workflow_builder_screen.dart
        widgets/node_palette.dart
```

## 3) Firestore schema

### `users`
```json
{
  "id": "user_123",
  "email": "admin@acme.com",
  "name": "Automation Admin",
  "role": "owner",
  "createdAt": "ISO"
}
```

### `workflows`
```json
{
  "id": "wf_123",
  "userId": "user_123",
  "name": "Lead Follow-up",
  "status": "active",
  "definition": {
    "startNodeId": "node_1",
    "nodes": [
      {"id": "node_1", "type": "webhookTrigger", "name": "Incoming Lead", "parameters": {}},
      {"id": "node_2", "type": "httpRequest", "name": "CRM Create", "parameters": {"url": "..."}}
    ],
    "connections": [
      {"source": "node_1", "target": "node_2"}
    ]
  },
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

### `executions`
```json
{
  "id": "exec_123",
  "workflowId": "wf_123",
  "trigger": "manual|webhook|schedule",
  "input": {},
  "status": "queued|running|completed|failed",
  "output": {},
  "createdAt": "ISO",
  "startedAt": "ISO",
  "completedAt": "ISO"
}
```

### `logs`
```json
{
  "id": "log_123",
  "executionId": "exec_123",
  "workflowId": "wf_123",
  "nodeId": "node_2",
  "level": "info|error|warn",
  "message": "Executed node httpRequest",
  "meta": {},
  "timestamp": "ISO"
}
```

### `credentials`
```json
{
  "id": "cred_123",
  "userId": "user_123",
  "name": "Telegram Bot",
  "type": "telegram",
  "secret": {
    "iv": "base64",
    "tag": "base64",
    "data": "base64"
  },
  "createdAt": "ISO"
}
```

## 4) REST API routes

- `POST /api/v1/workflows` → create workflow.
- `PUT /api/v1/workflows/:workflowId` → update workflow.
- `POST /api/v1/workflows/:workflowId/execute` → enqueue execution.
- `GET /api/v1/workflows/:workflowId/executions` → execution history.
- `GET /api/v1/executions/:executionId/logs` → execution logs.
- `POST /api/v1/webhooks/:workflowId` → external webhook trigger.

## 5) Workflow JSON and execution

- Workflows are JSON DAG-like structures with nodes and connections.
- Engine starts from `startNodeId` and follows connection edges.
- `ifCondition` node supports branch routing (`trueTarget`/`falseTarget`).
- Node plugins are registered in `NodeRegistry`, enabling easy extension.

## 6) Scaling strategy

- Scale API pods independently from worker pods.
- BullMQ queue absorbs spikes in execution requests.
- Workers can be autoscaled by queue depth.
- Firestore collections should be indexed on `workflowId`, `executionId`, `status`, `createdAt`.
- For high-volume logs, optionally stream logs to BigQuery/Elastic.

## 7) Security controls

- Credential payload encrypted with **AES-256-GCM** prior to Firestore write.
- `helmet` and `cors` applied in Express app.
- Validate request payloads with Joi.
- Use service-to-service secrets manager for env vars in production.

## 8) Production recommendations

- Add OAuth/JWT auth middleware and tenancy isolation.
- Add rate limiting for webhook/API ingress.
- Add retry policies, dead-letter queue, and timeout/circuit breaker.
- Add observability (OpenTelemetry + Prometheus + centralized logs).
- Add workflow versioning and immutable execution snapshots.
