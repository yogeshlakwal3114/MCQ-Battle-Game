import React, { useEffect, useState } from 'react';
import { Button, Image, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import ProfileIcon from '../Images/profilei.png';

const API_URL = 'http://localhost:5000';
const profilePicture = ProfileIcon;

const ProfileButton = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await localStorage.getItem('userEmail');
      if (!email) {
        setError('No user email found in local storage.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users/user/${email}`);
        setUser(response.data);
      } catch (err) {
        setError(`Unable to fetch: ${err.response ? err.response.data : err.message}`);
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="profile-button-container">
        <Button variant="outline-primary" onClick={handleShow} className="p-0 border-0 bg-transparent">
          <Image
            src={profilePicture}
            roundedCircle
            className="profile-picture"
          />
        </Button>
        <span className="profile-username">{user && user.user ? user.user.username : 'Loading...'}</span>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : user && user.user ? (
            <>
              <p><strong>Username:</strong> {user.user.username}</p>
              <p><strong>Email:</strong> {user.user.email}</p>
              <p><strong>Role:</strong> {user.user.role}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileButton;
