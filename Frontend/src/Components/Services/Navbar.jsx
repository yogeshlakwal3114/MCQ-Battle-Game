import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; 
import logo from '../Images/logo.jpg';

import 'aos/dist/aos.css';  // For scrolling Function
import AOS from 'aos';

import { useAuth } from '../Context/AuthContext';


const CustomNavbar = () => {
  const navigate = useNavigate(); 
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
          <img
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Battle Game logo"
          />
          {/* <span className="company-name">Battle-Game</span> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto nav-links">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/')}>Features</Nav.Link>
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="primary" className="login-button">
                LogOut
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} className="login-button">
                LogIn
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
