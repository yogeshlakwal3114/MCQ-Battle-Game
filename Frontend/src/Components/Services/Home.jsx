import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; 
import quizImage from '../Images/Home.png'; 
import NavigationBar from './Navbar';
import Features from './Features';
import Footer from './Footer';

import 'aos/dist/aos.css';  // For scrolling Function
import AOS from 'aos';

import { useAuth } from '../Context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); 
  const [showToast, setShowToast] = React.useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const sentences = [
    'Play MCQ Game',
    'Learn through Play.',
    'Battle 1vs1 with Friend.'
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Cleanup function to remove the event listener
    return () => {
      if (backToTopButton) {
        backToTopButton.removeEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    };
  }, []);

  useEffect(() => {
    const cycleText = () => {
      setIsHidden(true); 
      setTimeout(() => {
        setTextIndex((textIndex + 1) % sentences.length);
        setIsHidden(false); 
      }, 2000); 
    };

    const intervalId = setInterval(cycleText, 6000); // Cycle every 6 seconds

    return () => clearInterval(intervalId);
  }, [textIndex]);

  const handleNavigateToLobby = () => {
    if (isLoggedIn) {
      navigate('/lobby');
    } else {
      setShowToast(true);
    }
  };

  return (
    <div className="home-wrapper">
      <NavigationBar/>
        <Container fluid className="home-container">
          <Row className="align-items-center min-vh-100">
              <Col md={6} className="text-section">
                <div className={`typing-container ${isHidden ? 'hidden' : ''}`}>
                  {sentences[textIndex]}
                </div>
                <p className="mb-4">Challenge your friends with a fun game.</p>
                <Button onClick={handleNavigateToLobby} variant="primary" size="lg" className="mr-3 mb-2 play-button">Go to lobby</Button>
              </Col>
              <Col md={6} className="image-section">
                <img src={quizImage} alt="Quiz Time" className="quiz-image" />
              </Col>
          </Row>
        </Container>

      <Features />
      <Footer />

      {/* Toast component for displaying login error */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>You are not logged In. Login First</Toast.Body>
      </Toast>
    </div>
  );
};

export default Home;
