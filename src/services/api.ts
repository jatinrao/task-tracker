import type { Task } from '../types';

const API_BASE = '/api';

export const api = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  },
};
