import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../Style/Quiz.css'; 

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [unanswered, setUnanswered] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timeTaken, setTimeTaken] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { _id } = useParams();

  const [length, setLength] = useState(0);
  const [Subject, setSubject] = useState('');
  const [Difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/game/${_id}`);
        const filteredGames = response.data.filter(game => game._id === `${_id}`);
        setLength(filteredGames[0].noOfQuestions);
        setSubject(filteredGames[0].subject);
        setDifficulty(filteredGames[0].difficulty);
        setQuestions(filteredGames[0].mcqs);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [_id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime === 1) {
          handleNext();
          return 60;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    const timeSpent = 60 - timeRemaining;
    setTimeTaken([...timeTaken, timeSpent]);

    if (selectedOption === null) {
      setUnanswered(unanswered + 1);
    } else if (questions[currentQuestion]?.options[selectedOption] === questions[currentQuestion]?.correctAnswer) {   // selectedOption === questions[currentQuestion].answer
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    setSelectedOption(null);
    setTimeRemaining(60);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleFinish = () => {
    const timeSpent = 60 - timeRemaining;
    setTimeTaken([...timeTaken, timeSpent]);

    if (selectedOption === null) {
      setUnanswered(unanswered + 1);
    } else if (questions[currentQuestion]?.options[selectedOption] === questions[currentQuestion]?.correctAnswer) {   // selectedOption === questions[currentQuestion].answer
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    setShowResults(true);
  };

  const totalTimeTaken = timeTaken.reduce((acc, time) => acc + time, 0);

  const updateDashboard = async () => {
    const email = localStorage.getItem('userEmail'); // Fetch email from local storage
    const averageTimeTaken = totalTimeTaken / questions.length;

    const data = {
      email: email,
      TotalQuestions: questions.length,
      TotalCorrect: correctAnswers,
      TotalWrong: incorrectAnswers,
      TotalUnanswered: unanswered,
      TotalTimeAverage: averageTimeTaken,
      games: [
        {
          gameId: _id,
          Correct: correctAnswers
        }
      ]
    };

    try {
      await axios.post('http://localhost:5000/dashboard', data);
      console.log("Dashboard updated successfully");
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  };
  
  const updateDashboardAndAccuracy = async () => {
    const email = localStorage.getItem('userEmail'); // Fetch email from local storage
    const accuracys = (correctAnswers*100) / length; // Calculate accuracy
  
    const AccuracySubject = {
      email: email,
      category: Subject,
      accuracy: accuracys,
    };
  
    const AccuracyDifficulty = {
      email: email,
      category: Difficulty,
      accuracy: accuracys,
    };
  
    try {
      await axios.post('http://localhost:5000/accuracy', AccuracySubject);
      console.log("Subject Accuracy updated successfully");
  
      await axios.post('http://localhost:5000/accuracy', AccuracyDifficulty);
      console.log("Difficulty Accuracy updated successfully");
    } catch (error) {
      console.error('Error updating dashboard or accuracy:', error);
    }
  };


  const handleClose = () => {
    setShowResults(false);
    updateDashboard();
    updateDashboardAndAccuracy();
    navigate('/lobby');
  };

  const containerStyle = {
    backgroundColor: '#f8f9fa', // Milky color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    color: '#000', // Black text
    padding: '20px',
    borderRadius: '8px'
  };

  const optionStyle = {
    color: '#000' // Black text for options
  };

  return (
    <Container className="quiz-container my-5" style={containerStyle}>
      {!showResults ? (
        <>
          <Row className="mb-3">
            <Col className="text-right">
              <span>Time remaining: {timeRemaining}s</span>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <Card.Body>
                  <h2>Question {currentQuestion + 1} of {questions.length}</h2>
                  <p>{questions[currentQuestion]?.question}</p>
                  <ul className="list-group">
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <li
                        key={index}
                        className={`list-group-item ${selectedOption === index ? 'active' : ''}`}
                        onClick={() => handleOptionSelect(index)}
                        style={optionStyle}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="text-center">
              {currentQuestion < questions.length - 1 ? (
                <Button variant="secondary" onClick={handleNext}>Next</Button>
              ) : (
                <Button variant="primary" onClick={handleFinish}>Submit</Button>
              )}
              <Button variant="danger" onClick={handleFinish} className="ml-2">Finish</Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="text-center">
              <p>Correct Answers: {correctAnswers}</p>
              <p>Incorrect Answers: {incorrectAnswers}</p>
              <p>Unanswered Questions: {unanswered}</p>
            </Col>
          </Row>
        </>
      ) : (
        <Modal show={showResults} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Quiz Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Correct Answers: {correctAnswers}</p>
            <p>Incorrect Answers: {incorrectAnswers}</p>
            <p>Unanswered Questions: {unanswered}</p>
            <p>Total Time Taken: {totalTimeTaken} seconds</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Quiz;
