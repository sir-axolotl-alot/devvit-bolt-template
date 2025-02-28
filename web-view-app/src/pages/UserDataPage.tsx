import React, { useState, useEffect } from 'react';
import Panel from '../components/Panel';
import Button from '../components/Button';
import devvitClient from '../lib/DevvitClient';
import { GameUserData, RedditUserData } from '../../../shared/types/userData';

const UserDataPage: React.FC = () => {
  const [redditUser, setRedditUser] = useState<RedditUserData|undefined>(undefined);
  const [dbUser, setDbUser] = useState<GameUserData|undefined>(undefined);

  useEffect(() => {
    // Set up message handler for user data
    devvitClient.on('fetchUserDataResponse', (message) => {
      console.log('Received user data', message);
      if ('redditUser' in message.data) {
        setRedditUser(message.data.redditUser as RedditUserData);
        console.log('Set reddit user state:', message.data.redditUser);
      }
      if ('dbUser' in message.data) {
        setDbUser(message.data.dbUser as GameUserData);
        console.log('Set db user state:', message.data.dbUser);
      }
    });

    // Clean up event listeners when component unmounts
    return () => {
      devvitClient.off('fetchUserDataResponse');
    };
  }, []);

  const handleFetchUser = () => {
    devvitClient.postMessage({ type: 'fetchUserData', data: { userId: devvitClient.userId! } });
  };

  const sendCurrentUserToDevvit = (user: GameUserData|undefined) => {
    if (!user) {
      console.error('No user data to send');
      return;
    }
    devvitClient.postMessage({ type: 'setUserData', data: { userId: devvitClient.userId!, userData: user } });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl font-bold text-gray-800">User Data</h1>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 sm:w-48">
          <Button onClick={handleFetchUser}>Fetch User Info</Button>
          <Panel title="Demo Instructions">
            <p className="text-gray-600">User data is defined in <pre>userData.ts</pre>. Some user data comes from the Reddit API. Use the payments tab to acquire weapons.</p>
          </Panel>
        </div>
        <div className="flex-1">
          <Panel title="Reddit User Info">
            {redditUser === undefined ? (
              <p className="text-gray-600"><i>(No Reddit user data loaded)</i></p>
            ) : (
              <>
                <p className="text-gray-600">Username: <b>{redditUser.username}</b> </p>
                <p className="text-gray-600">User ID: <b>{redditUser.userId}</b></p>
              </>
            )}
          </Panel>
          <Panel title="Redis User Info">
            <div>
              <p className="text-gray-600">Favorite color:</p>
              {dbUser === undefined ? (
                <p className="text-gray-600"><i>(No Redis user data loaded)</i></p>
              ) : (
                <>
                  <input
                    type="string"
                    value={dbUser ? dbUser.favoriteColor : ''}
                    onChange={(e) => setDbUser(dbUser ? {...dbUser, favoriteColor: e.target.value} : undefined)}
                    className="border border-gray-300 rounded-md p-2" ></input>      
                  <Button onClick={() => sendCurrentUserToDevvit(dbUser)} >Save</Button>    
                </>
                )}                    
            </div>
            <div style={{ overflowY: 'scroll', maxHeight: '200px' }}>
              <p className="text-gray-600">Acquired weapons:</p>
              {dbUser === undefined ? (
                <p className="text-gray-600"><i>(No Redis user data loaded)</i></p>
              ) : (
              <>
              <ul>
                {Object.entries(
                  (dbUser?.weapons || []).reduce((acc: Record<string, number>, str: string) => {
                    acc[str] = (acc[str] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([name, count]) => (
                  <li key={name}>
                    {name} (x{count})
                  </li>
                ))}
              </ul>
              </>
            )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default UserDataPage;