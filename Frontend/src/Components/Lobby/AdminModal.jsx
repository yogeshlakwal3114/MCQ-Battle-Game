import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const AdminModal = ({ show, handleClose, handleAccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_URL}/users/user/${email}`);
      if (response.data.user.role === 'admin') {
        handleAccess();
      } else {
        setError('You are not an admin');
        setTimeout(() => {
          setError('');
          handleClose();
        }, 2000);
      }
    } catch (error) {
      setError('You are not an admin');
      setTimeout(() => {
        setError('');
        handleClose();
      }, 2000);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Admin Access</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{color:'red', fontWeight:'bold', textDecoration:'underline'}}>Note: Only Admin can Edit MCQ's</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          {error && <p className="text-danger">{error}</p>}
          <Button variant="primary" type="submit" style={{marginTop:'10px'}}>
            Next
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdminModal;
