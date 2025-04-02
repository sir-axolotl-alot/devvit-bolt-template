import React, { useEffect } from 'react';
import devvitClient from './lib/DevvitClient';

function App() {

  const [instructions, setInstructions] = React.useState('');

  useEffect(() => {
    // Listen for post data loaded from Devvit
    devvitClient.on('fetchPostDataResponse', (message) => {
        if (message.type !== 'fetchPostDataResponse') {
          console.error('WebView', 'Received unexpected message type:', message.type);
          return;
        }
        console.log('WebView', 'Received post data from Devvit:', message.data);
        setInstructions(message.data.postData.instructions);
      }
    );

    // Request post data from Devvit
    devvitClient.postMessage({ type: 'fetchPostData' });
    console.log('WebView', 'Requesting post data from Devvit');

    // Clean up event listeners on unmount
    return () => {
      console.log('WebView', 'Cleaning up event listeners');
      devvitClient.off('fetchPostDataResponse');
    }
  }, []);

  return (
    <div className="App">
      <h1>{instructions}</h1>
    </div>
  );
}

export default App;