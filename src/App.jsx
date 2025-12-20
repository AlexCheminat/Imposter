import { useState, useEffect } from 'react';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { database } from './firebase';
import RegisterPage from './RegisterPage';
import LobbyPage from './LobbyPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [lobbyId] = useState('lobby-1'); // You can make this dynamic later

  // Listen to players in the lobby
  useEffect(() => {
    const playersRef = ref(database, `lobbies/${lobbyId}/players`);
    
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const playersArray = Object.entries(data).map(([id, player]) => ({
          id,
          ...player
        }));
        setAllPlayers(playersArray);
      } else {
        setAllPlayers([]);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [lobbyId]);

  // Remove player when they leave/close tab
  useEffect(() => {
    if (!currentUser) return;

    const handleBeforeUnload = () => {
      if (currentUser.firebaseId) {
        const playerRef = ref(database, `lobbies/${lobbyId}/players/${currentUser.firebaseId}`);
        remove(playerRef);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also remove when component unmounts
      if (currentUser.firebaseId) {
        const playerRef = ref(database, `lobbies/${lobbyId}/players/${currentUser.firebaseId}`);
        remove(playerRef);
      }
    };
  }, [currentUser, lobbyId]);

  const handleRegister = async (userData) => {
    console.log('handleRegister called with:', userData);
    
    try {
      // Add user to Firebase
      const playersRef = ref(database, `lobbies/${lobbyId}/players`);
      console.log('Creating player reference...');
      
      const newPlayerRef = push(playersRef);
      console.log('Pushing to Firebase...');
      
      await set(newPlayerRef, {
        username: userData.username,
        photo: userData.photo,
        joinedAt: Date.now()
      });
      
      console.log('Player added to Firebase successfully!');

      // Save user data with Firebase ID
      const userWithId = {
        ...userData,
        firebaseId: newPlayerRef.key
      };
      
      setCurrentUser(userWithId);
      setCurrentPage('lobby');
      console.log('Navigating to lobby...');
    } catch (error) {
      console.error('Error adding player:', error);
      console.error('Error details:', error.message);
      alert('Failed to join lobby. Please try again. Error: ' + error.message);
    }
  };

  const handleStartGame = async () => {
    console.log('handleStartGame called!');
    try {
      const gameStateRef = ref(database, `lobbies/${lobbyId}/gameState`);
      console.log('Setting game state in Firebase...');
      
      await set(gameStateRef, {
        currentPage: 'wordSelection',
        startedAt: Date.now()
      });
      
      console.log('Game state updated in Firebase successfully!');
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again. Error: ' + error.message);
    }
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