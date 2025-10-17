export const db = {
  reset: jest.fn(),
  getAllTasks: jest.fn(() => []),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};
 
export const handlers = [];