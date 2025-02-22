export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Link {
  source: string;
  target: string;
  weight: number;
}

export interface GraphData {
  nodes: Array<{
    id: string;
    title: string;
    tags: string[];
  }>;
  links: Array<Link>;
}

export interface LLMResponse {
  summary: string;
  keywords: string[];
  suggestions: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}
