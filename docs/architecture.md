# Architecture Overview

## High-level Components

1. **Flutter App (mobile-first)**
   - Workflow list / editor / execution monitor.
   - Uses REST APIs to manage workflows and fetch logs.
   - Sends webhook setup instructions to users.

2. **Node.js API (Express)**
   - CRUD for workflows.
   - Trigger execution via queue.
   - Query execution history and logs.
   - Public webhook endpoint for external events.

3. **Execution Layer**
   - BullMQ job queue backed by Redis.
   - Worker runs execution engine.
   - Engine traverses JSON workflow graph and executes nodes.

4. **Firestore**
   - Stores users, workflows, credentials (encrypted), executions, logs.
   - Supports auditability and analytics.

## Workflow JSON Model

```json
{
  "startNodeId": "node_webhook",
  "nodes": [
    {
      "id": "node_webhook",
      "type": "webhookTrigger",
      "parameters": { "path": "incoming-order" }
    },
    {
      "id": "node_http",
      "type": "httpRequest",
      "parameters": {
        "method": "GET",
        "url": "https://api.example.com/orders"
      }
    }
  ],
  "connections": [
    { "from": "node_webhook", "to": "node_http" }
  ]
}
```

## Scalability Notes

- Horizontal scale API instances independently from workers.
- Increase worker concurrency to process more queued executions.
- Use Redis clustering for high queue throughput.
- Partition Firestore collections by tenant/workspace for enterprise scale.
- Add dead-letter queue and retries for fault tolerance.
