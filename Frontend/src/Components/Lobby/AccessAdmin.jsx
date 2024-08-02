import React, { useState } from 'react';
import EditQuiz from './EditQuiz';
import AdminModal from './AdminModal';

const AdminDashboard = () => {
  const [showAdminModal, setShowAdminModal] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const handleAccess = () => {
    setHasAccess(true);
    setShowAdminModal(false);
  };

  const handleClose = () => {
    setShowAdminModal(false);
  };

  return (
    <div>
      <AdminModal show={showAdminModal} handleClose={handleClose} handleAccess={handleAccess} />
      {hasAccess && <EditQuiz />}
    </div>
  );
};

export default AdminDashboard;
