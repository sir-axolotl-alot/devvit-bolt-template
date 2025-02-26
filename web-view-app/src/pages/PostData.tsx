import React, { useState } from 'react';
import Panel from '../components/Panel';
import Button from '../components/Button';

const PostData: React.FC = () => {
  const [content, setContent] = useState<string>('Select an action');

  const handleFetchPosts = () => {
    setContent('Fetched post data would appear here');
  };

  const handleCreatePost = () => {
    setContent('Post creation form would appear here');
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Post Data</h1>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 sm:w-48">
          <Button onClick={handleFetchPosts}>Fetch Posts</Button>
          <Button onClick={handleCreatePost} variant="secondary">Create Post</Button>
        </div>
        
        <div className="flex-1">
          <Panel title="Post Information">
            <p className="text-gray-600">{content}</p>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default PostData;