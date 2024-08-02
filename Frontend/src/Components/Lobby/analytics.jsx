import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PerformanceChart from './PerformanceChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/Dashboard.css'; 

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'http://localhost:5000';

const Analyze = () => {
  const [dashboardRoom, setDashboardRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subjectWiseData, setSubjectWiseData] = useState({
    labels: ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning'],
    datasets: [{
      label: 'Accuracy (%)',
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }]
  });

  const [difficultyWiseData, setDifficultyWiseData] = useState({
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      label: 'Accuracy (%)',
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem('userEmail'); // Get email from local storage
        const response = await axios.get(`http://localhost:5000/accuracy/${email}`);
        const data = response.data;

        // Update subject-wise data
        setSubjectWiseData({
          labels: ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning'],
          datasets: [{
            label: 'Accuracy (%)',
            data: [
              data['Quantitative Aptitude'].averageAccuracy,
              data['Verbal Ability'].averageAccuracy,
              data['Logical Reasoning'].averageAccuracy
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        });

        // Update difficulty-wise data
        setDifficultyWiseData({
          labels: ['Easy', 'Medium', 'Hard'],
          datasets: [{
            label: 'Accuracy (%)',
            data: [
              data.easy.averageAccuracy,
              data.medium.averageAccuracy,
              data.hard.averageAccuracy
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error('Error fetching accuracy data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('userEmail'); // Get email from local storage

    const fetchDashboard = async () => {
      try {
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

  // Calculate percentages for overall performance
  const totalMedium = (dashboardRoom.easy + dashboardRoom.medium + dashboardRoom.medium) || 1;
  const easyPercentage = (dashboardRoom.easy / totalMedium) * 100;
  const mediumPercentage = (dashboardRoom.medium / totalMedium) * 100;
  const hardPercentage = (dashboardRoom.hard / totalMedium) * 100;

  // // Calculate percentages for room performance
  const totalSubject = (dashboardRoom['Quantitative Aptitude'] + dashboardRoom['Verbal Ability'] + dashboardRoom['Logical Reasoning']) || 1;
  const QuantAptPercentage = (dashboardRoom['Quantitative Aptitude'] / totalSubject) * 100;
  const VerAbPercentage = (dashboardRoom['Verbal Ability'] / totalSubject) * 100;
  const LogRePercentage = (dashboardRoom['Logical Reasoning'] / totalSubject) * 100;

  return (
    <Container className="mt-4">
      <h2 className="mb-4" style={{textAlign:'center', fontFamily:'Overpass', fontSize:'28px', color:'#28a745', paddingTop:'20px', textDecoration:'underline'}}>Performance Analysis</h2>
      <div className='mb-2 shadow-sm' style={{marginTop:'20px', textAlign:'center', fontWeight:'bold', color:'green', fontSize:'18px', textDecoration: 'underline', backgroundColor:'#7FFF00'}}>Individual Game Data Analysis</div>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header style={{textAlign:'center', fontWeight:'bold'}}>Subject wise Accuracy</Card.Header>
            <Card.Body>
              <Bar data={subjectWiseData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header style={{textAlign:'center', fontWeight:'bold'}}>Question Difficulty wise Accuracy</Card.Header>
            <Card.Body>
              <Bar data={difficultyWiseData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className='mb-2 shadow-sm' style={{marginTop:'20px', textAlign:'center', fontWeight:'bold', color:'green', fontSize:'18px', textDecoration: 'underline', backgroundColor:'#7FFF00'}}>Rooms Data Analysis</div>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header style={{textAlign:'center', fontWeight:'bold'}}>Subject wise Accuracy</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <PerformanceChart
                    correctPercentage={QuantAptPercentage}
                    incorrectPercentage={VerAbPercentage}
                    unansweredPercentage={LogRePercentage}
                  />
                </Col>
                <Col md={6}>
                  <div className="performance-breakdown">
                    <p className='Dasboard-data-text'>Quantitative Aptitude: <span style={{color:'#006400'}}>{dashboardRoom['Quantitative Aptitude']}</span></p>
                    <p className='Dasboard-data-text'>Verbal Ability: <span style={{color:'red'}}>{dashboardRoom['Verbal Ability']}</span></p>
                    <p className='Dasboard-data-text'>Logical Reasoning: <span style={{color:'black'}}>{dashboardRoom['Logical Reasoning']}</span></p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header style={{textAlign:'center', fontWeight:'bold'}}>Question Difficulty wise Accuracy</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <PerformanceChart
                    correctPercentage={easyPercentage}
                    incorrectPercentage={mediumPercentage}
                    unansweredPercentage={hardPercentage}
                  />
                </Col>
                <Col md={6}>
                  <div className="performance-breakdown">
                    <p className='Dasboard-data-text'>Easy: <span style={{color:'#006400'}}>{dashboardRoom.easy}</span></p>
                    <p className='Dasboard-data-text'>Medium: <span style={{color:'red'}}>{dashboardRoom.medium}</span></p>
                    <p className='Dasboard-data-text'>Hard: <span style={{color:'black'}}>{dashboardRoom.hard}</span></p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analyze;
