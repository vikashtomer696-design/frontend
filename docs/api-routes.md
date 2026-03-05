# REST API Routes

Base URL: `/api/v1`

## Workflows
- `POST /workflows` - create workflow
- `PUT /workflows/:id` - update workflow
- `POST /workflows/:id/execute` - enqueue workflow execution
- `GET /workflows/:id/executions` - get workflow execution history

## Executions
- `GET /executions` - list executions, optional `?workflowId=`
- `GET /executions/:id` - get execution details

## Logs
- `GET /logs?executionId=...` - get execution logs

## Webhooks
- `ALL /webhooks/:workflowId/:path` - external trigger endpoint

## Example: Create Workflow

```http
POST /api/v1/workflows
Content-Type: application/json

{
  "userId": "user_123",
  "name": "Telegram + OpenAI Responder",
  "requiredCredentials": ["telegram", "openai"],
  "definition": {
    "startNodeId": "webhook_1",
    "nodes": [
      { "id": "webhook_1", "type": "webhookTrigger", "parameters": {"path": "incoming"} },
      { "id": "ai_1", "type": "openAi", "parameters": {"messages": [{"role": "user", "content": "Hello"}] } },
      { "id": "tg_1", "type": "telegramSendMessage", "parameters": {"chatId": "123456", "message": "Done"} }
    ],
    "connections": [
      { "from": "webhook_1", "to": "ai_1" },
      { "from": "ai_1", "to": "tg_1" }
    ]
  }
}
```
