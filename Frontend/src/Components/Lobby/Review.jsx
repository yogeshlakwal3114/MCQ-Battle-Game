import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePhoto from '../Images/profilei.png';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    username: '',
    email: '',
    stars: 0,
    message: ''
  });
  const [averageRating, setAverageRating] = useState('No reviews yet');
  const [numberOfReviews, setNumberOfReviews] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('No User found.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users/user/${email}`);
        const userData = response.data.user;
        setNewReview(prevState => ({
          ...prevState,
          username: userData.username,
          email: userData.email
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews`);
      setReviews(response.data);
      calculateAverage(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const calculateAverage = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating('No reviews yet');
      setNumberOfReviews(0);
      return;
    }

    const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
    const avgRating = totalStars / reviews.length;
    setAverageRating(`${avgRating.toFixed(1)}`);
    setNumberOfReviews(reviews.length);
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleStarClick = (stars) => {
    setNewReview({ ...newReview, stars });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/reviews`, newReview);
      fetchReviews(); // Refresh reviews after submission
      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="container mt-4 shadow-sm pb-3">
      <h2 style={{textAlign:'center', fontFamily:'Overpass', fontSize:'28px', color:'#ffc107', paddingTop:'20px', textDecoration:'underline'}}>MCQ Game Battle Review</h2>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <span className="text-warning" style={{fontSize:'24px'}}>
            {'★'.repeat(parseFloat(averageRating))}{'☆'.repeat(5 - parseFloat(averageRating))}
          </span>
          <span style={{fontSize:'18px'}}> {averageRating} ({numberOfReviews} reviews)</span>
        </div>
        <Button variant="primary" onClick={handleShow}>Write a review</Button>
      </div>
      {reviews.map((review) => (
        <Card className="mt-3" key={review._id}>
          <Card.Body>
            <Row>
              <Col md={2}>
                <img
                  src={ProfilePhoto}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '50px', height: '50px' }}
                />
              </Col>
              <Col md={10}>
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="text-warning">
                      {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                    </span>
                    <div style={{color:'grey'}}>{new Date(review.date).toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <strong>{review.username}</strong><br />
                  <strong style={{color:'grey', textDecoration:'underline'}}>Review:</strong> {review.message}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="text-center">
              <p>Click the stars to rate us</p>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-warning ${star <= newReview.stars ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <Form.Group controlId="formReview">
              <Form.Label style={{fontWeight:'bold'}}>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your review (max 100 words)"
                name="message"
                value={newReview.message}
                onChange={handleChange}
                maxLength={100}
              />
            </Form.Group>
            <div className="text-center" style={{paddingTop:'15px'}}>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Review;
