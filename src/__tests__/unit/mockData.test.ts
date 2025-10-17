import { generateMockTasks, MockDatabase } from '../../utils/mockData';
import { type Task } from '../../types';

describe('mockData', () => {
  describe('generateMockTasks', () => {
    it('should generate specified number of tasks', () => {
      const tasks = generateMockTasks(50);
      expect(tasks).toHaveLength(50);
    });

    it('should generate 100 tasks by default', () => {
      const tasks = generateMockTasks();
      expect(tasks).toHaveLength(100);
    });

    it('should generate tasks with valid structure', () => {
      const tasks = generateMockTasks(10);
      tasks.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('category');
        expect(task).toHaveProperty('status');
        expect(task).toHaveProperty('date');
        expect(task).toHaveProperty('amount');
      });
    });

    it('should generate tasks within date range', () => {
      const tasks = generateMockTasks(100);
      tasks.forEach(task => {
        const date = new Date(task.date);
        expect(date >= new Date('2025-07-19')).toBe(true);
        expect(date <= new Date()).toBe(true);
      });
    });

    it('should generate tasks with valid amounts', () => {
      const tasks = generateMockTasks(100);
      tasks.forEach(task => {
        expect(task.amount).toBeGreaterThanOrEqual(100);
        expect(task.amount).toBeLessThanOrEqual(1000);
      });
    });

    it('should sort tasks by date', () => {
      const tasks = generateMockTasks(50);
      for (let i = 1; i < tasks.length; i++) {
        expect(tasks[i].date >= tasks[i - 1].date).toBe(true);
      }
    });
  });

  describe('MockDatabase', () => {
    let db: MockDatabase;

    beforeEach(() => {
      db = new MockDatabase(generateMockTasks(10));
    });

    describe('getAllTasks', () => {
      it('should return all tasks', () => {
        const tasks = db.getAllTasks();
        expect(tasks).toHaveLength(10);
      });

      it('should return a copy of tasks', () => {
        const tasks1 = db.getAllTasks();
        const tasks2 = db.getAllTasks();
        expect(tasks1).not.toBe(tasks2);
        expect(tasks1).toEqual(tasks2);
      });
    });

    describe('getTaskById', () => {
      it('should return task by id', () => {
        const tasks = db.getAllTasks();
        const task = db.getTaskById(tasks[0].id);
        expect(task).toEqual(tasks[0]);
      });

      it('should return undefined for non-existent id', () => {
        const task = db.getTaskById('non-existent');
        expect(task).toBeUndefined();
      });
    });

    describe('createTask', () => {
      it('should create new task with generated id', () => {
        const newTaskData: Omit<Task, 'id'> = {
          title: 'New Task',
          category:'A',
          status: 'todo',
          date: '2025-09-15',
          amount: 600,
        };
        const newTask = db.createTask(newTaskData);
        expect(newTask.id).toBeDefined();
        expect(newTask.title).toBe('New Task');
        expect(db.getAllTasks()).toHaveLength(11);
      });

      it('should generate unique ids', () => {
        const task1 = db.createTask({
          title: 'Task 1',
          category: 'A',
          status: 'todo',
          date: '2025-09-15',
          amount: 600,
        });
        const task2 = db.createTask({
          title: 'Task 2',
          category: 'B',
          status: 'done',
          date: '2025-09-16',
          amount: 700,
        });
        expect(task1.id).not.toBe(task2.id);
      });
    });

    describe('updateTask', () => {
      it('should update existing task', () => {
        const tasks = db.getAllTasks();
        const updated = db.updateTask(tasks[0].id, { status: 'done' });
        expect(updated?.status).toBe('done');
        expect(updated?.id).toBe(tasks[0].id);
      });

      it('should return null for non-existent task', () => {
        const result = db.updateTask('non-existent', { status: 'done' });
        expect(result).toBeNull();
      });

      it('should preserve unchanged fields', () => {
        const tasks = db.getAllTasks();
        const original = tasks[0];
        const updated = db.updateTask(original.id, { status: 'done' });
        expect(updated?.title).toBe(original.title);
        expect(updated?.category).toBe(original.category);
      });
    });

    describe('deleteTask', () => {
      it('should delete task by id', () => {
        const tasks = db.getAllTasks();
        const result = db.deleteTask(tasks[0].id);
        expect(result).toBe(true);
        expect(db.getAllTasks()).toHaveLength(9);
      });

      it('should return false for non-existent task', () => {
        const result = db.deleteTask('non-existent');
        expect(result).toBe(false);
        expect(db.getAllTasks()).toHaveLength(10);
      });
    });

    describe('reset', () => {
      it('should reset to new tasks', () => {
        const newTasks = generateMockTasks(5);
        db.reset(newTasks);
        expect(db.getAllTasks()).toHaveLength(5);
      });

      it('should generate new tasks if none provided', () => {
        db.reset();
        expect(db.getAllTasks()).toHaveLength(100);
      });
    });
  });
});
