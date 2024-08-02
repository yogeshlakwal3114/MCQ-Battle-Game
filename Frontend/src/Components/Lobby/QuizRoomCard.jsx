import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Modal, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
const API_URL = 'http://localhost:5000';

const QuizRoomCard = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timeTaken, setTimeTaken] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [roomResults, setRoomResults] = useState(false);
  const [winner, setWinner] = useState('');
  const [showScore, setShowScore] = useState(false);
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch room data
        const roomResponse = await axios.get(`${API_URL}/rooms/${roomId}`);
        const { players, emails } = roomResponse.data;
        const user1 = players[0];
        const user2 = players[1];
        const email1 = emails[0];
        const email2 = emails[1];
  
        // Set initial player states
        setPlayer1({ username: user1, email: email1, correctAnswers: 0, totalTimeTaken: 0 });
        setPlayer2({ username: user2, email: email2, correctAnswers: 0, totalTimeTaken: 0 });
  
        // Fetch random game data
        const gameResponse = await axios.get(`${API_URL}/game`);
        const games = gameResponse.data;

        // Check and update randomGame in roomFriendGame
        const roomResponseAgain = await axios.get(`${API_URL}/roomFriendGame/${roomId}`);
        const gameIndex = roomResponseAgain.data.randomGame;
        setQuestions(games[gameIndex].mcqs);
        setSubject(games[gameIndex].subject);
        setDifficulty(games[gameIndex].difficulty);
  
        // Emit game-started event with initial questions
        socket.emit('game-started', { roomId, questions: games[gameIndex].mcqs });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [roomId]);
  

  useEffect(() => {
    socket.on('game-started', ({ questions }) => {
      setQuestions(questions || []);
    });

    socket.on('player-finished', (data) => {
      if (data.player === player1.username) {
        setPlayer1(prevState => ({ ...prevState, correctAnswers: data.correctAnswers, totalTimeTaken: data.totalTimeTaken }));
      } else{
        setPlayer2(prevState => ({ ...prevState, correctAnswers: data.correctAnswers, totalTimeTaken: data.totalTimeTaken }));
      }
    });

    socket.on('game-over', (results) => {
      setRoomResults(results);
      setShowResults(true);
      setShowScore(true);
    });

    return () => {
      socket.off('game-started');
      socket.off('player-finished');
      socket.off('game-over');
    };
  }, [roomId]);

  const fetchUserEmail = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('User email not found in localStorage');
    }
    return userEmail;
  };
  
  const fetchUsername = async () => {
    const Email = fetchUserEmail();
    try {
      const response = await axios.get(`${API_URL}/users/user/${Email}`);
      return response.data.user.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 1) {
          handleNext();
          return 60;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleOptionSelect = (index) => setSelectedOption(index);

  const handleNext = () => {
    const timeSpent = 60 - timeRemaining;
    setTimeTaken([...timeTaken, timeSpent]);

    if (questions[currentQuestion]?.options[selectedOption] === questions[currentQuestion]?.correctAnswer) setCorrectAnswers(correctAnswers + 1);

    setSelectedOption(null);
    setTimeRemaining(60);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else handleFinish();
  };

  const handleFinish = async () => {
    const timeSpent = 60 - timeRemaining;
    const updatedTimeTaken = [...timeTaken, timeSpent];
    setTimeTaken(updatedTimeTaken);
  
    let updatedCorrectAnswers = correctAnswers;
    if (questions[currentQuestion]?.options[selectedOption] === questions[currentQuestion]?.correctAnswer) {
      updatedCorrectAnswers += 1;
      setCorrectAnswers(updatedCorrectAnswers);
    }

    const p1Email = fetchUserEmail();
    const p1 = await fetchUsername();
    const totalTimeTaken = updatedTimeTaken.reduce((acc, time) => acc + time, 0);
    const playerData = { username: p1, email:p1Email, correctAnswers: updatedCorrectAnswers, totalTimeTaken };
    console.log(playerData);

    const playerIndex = p1 === player1.username ? 0 : 1;

    try {
      const response = await axios.put(`http://localhost:5000/roomFriendGame/${roomId}`, {
        Finished : 1,
        removed : 0,
        playerIndex,
        correctAnswers: playerData.correctAnswers,
        totalTimeTaken: playerData.totalTimeTaken
      });
      console.log('Room updated:', response.data);
    } catch (error) {
      console.error('Error updating room:', error);
    }
    
    const roomResponseFinished = await axios.get(`${API_URL}/roomFriendGame/${roomId}`);
    const FinishedResult = roomResponseFinished.data.Finished;
    const ParticipatedData = roomResponseFinished.data.participants;
    if(FinishedResult === 2){
      player1.correctAnswers = ParticipatedData[0].correctAnswers;
      player1.totalTimeTaken = ParticipatedData[0].totalTimeTaken;
      player2.correctAnswers = ParticipatedData[1].correctAnswers;
      player2.totalTimeTaken = ParticipatedData[1].totalTimeTaken;

      const player1Email = player1.email;
      const player2Email = player2.email;
      if((ParticipatedData[0].correctAnswers > ParticipatedData[1].correctAnswers) || (ParticipatedData[0].correctAnswers === ParticipatedData[1].correctAnswers && ParticipatedData[0].totalTimeTaken < ParticipatedData[1].totalTimeTaken)){
          setWinner(player1.username);
          try{
            await axios.put(`http://localhost:5000/accuracyRoom/incrementCounts/${player1Email}`, {
                "type": "win",
                "subject": subject,
                "difficulty": difficulty
            });
    
            await axios.put(`http://localhost:5000/accuracyRoom/incrementCounts/${player2Email}`, {
              "type": "loss"
            });
          }catch(err){
            console.log(err);
          }
      }else {
          setWinner(player2.username);
          try{
            await axios.put(`http://localhost:5000/accuracyRoom/incrementCounts/${player2Email}`, {
                "type": "win",
                "subject": subject,
                "difficulty": difficulty
            });
            await axios.put(`http://localhost:5000/accuracyRoom/incrementCounts/${player1Email}`, {
              "type": "loss"
            });
          }catch(err){
            console.log(err);
          }
      }
    }
  
    socket.emit('player-finished', { roomId, player: p1, email: p1Email, correctAnswers: updatedCorrectAnswers, totalTimeTaken });
    setShowResults(true);
  };

  const handleClose = async () => {
    setShowResults(false);
      await axios.put(`http://localhost:5000/roomFriendGame/${roomId}`, {
        Finished : 0,
        removed : 1,
      });
    
      const roomResponseRemoved = await axios.get(`${API_URL}/roomFriendGame/${roomId}`);
      const FinishedResult = roomResponseRemoved.data.removed;
      if(FinishedResult === 2){
         await axios.delete(`${API_URL}/rooms/${roomId}`);
         await axios.delete(`${API_URL}/roomFriendGame/${roomId}`);
      }
    navigate('/rooms');
  };


/*..................If User go back from game before end................. */
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      handleFinish();
      handleClose();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentQuestion, selectedOption, correctAnswers, timeTaken, timeRemaining, player1, player2]);




  const handleResult = async () => {
    const roomResponseFinished = await axios.get(`${API_URL}/roomFriendGame/${roomId}`);
    const FinishedResult = roomResponseFinished.data.Finished;
    const ParticipatedData = roomResponseFinished.data.participants;
    if (FinishedResult === 2) {
      setShowScore(true);
      player1.correctAnswers = ParticipatedData[0].correctAnswers;
      player1.totalTimeTaken = ParticipatedData[0].totalTimeTaken;
      player2.correctAnswers = ParticipatedData[1].correctAnswers;
      player2.totalTimeTaken = ParticipatedData[1].totalTimeTaken;
      if((ParticipatedData[0].correctAnswers > ParticipatedData[1].correctAnswers) || (ParticipatedData[0].correctAnswers === ParticipatedData[1].correctAnswers && ParticipatedData[0].totalTimeTaken < ParticipatedData[1].totalTimeTaken)){
        setWinner(player1.username);
      }else {
          setWinner(player2.username);
      }
    } else {
      alert("Opponent Player not finished yet");
    }
  };

  const containerStyle = { backgroundColor: '#f8f9fa', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', color: '#000', padding: '20px', borderRadius: '8px' };
  const optionStyle = { color: '#000' };

  if (!questions.length) return <div>Loading...</div>;

  return (
    <Container className="quiz-container my-5" style={containerStyle}>
      {!showResults ? (
        <>
          <Row className="mb-3">
            <Col><strong>Player 1: {player1.username}</strong></Col>
            <Col><strong>Player 2: {player2.username}</strong></Col>
          </Row>
          <Row className="mb-3">
            <Col className="text-right"><span>Time remaining: {timeRemaining}s</span></Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <Card.Body>
                  <h2>Question {currentQuestion + 1} of {questions.length}</h2>
                  <p>{questions[currentQuestion]?.question}</p>
                  <ul className="list-group">
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <li key={index} className={`list-group-item ${selectedOption === index ? 'active' : ''}`} onClick={() => handleOptionSelect(index)} style={optionStyle}>
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
            </Col>
          </Row>
        </>
      ) : (
        <>
        <Modal show={showResults} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Quiz Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button variant="primary" onClick={handleResult}>Show Score</Button>
          </Modal.Body>
        </Modal>

        <Modal show={showScore} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Final Scores</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Correct Answers</th>
                  <th>Total Time Taken</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{player1.username}</td>
                  <td>{player1.correctAnswers}</td>
                  <td>{player1.totalTimeTaken} seconds</td>
                </tr>
                <tr>
                  <td>{player2.username}</td>
                  <td>{player2.correctAnswers}</td>
                  <td>{player2.totalTimeTaken} seconds</td>
                </tr>
              </tbody>
            </table>
            <p className="text-center"><strong>Winner: {winner}</strong></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
      )}
    </Container>
  );
};

export default QuizRoomCard;
