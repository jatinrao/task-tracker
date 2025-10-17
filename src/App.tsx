import { Provider } from 'react-redux';
import { store } from './store/store';
import { Dashboard } from './components/pages/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}

export default App;
