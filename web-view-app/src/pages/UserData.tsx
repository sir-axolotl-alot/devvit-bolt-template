import React, { useState, useEffect } from 'react';
import Panel from '../components/Panel';
import Button from '../components/Button';
import devvitClient from '../lib/DevvitClient';
import { DevvitMessage } from '../../../shared/types/message';

const UserData: React.FC = () => {
  const [content, setContent] = useState<string>('Select an action');

  useEffect(() => {
    // Set up message handler for user data
    devvitClient.on('initialData', (message) => {
      if ('postData' in message.data) {
        const initialData = message.data.postData;
        setContent(`Title ${initialData.poemTitle} - Body: ${initialData.poemBody}`);
      }
    });

    // Clean up event listeners when component unmounts
    return () => {
      devvitClient.off('initialData');
    };
  }, []);

  const handleFetchUsers = () => {
    setContent('Fetching user data...');
    devvitClient.fetchUsers();
  };

  const handleUpdateUser = () => {
    setContent('Preparing to update user...');
    devvitClient.updateUser({ id: 1, name: 'Updated User' });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl font-bold text-gray-800">User Data</h1>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 sm:w-48">
          <Button onClick={handleFetchUsers}>Fetch Users</Button>
          <Button onClick={handleUpdateUser} variant="secondary">Update User</Button>
        </div>
        
        <div className="flex-1">
          <Panel title="User Information">
            <p className="text-gray-600">{content}</p>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default UserData;