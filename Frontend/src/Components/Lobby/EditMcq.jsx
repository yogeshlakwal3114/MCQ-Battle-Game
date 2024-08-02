import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000';

const EditQuiz = () => {
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [newGame, setNewGame] = useState({
    gameId: '',
    gameName: '',
    subject: '',
    difficulty: '',
    noOfQuestions: 10,
    mcqs: Array.from({ length: 10 }, () => ({
      quizId: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }))
  });

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_URL}/game`);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setEditMode(false);
    setCurrentGame(null);
    setNewGame({
      gameId: '',
      gameName: '',
      subject: '',
      difficulty: '',
      noOfQuestions: 10,
      mcqs: Array.from({ length: 10 }, () => ({
        quizId: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      }))
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame({ ...newGame, [name]: value });
  };

  const handleMCQChange = (index, name, value) => {
    const mcqs = [...newGame.mcqs];
    mcqs[index] = { ...mcqs[index], [name]: value };
    setNewGame({ ...newGame, mcqs });
  };

  const handleOptionChange = (mcqIndex, optionIndex, value) => {
    const mcqs = [...newGame.mcqs];
    mcqs[mcqIndex].options[optionIndex] = value;
    setNewGame({ ...newGame, mcqs });
  };

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${API_URL}/game`, newGame);
      setGames([...games, response.data]);
      fetchGames();
      handleClose();
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleEdit = (game) => {
    setCurrentGame(game);
    setNewGame({ 
      gameId: game.gameId,
      gameName: game.gameName,
      subject: game.subject,
      difficulty: game.difficulty,
      noOfQuestions: game.noOfQuestions,
      mcqs: game.mcqs
    });
    setEditMode(true);
    handleShow();
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API_URL}/game/${currentGame._id}`, newGame);
      setGames(games.map(game => (game._id === currentGame._id ? response.data : game)));
      fetchGames();
      handleClose();
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${API_URL}/game/${_id}`);
      setGames(games.filter(game => game._id !== _id));
      fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={handleShow}>Create Game</Button>
      <Row>
      {games.map((game) => (
        <Col md={6} className="mt-3" key={game.id}>
          <Card>
            <Card.Body>
              <Row>
                <Col md={8}>
                  {/* <strong>Game ID:</strong> {game.gameId}<br /> */}
                  <Card.Title><strong className='quiz-headline'>{game.gameName}</strong></Card.Title>
                  <div>
                    <strong className='quiz-paragraph'>Subject:</strong> <strong className='quiz-data'> {game.subject} </strong><br />
                    <strong className='quiz-paragraph'>Difficulty:</strong> <strong className='quiz-data'> {game.difficulty} </strong><br />
                    <strong className='quiz-paragraph'>Number of Questions:</strong> <strong className='quiz-data'> {game.noOfQuestions} </strong>
                  </div>
                </Col>
                <Col md={4} className="text-right">
                  <Button variant="warning" className="mr-2 mt-2 create-button" onClick={() => handleEdit(game)} >Update</Button>
                  <Button variant="danger" className="mt-2 create-button" onClick={() => handleDelete(game._id)} >Delete</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Update Game' : 'Create Game'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 && (
            <Form>
              <Form.Group controlId="formGameId">
                <Form.Label style={{fontWeight:'bold'}}>Game ID <span className="text-danger" >*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter game ID"
                  name="gameId"
                  value={newGame.gameId}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formGameName">
                <Form.Label style={{fontWeight:'bold'}}>Game Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter game name"
                  name="gameName"
                  value={newGame.gameName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formSubject">
                <Form.Label style={{fontWeight:'bold'}}>Subject <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="select"
                  name="subject"
                  value={newGame.subject}
                  onChange={handleChange}
                >
                  <option value="">Select Subject</option>
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Verbal Ability">Verbal Ability</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDifficulty">
                <Form.Label style={{fontWeight:'bold'}}>Difficulty Level <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="select"
                  name="difficulty"
                  value={newGame.difficulty}
                  onChange={handleChange}
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={handleNext} style={{marginTop:'10px'}}>Next</Button>
            </Form>
          )}

          {step === 2 && (
            <Form>
              {newGame.mcqs.map((mcq, mcqIndex) => (
                <div key={mcqIndex}>
                  <h5 style={{fontWeight:'bold', color:'green'}}>Question {mcqIndex + 1}</h5>
                  <Form.Group controlId={`formQuizId${mcqIndex}`}>
                    <Form.Label style={{fontWeight:'bold'}}>Quiz ID <span className="text-danger" >*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter quiz ID"
                      value={mcq.quizId}
                      onChange={(e) => handleMCQChange(mcqIndex, 'quizId', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId={`formQuestion${mcqIndex}`}>
                    <Form.Label style={{fontWeight:'bold'}}>Question <span className="text-danger" >*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter question"
                      value={mcq.question}
                      onChange={(e) => handleMCQChange(mcqIndex, 'question', e.target.value)}
                    />
                  </Form.Group>
                  {mcq.options.map((option, optionIndex) => (
                    <Form.Group controlId={`formOption${mcqIndex}-${optionIndex}`} key={optionIndex}>
                      <Form.Label style={{fontWeight:'bold'}}>Option {optionIndex + 1} <span className="text-danger" >*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={`Enter option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(mcqIndex, optionIndex, e.target.value)}
                      />
                    </Form.Group>
                  ))}
                  <Form.Group controlId={`formCorrectAnswer${mcqIndex}`}>
                    <Form.Label style={{fontWeight:'bold'}}>Correct Answer <span className="text-danger" >*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter correct answer"
                      value={mcq.correctAnswer}
                      onChange={(e) => handleMCQChange(mcqIndex, 'correctAnswer', e.target.value)}
                    />
                  </Form.Group>
                  <hr />
                </div>
              ))}
              <Pagination>
                <Pagination.Prev onClick={handlePrevious} />
                <Pagination.Next onClick={handleNext} />
              </Pagination>
            </Form>
          )}

          {step === 3 && (
            <div>
              <h5 style={{fontWeight:'bold', color:'green', textAlign:'center'}}>Review and {editMode ? 'Update' : 'Create'} Game</h5>
              <p style={{fontWeight:'bold'}}>Game ID: {newGame.gameId}</p>
              <p style={{fontWeight:'bold'}}>Game Name: {newGame.gameName}</p>
              <p style={{fontWeight:'bold'}}>Subject: {newGame.subject}</p>
              <p style={{fontWeight:'bold'}}>Difficulty: {newGame.difficulty}</p>
              <p style={{fontWeight:'bold'}}>Number of Questions: {newGame.noOfQuestions}</p>
              <hr/>
              {newGame.mcqs.map((mcq, index) => (
                <div key={index}>
                  <h5 style={{fontWeight:'bold', textDecoration:'underline'}}>Question {index + 1}</h5>
                  <p><strong>Quiz ID:</strong> {mcq.quizId}</p>
                  <p><strong>Question:</strong> {mcq.question}</p>
                  <p><strong>Options:</strong> {mcq.options.join(', ')}</p>
                  <p><strong>Correct Answer:</strong> {mcq.correctAnswer}</p>
                  <hr />
                </div>
              ))}
              <Button variant="primary" onClick={editMode ? handleUpdate : handleCreate}>
                {editMode ? 'Update' : 'Create'}
              </Button>
              <Button variant="secondary" onClick={handlePrevious} style={{marginLeft:'10px'}}>Back</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditQuiz;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, Button, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_URL = 'http://localhost:5000';

// const EditQuiz = () => {
//   const [games, setGames] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);
//   const [editMode, setEditMode] = useState(false);
//   const [currentGame, setCurrentGame] = useState(null);
//   const [newGame, setNewGame] = useState({
//     gameId: '',
//     gameName: '',
//     subject: '',
//     difficulty: '',
//     noOfQuestions: 1,
//     mcqs: Array.from({ length: 1 }, () => ({
//       quizId: '',
//       question: '',
//       options: ['', '', '', ''],
//       correctAnswer: ''
//     }))
//   });

//   const fetchGames = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/game`);
//       setGames(response.data);
//     } catch (error) {
//       console.error('Error fetching games:', error);
//     }
//   };

//   useEffect(() => {
//     fetchGames();
//   }, []);

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => {
//     setShowModal(false);
//     setStep(1);
//     setEditMode(false);
//     setCurrentGame(null);
//     setNewGame({
//       gameId: '',
//       gameName: '',
//       subject: '',
//       difficulty: '',
//       noOfQuestions: 1,
//       mcqs: Array.from({ length: 1 }, () => ({
//         quizId: '',
//         question: '',
//         options: ['', '', '', ''],
//         correctAnswer: ''
//       }))
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewGame({ ...newGame, [name]: value });
//   };

//   const handleMCQChange = (index, name, value) => {
//     const mcqs = [...newGame.mcqs];
//     mcqs[index] = { ...mcqs[index], [name]: value };
//     setNewGame({ ...newGame, mcqs });
//   };

//   const handleOptionChange = (mcqIndex, optionIndex, value) => {
//     const mcqs = [...newGame.mcqs];
//     mcqs[mcqIndex].options[optionIndex] = value;
//     setNewGame({ ...newGame, mcqs });
//   };

//   const handleNext = () => setStep(step + 1);
//   const handlePrevious = () => setStep(step - 1);

//   const handleCreate = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/game`, newGame);
//       setGames([...games, response.data]);
//       fetchGames();
//       handleClose();
//     } catch (error) {
//       console.error('Error creating game:', error);
//     }
//   };

//   const handleEdit = (game) => {
//     setCurrentGame(game);
//     setNewGame({ 
//       gameId: game.gameId,
//       gameName: game.gameName,
//       subject: game.subject,
//       difficulty: game.difficulty,
//       noOfQuestions: game.noOfQuestions,
//       mcqs: game.mcqs
//     });
//     setEditMode(true);
//     handleShow();
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await axios.put(`${API_URL}/game/${currentGame._id}`, newGame);
//       setGames(games.map(game => (game._id === currentGame._id ? response.data : game)));
//       fetchGames();
//       handleClose();
//     } catch (error) {
//       console.error('Error updating game:', error);
//     }
//   };
  

//   const handleDelete = async (_id) => {
//     try {
//       await axios.delete(`${API_URL}/game/${_id}`);
//       setGames(games.filter(game => game._id !== _id));
//       fetchGames();
//     } catch (error) {
//       console.error('Error deleting game:', error);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <Button variant="primary" onClick={handleShow}>Create Game</Button>
//       {games.map((game) => (
//         <Card className="mt-3" key={game.id}>
//           <Card.Body>
//             <Row>
//               <Col md={8}>
//                 <strong>Game ID:</strong> {game.gameId}<br />
//                 <Card.Title><strong>{game.gameName}</strong></Card.Title>
//                 <Card.Text>
//                   <strong>Subject:</strong> {game.subject}<br />
//                   <strong>Difficulty:</strong> {game.difficulty}<br />
//                   <strong>Number of Questions:</strong> {game.noOfQuestions}
//                 </Card.Text>
//               </Col>
//               <Col md={4} className="text-right">
//                 <Button variant="warning" className="mr-2 mt-2" onClick={() => handleEdit(game)}>Update</Button>
//                 <Button variant="danger" className="mt-2" onClick={() => handleDelete(game._id)}>Delete</Button>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//       ))}

//       <Modal show={showModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>{editMode ? 'Update Game' : 'Create Game'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {step === 1 && (
//             <Form>
//               <Form.Group controlId="formGameId">
//                 <Form.Label>Game ID</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter game ID"
//                   name="gameId"
//                   value={newGame.gameId}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//               <Form.Group controlId="formGameName">
//                 <Form.Label>Game Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter game name"
//                   name="gameName"
//                   value={newGame.gameName}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//               <Form.Group controlId="formSubject">
//                 <Form.Label>Subject</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter subject"
//                   name="subject"
//                   value={newGame.subject}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//               <Form.Group controlId="formDifficulty">
//                 <Form.Label>Difficulty Level</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter difficulty level"
//                   name="difficulty"
//                   value={newGame.difficulty}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//               <Button variant="primary" onClick={handleNext}>Next</Button>
//             </Form>
//           )}

//           {step === 2 && (
//             <Form>
//               {newGame.mcqs.map((mcq, mcqIndex) => (
//                 <div key={mcqIndex}>
//                   <h5>Question {mcqIndex + 1}</h5>
//                   <Form.Group controlId={`formQuizId${mcqIndex}`}>
//                     <Form.Label>Quiz ID</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Enter quiz ID"
//                       value={mcq.quizId}
//                       onChange={(e) => handleMCQChange(mcqIndex, 'quizId', e.target.value)}
//                     />
//                   </Form.Group>
//                   <Form.Group controlId={`formQuestion${mcqIndex}`}>
//                     <Form.Label>Question</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Enter question"
//                       value={mcq.question}
//                       onChange={(e) => handleMCQChange(mcqIndex, 'question', e.target.value)}
//                     />
//                   </Form.Group>
//                   {mcq.options.map((option, optionIndex) => (
//                     <Form.Group controlId={`formOption${mcqIndex}-${optionIndex}`} key={optionIndex}>
//                       <Form.Label>Option {optionIndex + 1}</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder={`Enter option ${optionIndex + 1}`}
//                         value={option}
//                         onChange={(e) => handleOptionChange(mcqIndex, optionIndex, e.target.value)}
//                       />
//                     </Form.Group>
//                   ))}
//                   <Form.Group controlId={`formCorrectAnswer${mcqIndex}`}>
//                     <Form.Label>Correct Answer</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Enter correct answer"
//                       value={mcq.correctAnswer}
//                       onChange={(e) => handleMCQChange(mcqIndex, 'correctAnswer', e.target.value)}
//                     />
//                   </Form.Group>
//                   <hr />
//                 </div>
//               ))}
//               <Pagination>
//                 <Pagination.Prev onClick={handlePrevious} />
//                 <Pagination.Next onClick={handleNext} />
//               </Pagination>
//             </Form>
//           )}

//           {step === 3 && (
//             <div>
//               <h5>Review and {editMode ? 'Update' : 'Create'} Game</h5>
//               <p>Game ID: {newGame.gameId}</p>
//               <p>Game Name: {newGame.gameName}</p>
//               <p>Subject: {newGame.subject}</p>
//               <p>Difficulty: {newGame.difficulty}</p>
//               <p>Number of Questions: {newGame.noOfQuestions}</p>
//               {newGame.mcqs.map((mcq, index) => (
//                 <div key={index}>
//                   <h6>Question {index + 1}</h6>
//                   <p><strong>Quiz ID:</strong> {mcq.quizId}</p>
//                   <p><strong>Question:</strong> {mcq.question}</p>
//                   <p><strong>Options:</strong> {mcq.options.join(', ')}</p>
//                   <p><strong>Correct Answer:</strong> {mcq.correctAnswer}</p>
//                   <hr />
//                 </div>
//               ))}
//               <Button variant="primary" onClick={editMode ? handleUpdate : handleCreate}>
//                 {editMode ? 'Update' : 'Create'}
//               </Button>
//               <Button variant="secondary" onClick={handlePrevious}>Back</Button>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default EditQuiz;