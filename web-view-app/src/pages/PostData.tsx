import React, { useState, useEffect } from 'react';
import Panel from '../components/Panel';
import Button from '../components/Button';
import devvitClient from '../lib/DevvitClient';

const PostData: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [poem, setPoem] = useState<string>('(post data will show here)');

  useEffect(() => {
    // Set up message handler for post data
    devvitClient.on('postDataReponse', (message) => {
      if ('postData' in message.data) {
        setTitle(message.data.postData.poemTitle);
        setPoem(message.data.postData.poemBody);
      }      
    });
    
    // Clean up event listeners when component unmounts
    return () => {
      devvitClient.off('postDataReponse');
    };
  }, []);

  const handleCreatePost = () => {
    devvitClient.postMessage({ type: 'createNewPost' });
  };

  const fetchPostData = () => {
    setTitle('');
    setPoem('(Loading...)');
    devvitClient.postMessage({ type: 'fetchPostData' });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Post Information</h1>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 sm:w-48">
          <Button onClick={fetchPostData} >Fetch Post Data</Button>
          <Button onClick={handleCreatePost} variant="secondary">Create Post</Button>
        </div>

        <div className="flex-1">
          <Panel title="Demo Instructions">
            <p className="text-gray-600">In this example, each post has an AI-generated poem. Click the buttons to the left to load data for this post, or create a new post with a new poem</p>
          </Panel>

          <Panel title={title}>
            <p className="text-gray-600" style={{whiteSpace: 'pre-line'}}>{poem}</p>
          </Panel>         
        </div>
      </div>
    </div>
  );
};

export default PostData;