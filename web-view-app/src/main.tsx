import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import devvitClient from './lib/DevvitClient.ts';
import boltConfig from '../../devvit-bolt.config.json';

devvitClient.initialize(boltConfig.useMockedResponses);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
