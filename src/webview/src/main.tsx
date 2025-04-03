import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import devvitClient from './lib/DevvitClient';
import boltConfig from '../../../devvit-bolt.config.json' with { type: 'json' };
import App from './App';

devvitClient.initialize(boltConfig.useMockedResponses);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
