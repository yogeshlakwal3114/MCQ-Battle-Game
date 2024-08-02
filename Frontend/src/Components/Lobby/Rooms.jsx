import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:5000');

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    setEmail(userEmail);

    const fetchUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/user/${userEmail}`);
        setUsername(response.data.user.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
    fetchRooms();

    socket.on('room-created', (room) => {
      setRooms((prevRooms) => [...prevRooms, room]);
    });

    socket.on('player-joined', ({ roomId, players }) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomId === roomId ? { ...room, players } : room
        )
      );
    });

    socket.on('game-started', ({ roomId }) => {
      setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
      navigate(`/room/${roomId}`);
    });

    return () => {
      socket.off('room-created');
      socket.off('player-joined');
      socket.off('game-started');
    };
  }, [navigate]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rooms');
      setRooms(response.data);
    } catch (error) {
      setError('Failed to fetch rooms');
      console.error('Failed to fetch rooms:', error);
    }
  };

  const handleCreateRoom = async () => {
    const roomId = newRoomId || Math.random().toString(36).substring(2, 10);
    const roomData = { roomId, players: [username] };

    try {
      await axios.post('http://localhost:5000/rooms/create', { roomId, username , email});
      socket.emit('create-room', roomData);
      setNewRoomId('');
      fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
      if (error.response && error.response.status === 400) {
        setError('Room ID already exists. Please choose a different one.');
      } else {
        setError('Failed to create room');
      }
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await axios.post('http://localhost:5000/rooms/join', { roomId, playerName: username, playerEmail:email });
      console.log(roomId, username);
      socket.emit('join-room', {roomId, username});
      // navigate(`/room/${roomId}`); 
      fetchRooms();
    } catch (error) {
      console.error('Error joining room:', error);
      setError('Failed to join room');
    }
  };

  const handleStartGame = async(roomId) => {
    try{
    const gameResponse = await axios.get('http://localhost:5000/game');
    const games = gameResponse.data;
    const randomIndex = Math.floor(Math.random() * games.length);
    await axios.post('http://localhost:5000/roomFriendGame', {
        roomId: roomId,
        randomGame: randomIndex
    });
    }catch(err){
      console.log(err);
    }
    socket.emit('start-game', roomId);
  };

  return (
    <Container>
      <h1 className="text-center my-4">Rooms</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-4">
        <Col md={{ span: 6, offset: 3 }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{fontWeight:'bold'}}>Enter new room ID (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Room ID"
                value={newRoomId}
                onChange={(e) => setNewRoomId(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateRoom}>Create Room</Button>
          </Form>
        </Col>
      </Row>
      <Button variant="primary" onClick={() => navigate('/lobby')} className='mb-3'>Back</Button>
      <Button variant="light" onClick={fetchRooms} style={{backgroundColor:'#D3D3D3', marginLeft:'10px'}} className='mb-3'>Refresh</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Room ID</th>
            <th>Players</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={room.roomId}>
              <td>{index + 1}</td>
              <td>{room.roomId}</td>
              <td>{room.players.join(', ')}</td>
              <td>
                {room.players.length < 2 ? (
                  room.players.includes(username) ? (
                    <span>Waiting for second player...</span>
                  ) : (
                    <Button variant="success" onClick={() => handleJoinRoom(room.roomId)}>Join</Button>
                  )
                ) : (
                  <>
                    {room.players.includes(username) && room.players.length === 2 && (
                      <Button variant="primary" onClick={() => handleStartGame(room.roomId)}>Start Quiz</Button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Rooms;
