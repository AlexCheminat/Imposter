import { useState } from 'react';
import RegisterPage from './RegisterPage';
import LobbyPage from './LobbyPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('register'); // 'register' or 'lobby'
  const [currentUser, setCurrentUser] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);

  const handleRegister = (userData) => {
    // userData contains { username, photo }
    setCurrentUser(userData);
    
    // Add user to players list (simulating joining lobby)
    setAllPlayers(prev => [...prev, { ...userData, id: Date.now() }]);
    
    // Navigate to lobby
    setCurrentPage('lobby');
  };

  const handleStartGame = () => {
    // Navigate to game page or do something when game starts
    alert('Game starting!');
    // setCurrentPage('game'); // You can add a game page later
  };

  return (
    <>
      {currentPage === 'register' && (
        <RegisterPage onRegister={handleRegister} />
      )}
      
      {currentPage === 'lobby' && (
        <LobbyPage 
          players={allPlayers}
          currentUser={currentUser}
          onStartGame={handleStartGame}
        />
      )}
    </>
  );
}