import React, { useState, useEffect } from 'react';
import Panel from '../components/Panel';
import Button from '../components/Button';
import devvitClient from '../lib/DevvitClient';

const Leaderboards: React.FC = () => {
  const [content, setContent] = useState<string>('Select an action');

  useEffect(() => {
    // Set up message handler for leaderboard data
    devvitClient.on('GET_WEEKLY_LEADERBOARD_RESPONSE', (data) => {
      setContent(`Received weekly leaderboard: ${JSON.stringify(data)}`);
    });

    devvitClient.on('GET_ALL_TIME_LEADERBOARD_RESPONSE', (data) => {
      setContent(`Received all-time leaderboard: ${JSON.stringify(data)}`);
    });

    // Clean up event listeners when component unmounts
    return () => {
      devvitClient.off('GET_WEEKLY_LEADERBOARD_RESPONSE');
      devvitClient.off('GET_ALL_TIME_LEADERBOARD_RESPONSE');
    };
  }, []);

  const handleShowWeekly = () => {
    setContent('Fetching weekly leaderboard...');
    devvitClient.getWeeklyLeaderboard();
  };

  const handleShowAllTime = () => {
    setContent('Fetching all-time leaderboard...');
    devvitClient.getAllTimeLeaderboard();
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Leaderboards</h1>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 sm:w-48">
          <Button onClick={handleShowWeekly}>Weekly Rankings</Button>
          <Button onClick={handleShowAllTime} variant="secondary">All-time Rankings</Button>
        </div>
        
        <div className="flex-1">
          <Panel title="Leaderboard Information">
            <p className="text-gray-600">{content}</p>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;