import React, { useEffect } from 'react';
import devvitClient from './lib/DevvitClient';

function App() {
  useEffect(() => {
    const useMockedResponses = false;
    devvitClient.initialize(useMockedResponses);
  }, []);

  return (
    <div className="App">
      <h1>Your app goes here</h1>
    </div>
  );
}

export default App;