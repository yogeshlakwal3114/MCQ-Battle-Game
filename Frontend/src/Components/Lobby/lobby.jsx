import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AdminModal from './AdminModal';
import EditQuiz from './EditMcq';
import Review from './Review';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/lobby.css';
import Leaderboard from './Leaderboard';
import Analytics from './analytics';

const App = () => {
  const [view, setView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleAccess = () => {
    setAccessGranted(true);
    handleClose();
  };

  useEffect(() => {
    if (view === 'createMcq' && !accessGranted) {
      handleShow();
    }
  }, [view, accessGranted]);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'analytics':
        return <Analytics />;
      case 'createMcq':
        return accessGranted ? <EditQuiz /> : <h1>You are not Admin</h1>;
      case 'review':
        return <Review />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar setView={setView} />
      </div>
      <div className="main-content p-4 content">
        {renderView()}
      </div>
      <AdminModal show={showModal} handleClose={handleClose} handleAccess={handleAccess} />
    </div>
  );
};

export default App;
