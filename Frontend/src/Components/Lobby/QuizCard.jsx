import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../Style/SubjectSelection.css'; 

const QuizTopicCard = ({ topic, onStartQuiz }) => {
  const [attempted, setAttempted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quizDetails, setQuizDetails] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/dashboard/${userEmail}`);
        const data = response.data;

        // Check if the gameId exists in the games array
        const gameExists = data.games.some(game => game.gameId === topic._id);
        const filteredQuiz = data.games.find(game => game.gameId === topic._id);
        if (filteredQuiz) {
          setScore(filteredQuiz.Correct);
        }
        setAttempted(gameExists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [topic]);

  const handleViewScore = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/game/${topic._id}`);
      const filteredGames = response.data.filter(game => game._id === `${topic._id}`);
      setQuizDetails(filteredGames[0].mcqs);
      console.log(topic._id, filteredGames[0].mcqs);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  return (
    <>
      <Card className="mb-3" style={{ width: '100%' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {/* <strong>GameId:</strong> {topic.gameId} <br /> */}
              <Card.Title><strong className='quiz-headline'> {topic.gameName}</strong></Card.Title>
              <div>
                <strong className='quiz-paragraph'>Difficulty:</strong> <strong className='quiz-data'>{topic.difficulty}</strong><br />
                <strong className='quiz-paragraph'>Subject: </strong> <strong className='quiz-data'> {topic.subject}</strong><br/>
                <strong className='quiz-paragraph'>Number of Questions:</strong> <strong className='quiz-data'>{topic.noOfQuestions} </strong>
              </div>
            </div>
            <div className="d-flex flex-column align-items-end">
              <div className="mb-2 text-primary">
                Status: 
                <span style={{ color: attempted ? 'green' : 'grey', marginLeft: '5px' }} className='quiz-data'>
                  {attempted ? 'Attempted' : 'Not Attempted'}
                </span>
              </div>
              <Button variant="primary" onClick={attempted ? handleViewScore : onStartQuiz} className='quiz-data'>
                {attempted ? 'View Score' : 'Start Quiz'}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Quiz Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 style={{textAlign:'center', color:'green'}}><strong>Your Score :</strong> {score}</h5>
          <hr />
          {quizDetails ? (
            <div style={{paddingLeft:'20px'}}>
              {quizDetails.map((mcq, index) => (
                <div key={index}>
                  <p><strong style={{fontWeight:'bold'}}>Question {index + 1}:</strong> {mcq.question}</p>
                  <ul>
                    {mcq.options.map((option, i) => (
                      <li key={i} style={{ color: option === mcq.correctAnswer ? 'green' : 'black' }}>
                        {option} {option === mcq.correctAnswer && '(Correct)'}
                      </li>
                    ))}
                  </ul>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuizTopicCard;
