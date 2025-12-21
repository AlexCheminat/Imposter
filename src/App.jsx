import { useState, useEffect } from 'react';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { database } from './firebase';
import RegisterPage from './RegisterPage';
import LobbyPage from './LobbyPage';
import WordSelectionPage from './WordSelectionPage';
import VoteResultsPage from './VoteResultsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [imposterId, setImposterId] = useState(null);
  const [votes, setVotes] = useState({});
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

  // Listen to votes
  useEffect(() => {
    const votesRef = ref(database, `lobbies/${lobbyId}/votes`);
    
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const votesData = snapshot.val();
      console.log('Votes updated:', votesData);
      
      if (votesData) {
        setVotes(votesData);
        
        // Check if all players have voted
        const voteCount = Object.keys(votesData).length;
        if (voteCount === allPlayers.length && allPlayers.length > 0) {
          console.log('All players have voted! Moving to results...');
          // Move to results page
          const gameStateRef = ref(database, `lobbies/${lobbyId}/gameState`);
          set(gameStateRef, {
            currentPage: 'voteResults',
            imposterId: imposterId,
            allVotesIn: true
          });
        }
      }
    });

    return () => unsubscribe();
  }, [lobbyId, allPlayers.length, imposterId]);

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

  const handleWordSelectionConfirm = async (data) => {
    console.log('Word selection confirmed:', data);
    
    try {
      // Save vote to Firebase
      const voteRef = ref(database, `lobbies/${lobbyId}/votes/${currentUser.firebaseId}`);
      await set(voteRef, {
        votedFor: data.selectedPlayer.id,
        votedBy: currentUser.firebaseId,
        timestamp: Date.now()
      });
      
      console.log('Vote saved successfully!');
      
      // Immediately move this player to vote results page
      setCurrentPage('voteResults');
    } catch (error) {
      console.error('Error saving vote:', error);
      alert('Failed to save vote. Please try again.');
    }
  };

  const handleContinue = () => {
    console.log('Continue clicked');
    // You can navigate to next page here or reset the game
    alert('Game over! Starting new round...');
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

      {currentPage === 'voteResults' && (
        <VoteResultsPage
          players={allPlayers}
          votes={votes}
          imposterId={imposterId}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default App;