import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import PerformanceChart from './PerformanceChart';
import PlayModeSelection from './PlayModeSelection';
import SubjectSelection from './SubjectSelection';
import QuizTopicCard from './QuizCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Style/Dashboard.css';

const API_URL = 'http://localhost:5000';

const Dashboard = () => {
  const [playMode, setPlayMode] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardRoom, setDashboardRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Games
  const fetchGames = async (subject) => {
    try {
      const response = await axios.get(`${API_URL}/game`, {
        params: {
          subject: subject === 'All' ? '' : subject
        }
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      fetchGames(selectedSubject);
    }
  }, [selectedSubject]);

  // Fetch Dashboard Data
  useEffect(() => {
    const email = localStorage.getItem('userEmail'); // Get email from local storage

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard/${email}`);
        setDashboard(response.data);

        const responseRoom = await axios.get(`${API_URL}/accuracyRoom/${email}`);
        setDashboardRoom(responseRoom.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching dashboard data: {error.message}</div>;
  }

  const handlePlayModeChange = (mode) => {
    setPlayMode(mode);
    if (mode === 'friend') {
      navigate('/rooms');
    }
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };

  const handleStartQuiz = (_id) => {
    navigate(`/quiz/${_id}`);
  };

  // Calculate percentages for overall performance
  const totalAnswers = dashboard.TotalQuestions || 1;
  const correctPercentage = (dashboard.TotalCorrect / totalAnswers) * 100;
  const incorrectPercentage = (dashboard.TotalWrong / totalAnswers) * 100;
  const unansweredPercentage = (dashboard.TotalUnanswered / totalAnswers) * 100;

  // Calculate percentages for room performance
  const totalRoomGames = (dashboardRoom.wins + dashboardRoom.loss) || 1;
  const roomWinsPercentage = (dashboardRoom.wins / totalRoomGames) * 100;
  const roomLossPercentage = (dashboardRoom.loss / totalRoomGames) * 100;
  const roomDrawsPercentage = 0; // Assuming draws are not being tracked

  return (
    <div>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className='text-center Dashboard-headline'>Overall Performance</Card.Title>
          <Row>
            <Col md={6} style={{paddingLeft:'50px'}}>
              <PerformanceChart
                correctPercentage={correctPercentage}
                incorrectPercentage={incorrectPercentage}
                unansweredPercentage={unansweredPercentage}
              />
              {dashboard ? (
                <div className="performance-breakdown">
                  <p className='Dasboard-data-text'>Total Questions Attempted: <span style={{color:'black'}}>{dashboard.TotalQuestions}</span></p>
                  <p className='Dasboard-data-text'>Total Correct: <span style={{color:'#006400'}}>{dashboard.TotalCorrect}</span></p>
                  <p className='Dasboard-data-text'>Total Incorrect: <span style={{color:'red'}}>{dashboard.TotalWrong}</span></p>
                  <p className='Dasboard-data-text'>Total Unanswered: <span style={{color:'grey'}}>{dashboard.TotalUnanswered}</span></p>
                  <p className='Dasboard-data-text'>Per Question Average Time: <span style={{color:'black'}}>{dashboard.TotalTimeAverage} Sec </span></p>
                </div>
              ) : (
                <div>No dashboard data found</div>
              )}
            </Col>
            <Col md={6} style={{paddingLeft:'50px'}}>
              <PerformanceChart
                correctPercentage={roomWinsPercentage}
                incorrectPercentage={roomLossPercentage}
                unansweredPercentage={roomDrawsPercentage}
              />
              <div className="performance-breakdown">
                <p className='Dasboard-data-text'>Total Quiz Attempted: <span style={{color:'black'}}>{dashboardRoom.wins + dashboardRoom.loss}</span></p>
                <p className='Dasboard-data-text'>Wins: <span style={{color:'#006400'}}>{dashboardRoom.wins}</span></p>
                <p className='Dasboard-data-text'>Loss: <span style={{color:'red'}}>{dashboardRoom.loss}</span></p>
                <p className='Dasboard-data-text'>Draws: <span style={{color:'grey'}}>0</span></p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
  
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className='text-center Dashboard-headline'>Let's start a Quiz</Card.Title>
          <PlayModeSelection setPlayMode={handlePlayModeChange} />
          {playMode === 'individual' && (
            <div>
              <h3>Select Subject</h3>
              <SubjectSelection onSelectSubject={handleSubjectSelect} />
            </div>
          )}
        </Card.Body>
        <Card.Body>
          <div className="d-flex flex-wrap">
            {selectedSubject ? (
              selectedSubject !== 'All' ? (
                quizzes
                  .filter(topic => topic.subject === selectedSubject)
                  .map((topic, index) => (
                    <QuizTopicCard key={index} topic={topic} onStartQuiz={() => handleStartQuiz(topic._id)} />
                  ))
              ) : (
                quizzes.map((topic, index) => (
                  <QuizTopicCard key={index} topic={topic} onStartQuiz={() => handleStartQuiz(topic._id)} />
                ))
              )
            ) : (
              <div>Please select a subject to see available quizzes.</div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );  
};

export default Dashboard;
