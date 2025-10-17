import tasksReducer, {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} from '../../store/slices/tasksSlice';
import { type Task, type TasksState } from '../../types';

describe('tasksSlice', () => {
  const initialState: TasksState = {
    items: [],
    loading: false,
    error: null,
  };

  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    category: 'A',
    status: 'todo',
    date: '2025-09-01',
    amount: 500,
  };

  it('should return initial state', () => {
    expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setTasks', () => {
    it('should set tasks and clear loading/error', () => {
      const tasks = [mockTask];
      const state = tasksReducer(
        { ...initialState, loading: true, error: 'Some error' },
        setTasks(tasks)
      );
      expect(state.items).toEqual(tasks);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('addTask', () => {
    it('should add a new task', () => {
      const state = tasksReducer(initialState, addTask(mockTask));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockTask);
    });

    it('should add task to existing list', () => {
      const existingState = { ...initialState, items: [mockTask] };
      const newTask = { ...mockTask, id: 'task-2', title: 'New Task' };
      const state = tasksReducer(existingState, addTask(newTask));
      expect(state.items).toHaveLength(2);
      expect(state.items[1]).toEqual(newTask);
    });
  });

  describe('updateTask', () => {
    it('should update existing task', () => {
      const existingState = { ...initialState, items: [mockTask] };
      const updatedTask = { ...mockTask, status: 'done' as const };
      const state = tasksReducer(existingState, updateTask(updatedTask));
      expect(state.items[0].status).toBe('done');
    });

    it('should not modify state if task not found', () => {
      const existingState = { ...initialState, items: [mockTask] };
      const nonExistentTask = { ...mockTask, id: 'task-999' };
      const state = tasksReducer(existingState, updateTask(nonExistentTask));
      expect(state.items).toEqual(existingState.items);
    });
  });

  describe('deleteTask', () => {
    it('should delete task by id', () => {
      const existingState = { ...initialState, items: [mockTask] };
      const state = tasksReducer(existingState, deleteTask('task-1'));
      expect(state.items).toHaveLength(0);
    });

    it('should not modify state if task not found', () => {
      const existingState = { ...initialState, items: [mockTask] };
      const state = tasksReducer(existingState, deleteTask('task-999'));
      expect(state.items).toEqual(existingState.items);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const state = tasksReducer(initialState, setLoading(true));
      expect(state.loading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error and clear loading', () => {
      const state = tasksReducer(
        { ...initialState, loading: true },
        setError('Test error')
      );
      expect(state.error).toBe('Test error');
      expect(state.loading).toBe(false);
    });

    it('should clear error when null', () => {
      const state = tasksReducer({ ...initialState, error: 'Old error' }, setError(null));
      expect(state.error).toBeNull();
    });
  });
});
