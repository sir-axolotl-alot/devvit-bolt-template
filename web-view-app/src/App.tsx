import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import UserDataPage from './pages/UserDataPage';
import PostData from './pages/PostDataPage';
import Leaderboards from './pages/LeaderboardsPage';
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
          <Route path="/" element={<Navigate to="/post-data" replace />} />
          <Route path="/user-data" element={<UserDataPage />} />
          <Route path="/post-data" element={<PostData />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;