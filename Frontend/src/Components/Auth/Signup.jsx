import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../Style/Signup.css';
import { signup } from '../Integrate/api';
import signupPhoto from '../Images/signup_page.png';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = (email, password) => {
    const errors = {};

    // Email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Invalid email address';
    }

    // Password validation
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await signup(username, email, password);
        setMessage('Signup successful!');
        console.log(response); // Handle the response as needed
      } catch (error) {
        setMessage('Error during signup. Please try again.');
      }
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="align-items-center justify-content-center min-vh-100">
        <Col md={6} lg={4} className="left-side">
          <img src={signupPhoto} alt="Sign Page" className="quiz-image" />
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
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                SIGN UP
              </Button>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </Form>
            <div className="card-footer text-muted text-center mt-3">
              Already have an account?
            </div>
            <div className="text-center">
              <Link to='/login' className="btn btn-link mt-2">Login</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
