# DCS Researcher — Frontend

A streaming chat interface for researching DCS World aircraft systems, weapons, procedures, and avionics. Built with React 19, TypeScript, and Vite.

## Features

- **Multi-session chat** — create, switch, delete, and restore conversations
- **Real-time streaming** — token-by-token responses via Server-Sent Events
- **Tool activity tracking** — shows which tools the backend invokes and their status
- **Markdown rendering** — full GitHub Flavored Markdown with syntax highlighting
- **Dark / Light theme** — toggle with persistence, warm amber accent palette
- **Responsive** — collapsible sidebar, mobile-friendly layout
- **Keyboard shortcuts** — `Cmd+K` new session, `Cmd+/` toggle sidebar, `Cmd+L` focus input, `Esc` close sidebar

## Tech Stack

| Layer       | Choice                        |
|-------------|-------------------------------|
| Framework   | React 19                      |
| Language    | TypeScript (strict mode)      |
| Build       | Vite 6                        |
| Markdown    | react-markdown + remark-gfm   |
| Styling     | CSS custom properties (no lib)|

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Running [DCS Researcher backend](../dcs-agent) on port 3000 (or configure `VITE_API_BASE`)

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your API key
# VITE_API_KEY=your_api_key_here

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`. API requests are proxied to `http://localhost:3000` in development.

### Environment Variables

| Variable        | Default | Description                          |
|-----------------|---------|--------------------------------------|
| `VITE_API_BASE` | `/api`  | Base URL for backend API             |
| `VITE_API_KEY`  | —       | Bearer token for API authentication  |

## Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start Vite dev server with HMR       |
| `npm run build`    | Type-check and build for production  |
| `npm run preview`  | Preview production build locally     |

## Project Structure

```
src/
├── api.ts                 # SSE streaming client, auth headers
├── types.ts               # Message, ChatSession, ToolActivity types
├── App.tsx                # Root component, state orchestration
├── main.tsx               # Entry point (StrictMode + ErrorBoundary)
├── index.css              # Design tokens, all styles
├── components/
│   ├── ChatView.tsx       # Message list with auto-scroll
│   ├── EmptyState.tsx     # Landing page with radar animation
│   ├── ErrorBoundary.tsx  # Crash recovery fallback UI
│   ├── InputBar.tsx       # Textarea with send/stop controls
│   ├── MessageItem.tsx    # Single message (markdown + tools)
│   ├── Sidebar.tsx        # Session list, theme toggle
│   ├── ThemeToggle.tsx    # Dark/light mode switch
│   └── UndoToast.tsx      # Delete undo notification
└── hooks/
    ├── useChatSessions.ts # Session CRUD + localStorage persistence
    ├── useStreaming.ts     # Streaming state + API orchestration
    ├── useTheme.ts        # Theme preference + DOM attribute
    ├── useSidebar.ts      # Sidebar open/close + mobile behavior
    └── useKeyboardShortcuts.ts  # Global hotkeys
```

## API Contract

The frontend communicates with the backend over a single SSE streaming endpoint:

```
POST /api/research/stream              # New session
POST /api/research/:sessionId/stream   # Continue session
```

**Request body:** `{ "question": "string" }`
**Auth header:** `Authorization: Bearer <VITE_API_KEY>`

**Stream events:**

| Event        | Payload                        | Description                    |
|--------------|--------------------------------|--------------------------------|
| `session`    | `{ sessionId }`                | Session ID assigned by backend |
| `token`      | `{ content }`                  | Incremental response text      |
| `tool_start` | `{ toolName }`                 | Tool execution started         |
| `tool_end`   | `{ toolName, output? }`        | Tool execution finished        |
| `done`       | `{}`                           | Stream complete                |
| `error`      | `{ message }`                  | Error occurred                 |

## Production Build

```bash
npm run build
```

Outputs static files to `dist/`. Serve with any static file server. Set `VITE_API_BASE` at build time to point to your production backend URL.

## License

Private — not for redistribution.
