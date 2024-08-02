import React, { useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import '../Style/SubjectSelection.css'; 

const SubjectSelection = ({ onSelectSubject }) => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (subject) => {
    setSelectedButton(subject);
    onSelectSubject(subject);
  };

  return (
    <div className="subject-selection-container">
      <ButtonGroup className="subject-selection">
        {['All', 'Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning'].map((subject, index) => (
          <div key={index} className="subject-button-container">
            <Button
              className={`subject-button ${selectedButton === subject ? 'active' : ''}`}
              onClick={() => handleButtonClick(subject)}
            >
              {subject}
            </Button>
          </div>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default SubjectSelection;
