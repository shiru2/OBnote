import axios from 'axios';
import { Note, LLMResponse } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const NotesAPI = {
  async getAllNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes?id=${id}`);
    return response.data;
  },

  async createNote(note: Partial<Note>): Promise<Note> {
    const response = await api.post<Note>('/notes', note);
    return response.data;
  },

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const response = await api.put<Note>(`/notes?id=${id}`, note);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes?id=${id}`);
  },
};

export const LLMAPI = {
  async analyzeContent(content: string): Promise<LLMResponse> {
    const response = await api.post<LLMResponse>('/llm', { content });
    return response.data;
  },
};

// Error handling middleware
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default api;
