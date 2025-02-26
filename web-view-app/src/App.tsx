import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UserData from './pages/UserData';
import PostData from './pages/PostData';
import Leaderboards from './pages/Leaderboards';
import devvitClient from './lib/DevvitClient';

function App() {
  useEffect(() => {
    // Initialize the DevvitClient when the app starts
    devvitClient.initialize();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<UserData />} />
          <Route path="/user-data" element={<UserData />} />
          <Route path="/post-data" element={<PostData />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;