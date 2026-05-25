# Todo Manager — Full-Stack Test Task (UITOP)

A small full-stack application for managing tasks (todos with categories).

**Live demo**
- Frontend (Vercel): https://uitop-todo.vercel.app
- Backend API (Render): https://uitop-todo.onrender.com

> **Note about the free hosting tier**
> The backend runs on Render's free plan, which spins the service down after
> ~15 minutes of inactivity. The **first request after a period of inactivity may
> take 30-50 seconds** while the server wakes up — this is expected. Subsequent
> requests are fast. Because the free tier uses an ephemeral filesystem, the
> SQLite database is reset to its seeded state (5 categories, no tasks) on each
> redeploy/restart.

---

## Features

- Create tasks with a text and a category.
- View the list of todos (text + category + status).
- Mark a task as completed (with a 5-second **Undo** window).
- Delete a task (with a 5-second **Undo** window).
- Filter the list by category (server-side filtering).
- Business rule: **a category may contain at most 5 tasks**. Trying to add a 6th
  returns \`400 Bad Request\`, and the frontend shows the error under the form field.
- UX states: loading spinner, error message (with retry), and an empty state.
- **Bulk action:** select multiple tasks and mark them done in one request
  (with Undo).

### How Undo works
When a task is completed or deleted, the change is applied optimistically in the
UI and a snackbar with an **Undo** button appears for 5 seconds. If the user does
nothing, the action is committed to the backend (\`PATCH\` for completion, \`DELETE\`
for deletion). If the user clicks **Undo**, the local state is reverted and no
request is sent. Deleted tasks are restored to their original position in the list.
The bulk "mark done" action uses the same mechanism.

---

## Tech stack

**Frontend**
- React + Vite + TypeScript
- Material UI (components, Snackbar, icons)
- React Hook Form (form handling and validation)
- Axios (API calls)

**Backend**
- Node.js + Express + TypeScript
- SQLite via \`better-sqlite3\`
- CORS configurable through an environment variable

**Tooling**
- Jest + Supertest (backend tests)
- Docker + docker-compose

---

## Project structure

\`\`\`
uitop-todo/
├── backend/                # Express + SQLite API
│   ├── src/
│   │   ├── server.ts       # entry point
│   │   ├── app.ts          # Express app (exported for testing)
│   │   ├── db.ts           # SQLite connection, schema, category seed
│   │   ├── types.ts        # shared API types
│   │   ├── todos.test.ts   # API tests (Jest + Supertest)
│   │   └── routes/
│   │       ├── todos.ts
│   │       └── categories.ts
│   └── Dockerfile
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── api/            # axios client + endpoint wrappers
│   │   ├── components/     # TodoForm, TodoList, TodoItem, CategoryFilter,
│   │   │                   #   BulkActionsBar, UndoSnackbar, states/
│   │   ├── hooks/          # useTodos, usePendingAction
│   │   ├── types/          # shared types
│   │   ├── theme.ts
│   │   └── App.tsx
│   └── Dockerfile
└── docker-compose.yml
\`\`\`

---

## API

Base URL (production): \`https://uitop-todo.onrender.com\`

| Method | Endpoint            | Description                                            |
|--------|---------------------|--------------------------------------------------------|
| GET    | \`/categories\`       | Get the list of categories.                            |
| GET    | \`/todos\`            | Get todos. Optional query param \`category=<id>\` filter.|
| POST   | \`/todos\`            | Create a todo. Body: \`{ "text": string, "categoryId": number }\`. Returns \`400\` if the category already has 5 tasks. |
| PATCH  | \`/todos/:id\`        | Update completion status. Body: \`{ "completed": boolean }\`. |
| PATCH  | \`/todos/bulk\`       | Bulk update status. Body: \`{ "ids": number[], "completed": boolean }\`. |
| DELETE | \`/todos/:id\`        | Delete a todo.                                         |
| GET    | \`/health\`           | Health check, returns \`{ "status": "ok" }\`.            |

**Error format:** \`{ "error": "message" }\` with the appropriate HTTP status
(\`400\` for validation / business-rule errors, \`404\` when a todo is not found).

---

## Running locally

**Prerequisites:** Node.js >= 20 (the project was built and tested on Node 24).

### 1. Clone

\`\`\`bash
git clone https://github.com/artemstadnik/uitop-todo.git
cd uitop-todo
\`\`\`

### 2. Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env     # optional; defaults work out of the box
npm run dev              # starts on http://localhost:4000
\`\`\`

Backend environment variables (\`backend/.env\`):

\`\`\`
PORT=4000          # port to listen on (Render injects its own in production)
CORS_ORIGIN=*      # allowed origin for CORS
# DB_PATH=./data.db
\`\`\`

### 3. Frontend

In a second terminal:

\`\`\`bash
cd frontend
npm install
cp .env.example .env     # sets VITE_API_URL=http://localhost:4000
npm run dev              # starts on http://localhost:5173
\`\`\`

Frontend environment variables (\`frontend/.env\`):

\`\`\`
VITE_API_URL=http://localhost:4000
\`\`\`

Open http://localhost:5173 with the backend running.

### Production build (optional)

\`\`\`bash
# backend
cd backend && npm run build && npm start

# frontend
cd frontend && npm run build && npm run preview
\`\`\`

---

## Running with Docker

The whole project can be started with a single command from the project root:

\`\`\`bash
docker compose up --build
\`\`\`

- Frontend: http://localhost:8080
- Backend API: http://localhost:4000

Stop with \`Ctrl+C\`, then \`docker compose down\`.

---

## Tests

Backend tests (Jest + Supertest) cover the API: category seeding, task creation,
the 5-tasks-per-category limit, validation, status updates, bulk updates,
filtering, and deletion. They run against an in-memory SQLite database, so they
don't touch the real \`data.db\`.

\`\`\`bash
cd backend
npm test
\`\`\`

---

## Deployment

- **Backend** is deployed to **Render** as a Web Service.
  - Root Directory: \`backend\`
  - Build Command: \`npm install && npm run build\`
  - Start Command: \`npm start\`
  - Env: \`CORS_ORIGIN\` set to the frontend's Vercel URL.
- **Frontend** is deployed to **Vercel**.
  - Root Directory: \`frontend\`
  - Framework preset: Vite
  - Env: \`VITE_API_URL\` set to the Render backend URL.

Both redeploy automatically on every push to \`main\`.

---

## Answers to the questionnaire

**1. Did you use AI at any stage while working on this task? Why?**

Yes. I used an AI assistant as a pair-programming partner throughout the task.
The reasons were speed and reliability: it helped me scaffold the project,
choose a sensible stack, and move through repetitive setup quickly, so I could
spend my attention on understanding the logic rather than boilerplate. I treated
every suggestion critically — reading, running, and verifying each step locally
(type-checking with \`tsc\`, testing endpoints with \`curl\`, and checking the UI
in the browser) before moving on. The architecture decisions and the
verification of correctness were mine.

**2. What kind of problems or uncertainties did AI help you resolve during the process?**

- **Environment issues.** A native-module build failure for \`better-sqlite3\`
  (caused by Python 3.12 dropping \`distutils\` and an older \`node-gyp\`) was
  diagnosed and solved by switching to a current Node LTS so a prebuilt binary
  is used instead of compiling from source.
- **Tooling friction.** Resolving a deprecated \`moduleResolution\` TypeScript
  option, a renamed MUI icon module, and a few strict ESLint rules in recent
  package versions (e.g. avoiding \`setState\` side-effects inside effects).
- **Subtle UI logic.** Getting the optimistic Undo flow right — including a bug
  where StrictMode double-invoked a state updater containing side effects, which
  caused tasks to be restored twice. The fix was to move the commit/undo side
  effects out of the \`setState\` updater and track the pending action in a ref.
- **Deployment specifics.** Configuring a monorepo correctly on Render and
  Vercel (root directories, build commands, environment variables) and wiring
  CORS and \`VITE_API_URL\` so the production frontend talks to the production
  backend; and fixing Docker port binding so the containerized frontend reaches
  the backend.
  