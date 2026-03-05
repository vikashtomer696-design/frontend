# Firestore Schema

## collections/users/{userId}
- email: string
- name: string
- role: string
- createdAt: number

## collections/workflows/{workflowId}
- userId: string
- name: string
- active: boolean
- requiredCredentials: string[]
- definition: object
  - startNodeId: string
  - nodes: array
  - connections: array
- createdAt: number
- updatedAt: number

## collections/credentials/{credentialId}
- userId: string
- name: string
- encryptedPayload: string
- createdAt: number

## collections/executions/{executionId}
- workflowId: string
- status: running | success | failed
- trigger: object
- results: array
- error: string|null
- startedAt: number
- endedAt: number

## collections/logs/{logId}
- executionId: string
- level: info | warn | error
- message: string
- meta: object|null
- createdAt: number
