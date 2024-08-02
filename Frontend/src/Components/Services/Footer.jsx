import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>Learn more about our mission and values.</p>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p>Email: info@example.com</p>
            <p>Phone: +123 456 7890</p>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <p>Stay connected through our social media channels.</p>
          </Col>
        </Row>
        <div className="text-center mt-3">
          <button className="btn btn-primary" id="back-to-top">Back to Top</button>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
