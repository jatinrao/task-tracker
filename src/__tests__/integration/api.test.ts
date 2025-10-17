import type { Task } from '../../types';
import { MockDatabase, generateMockTasks } from '../../utils/mockData';

// Test MockDatabase directly - no API layer, no fetch, no MSW needed
const db = new MockDatabase(generateMockTasks(50));

describe('MockDatabase Integration', () => {
  beforeEach(() => {
    db.reset(generateMockTasks(50));
  });

  describe('getAllTasks', () => {
    it('should return all tasks', () => {
      const tasks = db.getAllTasks();
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBe(50);
    });

    it('should return tasks with correct structure', () => {
      const tasks = db.getAllTasks();
      tasks.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('category');
        expect(task).toHaveProperty('status');
        expect(task).toHaveProperty('date');
        expect(task).toHaveProperty('amount');
      });
    });
  });

  describe('getTaskById', () => {
    it('should return single task by id', () => {
      const tasks = db.getAllTasks();
      const task = db.getTaskById(tasks[0].id);
      expect(task).toEqual(tasks[0]);
    });

    it('should return undefined for non-existent task', () => {
      const task = db.getTaskById('non-existent');
      expect(task).toBeUndefined();
    });
  });

  describe('createTask', () => {
    it('should create new task', () => {
      const newTaskData: Omit<Task, 'id'> = {
        title: 'New Integration Test Task',
        category: 'D',
        status: 'todo',
        date: '2025-09-15',
        amount: 800,
      };

      const createdTask = db.createTask(newTaskData);
      expect(createdTask.id).toBeDefined();
      expect(createdTask.title).toBe(newTaskData.title);
      expect(createdTask.category).toBe(newTaskData.category);
    });

    it('should add task to database', () => {
      const initialTasks = db.getAllTasks();
      const initialCount = initialTasks.length;

      db.createTask({
        title: 'Test Task',
        category: 'A',
        status: 'todo',
        date: '2025-09-15',
        amount: 500,
      });

      const updatedTasks = db.getAllTasks();
      expect(updatedTasks.length).toBe(initialCount + 1);
    });

    it('should generate unique ids', () => {
      const task1 = db.createTask({
        title: 'Task 1',
        category: 'A',
        status: 'todo',
        date: '2025-09-15',
        amount: 500,
      });
      
      const task2 = db.createTask({
        title: 'Task 2',
        category: 'B',
        status: 'todo',
        date: '2025-09-15',
        amount: 600,
      });

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('updateTask', () => {
    it('should update existing task', () => {
      const tasks = db.getAllTasks();
      const taskToUpdate = tasks[0];

      const updatedTask = db.updateTask(taskToUpdate.id, {
        status: 'done',
        amount: 999,
      });

      expect(updatedTask?.status).toBe('done');
      expect(updatedTask?.amount).toBe(999);
      expect(updatedTask?.title).toBe(taskToUpdate.title);
    });

    it('should return null for non-existent task', () => {
      const result = db.updateTask('non-existent', { status: 'done' });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete task', () => {
      const tasks = db.getAllTasks();
      const taskToDelete = tasks[0];

      const result = db.deleteTask(taskToDelete.id);
      expect(result).toBe(true);

      const updatedTasks = db.getAllTasks();
      expect(updatedTasks.find(t => t.id === taskToDelete.id)).toBeUndefined();
    });

    it('should return false for non-existent task', () => {
      const result = db.deleteTask('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('CRUD workflow', () => {
    it('should handle complete CRUD cycle', () => {
      // Create
      const newTask = db.createTask({
        title: 'CRUD Test Task',
        category: 'D',
        status: 'todo',
        date: '2025-09-15',
        amount: 600,
      });
      expect(newTask.id).toBeDefined();

      // Read
      const fetchedTask = db.getTaskById(newTask.id);
      expect(fetchedTask).toEqual(newTask);

      // Update
      const updatedTask = db.updateTask(newTask.id, { status: 'done' });
      expect(updatedTask?.status).toBe('done');

      // Delete
      const deleted = db.deleteTask(newTask.id);
      expect(deleted).toBe(true);
      
      const notFound = db.getTaskById(newTask.id);
      expect(notFound).toBeUndefined();
    });
  });
});
