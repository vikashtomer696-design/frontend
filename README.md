# Automation Platform (n8n-inspired)

Production-ready, modular automation platform with:

- **Flutter** mobile-first UI for workflow creation and monitoring.
- **Node.js + Express** backend API.
- **Firestore** persistence for workflows, users, credentials, executions, and logs.
- **BullMQ + Redis** queue-based asynchronous workflow execution.
- **Pluggable node system** (Webhook Trigger, HTTP Request, Telegram, OpenAI, Delay, If).
- **Secure credential encryption** at rest.

## Monorepo Structure

```text
.
├── backend/                  # Express API + engine + queue workers
├── flutter_app/              # Flutter mobile-first client
├── docs/                     # Architecture, schema, API references
└── README.md
```

See:

- `docs/architecture.md`
- `docs/database-schema.md`
- `docs/api-routes.md`

## Quick Start (Backend)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Quick Start (Flutter)

```bash
cd flutter_app
flutter pub get
flutter run
```
