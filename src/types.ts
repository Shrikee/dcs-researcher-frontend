export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tools: ToolActivity[];
  timestamp: number;
  error?: string;
}

export interface ToolActivity {
  name: string;
  status: 'running' | 'complete';
  output?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export type Theme = 'light' | 'dark';
