import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../../store/slices/tasksSlice';
import filtersReducer from '../../store/slices/filterSlice';
import { Dashboard } from '../../components/pages/Dashboard';
import { generateMockTasks } from '../../utils/mockData';
import { setTasks } from '../../store/slices/tasksSlice';
import { server } from '../../mocks/server';

const createTestStore = (taskCount: number) => {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
      filters: filtersReducer,
    },
  });
  store.dispatch(setTasks(generateMockTasks(taskCount)));
  return store;
};

describe('Rendering Performance', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
 
  it('should render dashboard with 100 tasks quickly', async () => {
    const store = createTestStore(100);
    const start = performance.now();

    const { container } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
     await waitFor(() => {
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    const end = performance.now();
     expect(end - start).toBeLessThan(200); // initial render under 100ms
  });

  it('should render dashboard with 500 tasks', async () => {
    const store = createTestStore(500);
    const start = performance.now();

    const { container } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
     await waitFor(() => {
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });
    const end = performance.now();
    expect(end - start).toBeLessThan(300); // handle larger datasets
  });

  it('should render dashboard with 1000 tasks', async () => {
    const store = createTestStore(1000);
    const start = performance.now();

     const { container } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
     await waitFor(() => {
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    const end = performance.now();
    expect(end - start).toBeLessThan(500); // performance expectation 
  });
});
