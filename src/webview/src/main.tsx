import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import devvitClient from './lib/DevvitClient';
import App from './App';

devvitClient.initialize(import.meta.env.VITE_RUN_MOCKS === 'true');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
