import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import '../Style/Signup.css';
import loginPhoto from '../Images/login_page.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email); // Assuming login function is async
      setMessage('Login successful!');
      navigate('/');
    } catch (error) {
      setMessage('Error during login. Please try again.');
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="align-items-center justify-content-center min-vh-100">
        <Col md={6} lg={4} className="left-side">
          <img src={loginPhoto} alt="Login Page" className="quiz-image" />
        </Col>
        <Col md={6} lg={4} className="right-side">
          <div className="form-container p-4">
            <Button 
              variant="link" 
              className="back-button p-0 mb-3" 
              onClick={() => navigate('/')}
            >
              ← Back
            </Button>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Log In
              </Button>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </Form>
            <div className="card-footer text-muted text-center mt-3">
              If you don't have an account!
            </div>
            <div className="text-center">
              <Link to='/signup' className="btn btn-link mt-2">Signup</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
