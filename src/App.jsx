import { useState, useEffect } from 'react';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { database } from './firebase';
import RegisterPage from './RegisterPage';
import LobbyPage from './LobbyPage';
import WordSelectionPage from './WordSelectionPage';

function App() {
  const [currentPage, setCurrentPage] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [imposterId, setImposterId] = useState(null);
  const [lobbyId] = useState('lobby-1');

  // Listen to players in the lobby
  useEffect(() => {
    const playersRef = ref(database, `lobbies/${lobbyId}/players`);
    
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArray = Object.entries(data).map(([id, player]) => ({
          id,
          ...player
        }));
        setAllPlayers(playersArray);
      } else {
        setAllPlayers([]);
      }
    });

    return () => unsubscribe();
  }, [lobbyId]);

  // Listen to game state changes
  useEffect(() => {
    const gameStateRef = ref(database, `lobbies/${lobbyId}/gameState`);
    
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      const gameState = snapshot.val();
      console.log('Game state changed:', gameState);
      
      if (gameState) {
        if (gameState.currentPage) {
          console.log('Navigating to:', gameState.currentPage);
          setCurrentPage(gameState.currentPage);
        }
        
        if (gameState.imposterId) {
          console.log('Imposter ID set to:', gameState.imposterId);
          setImposterId(gameState.imposterId);
        }
      }
    });

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
      if (currentUser.firebaseId) {
        const playerRef = ref(database, `lobbies/${lobbyId}/players/${currentUser.firebaseId}`);
        remove(playerRef);
      }
    };
  }, [currentUser, lobbyId]);

  const handleRegister = async (userData) => {
    console.log('handleRegister called with:', userData);
    
    try {
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
      
      // Randomly select an imposter
      const randomIndex = Math.floor(Math.random() * allPlayers.length);
      const imposter = allPlayers[randomIndex];
      
      console.log('Selected imposter:', imposter.username, 'with ID:', imposter.id);
      
      await set(gameStateRef, {
        currentPage: 'wordSelection',
        startedAt: Date.now(),
        imposterId: imposter.id
      });
      
      console.log('Game state updated in Firebase successfully!');
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again. Error: ' + error.message);
    }
  };

  const handleWordSelectionConfirm = (data) => {
    console.log('Word selection confirmed:', data);
    alert(`Selected: ${data.selectedPlayer.username} with word: ${data.word}`);
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

      {currentPage === 'wordSelection' && (
        <WordSelectionPage 
          players={allPlayers}
          currentUser={currentUser}
          onConfirm={handleWordSelectionConfirm}
          lobbyId={lobbyId}
          imposterId={imposterId}
          database={{ db: database, ref, onValue, set }}
        />
      )}
    </>
  );
}

export default App;