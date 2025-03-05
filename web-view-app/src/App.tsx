import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import UserDataPage from './pages/UserDataPage';
import PostDataPage from './pages/PostDataPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import devvitClient from './lib/DevvitClient';
import PaymentsPage from './pages/PaymentsPage';

function App() {
  useEffect(() => {
    const useMockedResponses = false;
    devvitClient.initialize(useMockedResponses);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/post-data" replace />} />
          <Route path="/user-data" element={<UserDataPage />} />
          <Route path="/post-data" element={<PostDataPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;