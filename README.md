# Task Tracker Dashboard

A production-grade, fully-tested React + TypeScript task tracker dashboard with comprehensive functional coverage and performance validation.

## Features

-  **Interactive Charts**: Status and category distribution pie charts, timeline bar chart with date range filtering
-  **Advanced Filtering**: OR logic within charts, AND logic across charts, search functionality
-  **Sortable Table**: Multi-column sorting, pagination, responsive design
-  **State Persistence**: Filter state persisted to localStorage
-  **Mock Backend**: MSW (Mock Service Worker) for realistic API simulation
-  **Testing**: Unit, integration, and performance tests with >75% coverage
-  **Performance Optimized**: Memoized selectors, efficient re-renders, handles 1000+ tasks

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with memoized selectors
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library, MSW
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Architecture
Following **Atomic Design** principles:

```
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Input, Badge, Card)
│   ├── molecules/      # Simple combinations (SearchBar, DateRangeSelector, StatsCard)
│   ├── organisms/      # Complex components (Charts, TaskTable)
│   ├── templates/      # Page layouts
│   └── pages/          # Complete pages (Dashboard)
├── store/
│   ├── slices/         # Redux slices (tasks, filters)
│   ├── selectors/      # Memoized selectors
│   ├── store.ts        # Store configuration
│   └── hooks.ts        # Typed Redux hooks
├── services/           # API service layer
├── mocks/              # MSW handlers and mock database
├── utils/              # Utility functions (mock data generator)
├── types/              # TypeScript type definitions
└── __tests__/          # Test suites
    ├── unit/           # Unit tests for reducers, selectors, components
    ├── integration/    # Integration tests with MSW
    └── performance/    # Performance benchmarks
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing Strategy

### Unit Tests
- **Reducers**: 100% coverage of all Redux actions and state mutations
- **Selectors**: Comprehensive testing of filtering logic and memoization
- **Components**: Testing of atomic components with user interactions
- **Mock Data**: Validation of data generation and mock database operations

### Integration Tests
- **API Integration**: Full CRUD operations with MSW
- **Dashboard**: End-to-end user workflows with filters and charts
- **State Persistence**: localStorage hydration and persistence

### Performance Tests
- **Selector Performance**: Benchmarks for 1000+ tasks (< 200ms)
- **Rendering Performance**: Initial render benchmarks
- **Memoization**: Verification of selector caching effectiveness


## Key Features Explained

### Filter Logic
- **OR within charts**: Clicking multiple segments in a chart shows tasks matching ANY selected value
- **AND across charts**: Filters from different charts are combined with AND logic
- **Search**: Case-insensitive search across task titles
- **Date Range**: Three presets (7 days, 30 days, all time) + custom range via chart clicks

### Performance Optimizations
1. **Memoized Selectors**: Using `createSelector` from Redux Toolkit to prevent unnecessary recalculations
2. **React.memo**: Wrapping components to prevent re-renders when props haven't changed
3. **Efficient Data Structures**: Using Map/Set for O(1) lookups in filtering logic


### State Management
- **Tasks Slice**: Manages task CRUD operations and loading states
- **Filters Slice**: Manages all filter state with localStorage persistence
- **Middleware**: Custom middleware for automatic filter persistence

## Mock Data

The application generates 200 mock tasks spanning August-October 2025 with:
- **Categories**: frontend, backend, design, testing, devops
- **Statuses**: todo, in-progress, done, blocked
- **Amounts**: Random values between $100-$1000
- **Dates**: Evenly distributed across the date range



