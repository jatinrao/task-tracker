import { http, HttpResponse, delay } from 'msw';
import { MockDatabase, generateMockTasks } from '../utils/mockData';
import type { Task } from '../types';

export const db = new MockDatabase(generateMockTasks(200));

const API_BASE = '/api';
const NETWORK_DELAY = 100; // Simulate network latency

export const handlers = [
  // GET all tasks
  http.get(`${API_BASE}/tasks`, async () => {
    await delay(NETWORK_DELAY);
    return HttpResponse.json(db.getAllTasks());
  }),

  // GET single task
  http.get(`${API_BASE}/tasks/:id`, async ({ params }) => {
    await delay(NETWORK_DELAY);
    const { id } = params;
    const task = db.getTaskById(id as string);
    
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(task);
  }),

  // POST create task
  http.post(`${API_BASE}/tasks`, async ({ request }) => {
    await delay(NETWORK_DELAY);
    const taskData = (await request.json()) as Omit<Task, 'id'>;
    
    // Validation
    if (!taskData.title || !taskData.category || !taskData.status || !taskData.date) {
      return new HttpResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    const newTask = db.createTask(taskData);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PUT update task
  http.put(`${API_BASE}/tasks/:id`, async ({ params, request }) => {
    await delay(NETWORK_DELAY);
    const { id } = params;
    const updates = (await request.json()) as Partial<Task>;
    
    const updatedTask = db.updateTask(id as string, updates);
    
    if (!updatedTask) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updatedTask);
  }),

  // DELETE task
  http.delete(`${API_BASE}/tasks/:id`, async ({ params }) => {
    await delay(NETWORK_DELAY);
    const { id } = params;
    const success = db.deleteTask(id as string);
    
    if (!success) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];
