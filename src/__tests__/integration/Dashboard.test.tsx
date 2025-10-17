import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../../store/slices/tasksSlice';
import filtersReducer from '../../store/slices/filterSlice';
import { Dashboard } from '../../components/pages/Dashboard';
import { generateMockTasks } from '../../utils/mockData';
import { api } from '../../services/api';

// Mock the API
jest.mock('../../services/api', () => ({
  api: {
    getTasks: jest.fn(),
    getTask: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

const createTestStore = () =>
  configureStore({
    reducer: {
      tasks: tasksReducer,
      filters: filtersReducer,
    },
  });

const renderDashboard = () => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    ),
    store,
  };
};

describe('Dashboard Integration', () => {
  const mockTasks = generateMockTasks(50);
  
  beforeEach(() => {
    mockApi.getTasks.mockResolvedValue(mockTasks);
    localStorage.clear();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  

  it('should load and display tasks', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  
});
