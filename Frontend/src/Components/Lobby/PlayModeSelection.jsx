import React from 'react';
import { Button } from 'react-bootstrap';
import '../Style/Dashboard.css';

const PlayModeSelection = ({ setPlayMode }) => {
  return (
    <div className="d-flex justify-content-between play-mode">
      <Button className='dashboard-button' onClick={() => setPlayMode('individual')}>Play Individual</Button>
      <Button className='dashboard-button' onClick={() => setPlayMode('friend')}>Play with Friend</Button>
    </div>
  );
};

export default PlayModeSelection;
