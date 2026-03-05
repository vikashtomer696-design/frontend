# Production Architecture Notes

## 1) High-level services

- **API Gateway (Express):** authentication, workflow CRUD, execution APIs, webhook endpoints.
- **Execution Workers (BullMQ):** horizontal workers consume queued workflow jobs.
- **Node Runtime:** plugin registry executes integration nodes.
- **Persistence (Firestore):** source of truth for workflows, executions, credentials.
- **Cache/Queue (Redis):** queue storage, retry scheduling, rate-limiting opportunities.

## 2) Firestore schema (recommended)

### `users/{userId}`
- `email`, `name`, `plan`, `createdAt`, `updatedAt`

### `workflows/{workflowId}`
- `name`, `ownerId`, `triggerType`, `webhookPath`, `isActive`
- `nodes[]`: array of node descriptors (`id`, `type`, `config`)
- `connections[]`: directed edges between node IDs with conditional branches
- `createdAt`, `updatedAt`

### `executions/{executionId}`
- `workflowId`, `status`, `triggerSource`
- `input`, `output`
- `logs[]`: per-node output/error snapshots
- `createdAt`, `startedAt`, `finishedAt`

### `credentials/{credentialId}`
- `ownerId`, `provider`
- `encryptedPayload`, `iv`, `authTag`
- `createdAt`, `updatedAt`

## 3) Scalability patterns

- Stateless API pods.
- Separate worker deployments for heavy execution.
- BullMQ concurrency tuning and retry backoff.
- Optional per-node timeout and circuit breaker layer.
- Firestore composite indexes for high-cardinality queries.

## 4) Extending node plugins

To add a node:

1. Implement `NodePlugin` interface in `backend/src/engine/nodes/plugins`.
2. Register plugin in `NodeRegistry`.
3. Add config schema validation (recommended with zod).
4. Add credentials contract if needed.

## 5) Operational hardening checklist

- JWT auth + RBAC enforcement on all workflow APIs.
- Secret management via KMS/HSM instead of plain env.
- Audit logs and immutable execution trail.
- Multi-region Redis/Firestore strategy.
- Dead-letter queue and replay tooling.
