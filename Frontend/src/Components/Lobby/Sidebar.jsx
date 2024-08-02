import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaChartBar, FaClipboardList, FaRegCheckCircle, FaTrophy, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Profile from '../Services/Profile';
import '../Style/Sidebar.css';

const Sidebar = ({ setView }) => {
  const [activeKey, setActiveKey] = useState('dashboard');
  const navigate = useNavigate();

  const handleSelect = (key) => {
    setActiveKey(key);
    if (key === 'home') {
      navigate('/');
    } else {
      setView(key);
    }
  };

  return (
    <Nav defaultActiveKey="/dashboard" className="flex-column sidebar shadow p-3 mb-5 bg-body rounded">
      <div>
        <Profile />
      </div>
      <Nav.Link
        onClick={() => handleSelect('dashboard')}
        className={`sidebar-link dashboard-link ${activeKey === 'dashboard' ? 'active' : ''}`}
      >
        <FaTachometerAlt className="sidebar-icon dashboard-link" /> <strong className='dashboard-link'>Dashboard</strong>
      </Nav.Link>
      <Nav.Link
        onClick={() => handleSelect('leaderboard')}
        className={`sidebar-link leaderboard-link ${activeKey === 'leaderboard' ? 'active' : ''}`}
      >
        <FaTrophy className="sidebar-icon leaderboard-link" /> <strong className='leaderboard-link'>Leaderboard</strong> 
      </Nav.Link>
      <Nav.Link
        onClick={() => handleSelect('analytics')}
        className={`sidebar-link analytics-link ${activeKey === 'analytics' ? 'active' : ''}`}
      >
        <FaChartBar className="sidebar-icon analytics-link" /> <strong className='analytics-link'>Analytics</strong>
      </Nav.Link>
      <Nav.Link
        onClick={() => handleSelect('createMcq')}
        className={`sidebar-link createMcq-link ${activeKey === 'createMcq' ? 'active' : ''}`}
      >
        <FaClipboardList className="sidebar-icon createMcq-link" /> <strong className='createMcq-link'>Create MCQ</strong>
      </Nav.Link>
      <Nav.Link
        onClick={() => handleSelect('review')}
        className={`sidebar-link review-link ${activeKey === 'review' ? 'active' : ''}`}
      >
        <FaRegCheckCircle className="sidebar-icon review-link" /> <strong className='review-link'>Review</strong> 
      </Nav.Link>
      <Nav.Link
        onClick={() => handleSelect('home')}
        className={`sidebar-link home-link ${activeKey === 'home' ? 'active' : ''}`}
      >
        <FaHome className="sidebar-icon home-link" /> <strong className='home-link'>Home</strong>  
      </Nav.Link>
    </Nav>
  );
};

export default Sidebar;


