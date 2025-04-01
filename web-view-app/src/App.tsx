import React, { useEffect } from 'react';
import devvitClient from './lib/DevvitClient';

function App() {

  const [riddle, setRiddle] = React.useState<string | null>(null);
  const [answer, setAnswer] = React.useState<string | null>(null);

  useEffect(() => {
    // Set to true to use mocked responses on Bolt
    // Set to false when running `devvit playtest` to run the app with the real backend on Reddit
    const useMockedResponses = false; 
    devvitClient.initialize(useMockedResponses);


    // Listen for post data loaded from Devvit
    devvitClient.on('fetchPostDataReponse', (message) => {
        if (message.type !== 'fetchPostDataReponse') {
          console.error('WebView', 'Received unexpected message type:', message.type);
          return;
        }
        console.log('WebView', 'Received post data from Devvit:', message.data);
        setRiddle(message.data.postData.riddle);
        setAnswer(message.data.postData.answer);
      }
    );

    // Request post data from Devvit
    devvitClient.postMessage({
      type: 'fetchPostData',
    });
    console.log('WebView', 'Requesting post data from Devvit');

    // Clean up event listeners on unmount
    return () => {
      console.log('WebView', 'Cleaning up event listeners');
      devvitClient.off('fetchPostDataReponse');
    }
  }, []);

  return (
    <div className="App">
      <h1>Here's a Riddle:</h1>
      <h2>Riddle</h2>
      <p>{riddle}</p>
      <h2>Answer</h2>
      <p>{answer}</p>
    </div>
  );
}

export default App;