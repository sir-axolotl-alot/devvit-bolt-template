import React, { useState } from 'react';
import Panel from '../components/Panel';
import Button from '../components/Button';

const UserData: React.FC = () => {
  const [content, setContent] = useState<string>('Select an action');

  const handleFetchUsers = () => {
    setContent('Fetched user data would appear here');
  };

  const handleUpdateUser = () => {
    setContent('User update form would appear here');
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