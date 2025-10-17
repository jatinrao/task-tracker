import type { Task, TaskStatus, TaskCategory } from '../types';
import { addDays, format, subDays } from 'date-fns';

const statuses: TaskStatus[] = ['todo', 'in-progress', 'done', 'blocked'];
const categories: TaskCategory[] = ['A', 'B', 'C', 'D'];

const taskTitles: Record<TaskCategory, string[]> = {
  A: [
    'Implement responsive navigation',
    'Create reusable button component',
    'Add form validation',
    'Optimize bundle size',
    'Fix CSS layout issues',
    'Implement dark mode',
    'Add loading states',
    'Create error boundaries',
    'Implement infinite scroll',
    'Add accessibility features',
  ],
  B: [
    'Design REST API endpoints',
    'Implement authentication',
    'Add database migrations',
    'Optimize query performance',
    'Implement caching layer',
    'Add rate limiting',
    'Create API documentation',
    'Implement webhooks',
    'Add logging system',
    'Setup monitoring',
  ],
  C: [
    'Create wireframes',
    'Design component library',
    'Update brand guidelines',
    'Create user flow diagrams',
    'Design mobile layouts',
    'Create icon set',
    'Design loading animations',
    'Update color palette',
    'Create style guide',
    'Design error states',
  ],
  D: [
    'Write unit tests',
    'Add integration tests',
    'Implement E2E tests',
    'Add performance tests',
    'Create test fixtures',
    'Add accessibility tests',
    'Implement visual regression tests',
    'Add load testing',
    'Create test documentation',
    'Setup CI/CD pipeline',
  ],
  
};

export const generateMockTasks = (count: number = 100): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();
  const startDate = subDays(today, 90); // 90 days ago
  const endDate = today; // no future dates
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titles = taskTitles[category];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDays = Math.floor(Math.random() * daysDiff);
    const date = format(addDays(startDate, randomDays), 'yyyy-MM-dd');
    const amount = Math.floor(Math.random() * 900) + 100; // 100-1000

    tasks.push({
      id: `task-${i + 1}`,
      title: `${title} #${i + 1}`,
      category,
      status,
      date,
      amount,
    });
  }

  return tasks.sort((a, b) => a.date.localeCompare(b.date));
};

// in-memory db
export class MockDatabase {
  private tasks: Task[];
  private idCounter: number;

  constructor(initialTasks?: Task[]) {
    this.tasks = initialTasks || generateMockTasks(100);
    this.idCounter = this.tasks.length + 1;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(taskData: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `task-${this.idCounter++}`,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return null;

    this.tasks[index] = { ...this.tasks[index], ...updates };
    return this.tasks[index];
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  reset(tasks?: Task[]): void {
    this.tasks = tasks || generateMockTasks(100);
    this.idCounter = this.tasks.length + 1;
  }
}
