import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Components/Auth/Signup';
import Login from './Components/Auth/Login'; 
// import NavigationBar from './Components/Navbar';
import Home from './Components/Services/Home';
import Quiz from './Components/Auth/Quiz';
import './App.css';
import Lobby from './Components/Lobby/lobby';
import Rooms from './Components/Lobby/Rooms';
import QuizRoomCard from './Components//Lobby/QuizRoomCard';

import { AuthProvider } from './Components/Context/AuthContext';


const App = () => {
  return (
    <Router>
      {/* <NavigationBar /> */}
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/quiz/:_id' element={<Quiz />}></Route>
            <Route path='/lobby' element={<Lobby />}></Route>
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:roomId" element={<QuizRoomCard />} />
          </Routes>
        </div>
        </AuthProvider>
    </Router>
  );
};

export default App;
