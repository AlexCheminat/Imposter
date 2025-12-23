import { useState, useEffect } from 'react';
import { ref, push, onValue, set, remove, onDisconnect } from 'firebase/database';
import { database } from './firebase';
import RegisterPage from './RegisterPage';
import LobbyPage from './LobbyPage';
import SettingsPage from './SettingsPage';
import WordSelectionPage from './WordSelectionPage';
import VoteResultsPage from './VoteResultsPage';
import FinalResultsPage from './FinalResultsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [imposterId, setImposterId] = useState(null);
  const [votes, setVotes] = useState({});
  const [scores, setScores] = useState({});
  const [lobbyId] = useState('lobby-1');
  const [isReconnecting, setIsReconnecting] = useState(true);

  // Try to reconnect user on mount
  useEffect(() => {
    const reconnectUser = async () => {
      const storedUserId = localStorage.getItem('gameUserId');
      const storedUsername = localStorage.getItem('gameUsername');
      const storedPhoto = localStorage.getItem('gameUserPhoto');
      
      console.log('Attempting to reconnect user:', storedUserId);
      
      if (storedUserId && storedUsername) {
        // Check if this user still exists in the database
        const playerRef = ref(database, `lobbies/${lobbyId}/players/${storedUserId}`);
        
        onValue(playerRef, (snapshot) => {
          if (snapshot.exists()) {
            // User still exists, reconnect them
            console.log('User found in database, reconnecting...');
            setCurrentUser({
              username: storedUsername,
              photo: storedPhoto,
              firebaseId: storedUserId
            });
            setCurrentPage('lobby');
          } else {
            // User was removed, re-add them
            console.log('User not found, re-adding to database...');
            set(playerRef, {
              username: storedUsername,
              photo: storedPhoto,
              joinedAt: Date.now()
            }).then(() => {
              // Set up disconnect handler
              onDisconnect(playerRef).remove();
              
              setCurrentUser({
                username: storedUsername,
                photo: storedPhoto,
                firebaseId: storedUserId
              });
              setCurrentPage('lobby');
            });
          }
          setIsReconnecting(false);
        }, { onlyOnce: true });
      } else {
        // No stored user, show register page
        console.log('No stored user found');
        setIsReconnecting(false);
      }
    };

    reconnectUser();
  }, [lobbyId]);

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
      }
    });

    return () => unsubscribe();
  }, [lobbyId]);

  // Listen to scores
  useEffect(() => {
    const scoresRef = ref(database, `lobbies/${lobbyId}/scores`);
    
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const scoresData = snapshot.val();
      if (scoresData) {
        setScores(scoresData);
      }
    });

    return () => unsubscribe();
  }, [lobbyId]);

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
      
      // Set up automatic removal when user disconnects
      onDisconnect(newPlayerRef).remove();
      
      console.log('Player added to Firebase successfully!');

      const userWithId = {
        ...userData,
        firebaseId: newPlayerRef.key
      };
      
      // Store user info in localStorage for reconnection
      localStorage.setItem('gameUserId', newPlayerRef.key);
      localStorage.setItem('gameUsername', userData.username);
      localStorage.setItem('gameUserPhoto', userData.photo);
      
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

  const handleContinue = async () => {
    console.log('Continue clicked');
    
    try {
      // Calculate scores based on votes
      const voteCount = {};
      allPlayers.forEach(player => {
        voteCount[player.id] = 0;
      });

      Object.values(votes).forEach(vote => {
        if (vote.votedFor && voteCount[vote.votedFor] !== undefined) {
          voteCount[vote.votedFor]++;
        }
      });

      // Sort players by vote count
      const sortedPlayers = [...allPlayers].sort((a, b) => {
        return (voteCount[b.id] || 0) - (voteCount[a.id] || 0);
      });

      // Find most and second most voted players
      const mostVotedPlayer = sortedPlayers[0];
      const secondMostVotedPlayer = sortedPlayers[1];
      
      // Imposter is only caught if they have the most votes AND it's not a tie
      const imposterCaught = mostVotedPlayer && mostVotedPlayer.id === imposterId
                          && voteCount[mostVotedPlayer.id] > (voteCount[secondMostVotedPlayer?.id] || 0);

      // Update scores
      const currentScores = { ...scores };
      
      // Initialize scores for new players
      allPlayers.forEach(player => {
        if (!currentScores[player.id]) {
          currentScores[player.id] = 0;
        }
      });

      // If imposter was caught (most voted and no tie), everyone else gets a point
      if (imposterCaught) {
        console.log('Imposter was caught!');
        allPlayers.forEach(player => {
          if (player.id !== imposterId) {
            currentScores[player.id] = (currentScores[player.id] || 0) + 1;
          }
        });
      } else {
        // If imposter wasn't caught (wrong person voted or tie), imposter gets a point
        console.log('Imposter escaped!');
        currentScores[imposterId] = (currentScores[imposterId] || 0) + 1;
      }

      // Save scores to Firebase
      const scoresRef = ref(database, `lobbies/${lobbyId}/scores`);
      await set(scoresRef, currentScores);

      // Move everyone to final results
      const gameStateRef = ref(database, `lobbies/${lobbyId}/gameState`);
      await set(gameStateRef, {
        currentPage: 'finalResults',
        imposterId: imposterId
      });

      console.log('Moved to final results page');
    } catch (error) {
      console.error('Error updating scores:', error);
      alert('Failed to update scores. Please try again.');
    }
  };

  const handleNextRound = async () => {
    console.log('Next Round clicked');
    
    try {
      // Clear votes for next round
      const votesRef = ref(database, `lobbies/${lobbyId}/votes`);
      await set(votesRef, null);

      // Clear current word
      const wordRef = ref(database, `lobbies/${lobbyId}/currentWord`);
      await set(wordRef, null);

      // Select a new imposter
      const randomIndex = Math.floor(Math.random() * allPlayers.length);
      const newImposter = allPlayers[randomIndex];
      
      console.log('New imposter selected:', newImposter.username);

      // Move everyone back to word selection with new imposter
      const gameStateRef = ref(database, `lobbies/${lobbyId}/gameState`);
      await set(gameStateRef, {
        currentPage: 'wordSelection',
        imposterId: newImposter.id,
        startedAt: Date.now()
      });

      console.log('Starting new round');
    } catch (error) {
      console.error('Error starting new round:', error);
      alert('Failed to start new round. Please try again.');
    }
  };

  const handleOpenSettings = () => {
    setCurrentPage('settings');
  };

  const handleBackToLobby = () => {
    setCurrentPage('lobby');
  };

  // Show loading while reconnecting
  if (isReconnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">Reconnecting...</div>
      </div>
    );
  }

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
          onOpenSettings={handleOpenSettings}
        />
      )}

      {currentPage === 'settings' && (
        <SettingsPage
          onBack={handleBackToLobby}
          database={{ db: database, ref, onValue, set }}
          lobbyId={lobbyId}
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
          currentUser={currentUser}
        />
      )}

      {currentPage === 'finalResults' && (
        <FinalResultsPage
          players={allPlayers}
          scores={scores}
          onNextRound={handleNextRound}
          currentUser={currentUser}
        />
      )}
    </>
  );
}

export default App;