import React, { useEffect } from 'react';
import devvitClient from './lib/DevvitClient';

function App() {
  useEffect(() => {
    // Set to true to use mocked responses on Bolt
    // Set to false when running `devvit playtest` to run the app with the real backend on Reddit
    const useMockedResponses = true; 
    devvitClient.initialize(useMockedResponses);
  }, []);

  return (
    <div className="App">
      <h1>Your app goes here</h1>
    </div>
  );
}

export default App;