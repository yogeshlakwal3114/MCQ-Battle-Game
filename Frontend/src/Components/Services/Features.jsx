import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Features.css'; 

const FeatureSection = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center">TIRED OF ROTE LEARNING?</h2>
      <p className="text-center">With Battle, learn concepts from a wide range of games and quizzes</p>
      <Row className="mt-4">
        <Col md={4} data-aos="fade-right">
          <Card className="feature-card text-center">
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="icon-container bg-blue">
                  <i className="bi bi-book"></i>
                </div>
              </div>
              <Card.Title style={{color:'blue'}}>LEARN</Card.Title>
              <ul className="card-text">
                <li>Engage with interactive lessons</li>
                <li>Quizzes for enhanced learning</li>
                <li>Conceptual understanding</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} data-aos="fade-up">
          <Card className="feature-card text-center">
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="icon-container bg-pink">
                  <i className="bi bi-trophy"></i>
                </div>
              </div>
              <Card.Title  style={{color:'#D90166'}}>CHALLENGE</Card.Title>
              <ul className="card-text">
                <li>Invite friends for a game</li>
                <li>Free to join</li>
                <li>Quick 7-minute matches</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} data-aos="fade-left">
          <Card className="feature-card text-center">
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="icon-container bg-green">
                  <i className="bi bi-award"></i>
                </div>
              </div>
              <Card.Title  style={{color:'green'}}>WIN</Card.Title>
              <ul className="card-text">
                <li>Analyze your Progress</li>
                <li>Track position on leaderboard</li>
                <li>Compete with the best</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FeatureSection;
