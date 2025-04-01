import { useEffect } from 'react';
import devvitClient from './lib/DevvitClient';

function App() {
  useEffect(() => {
    const useMockedResponses = false;
    devvitClient.initialize(useMockedResponses);
  }, []);

  return (
    <></>
  );
}

export default App;