import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

async function enableMocking() {
  // TO_DO :Enabled MSW for demo purposes (disable in real production with backend)
  try {
    const { worker } = await import('./mocks/browser.ts');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false, 
    });
    console.log('MSW started successfully');
  } catch (error) {
    console.error('MSW failed to start:', error);
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
