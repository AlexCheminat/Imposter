import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, set, remove, serverTimestamp } from 'firebase/database';
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
  const heartbeatInterval = useRef(null);
  const cleanupInterval = useRef(null);

  // Heartbeat system - sends "I'm still here" signal every 30 seconds
  useEffect(() => {
    if (!currentUser) return;

    const sendHeartbeat = async () => {
      try {
        const playerRef = ref(database, `lobbies/${lobbyId}/players/${currentUser.firebaseId}`);
        await set(playerRef, {
          username: currentUser.username,
          photo: currentUser.photo,
          joinedAt: currentUser.joinedAt || Date.now(),
          lastHeartbeat: Date.now()
        });
        console.log('Heartbeat sent');
      } catch (error) {
        console.error('Error sending heartbeat:', error);
      }
    };

    // Send initial heartbeat immediately
    sendHeartbeat();

    // Send heartbeat every 30 seconds
    heartbeatInterval.current = setInterval(sendHeartbeat, 30000);

    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [currentUser, lobbyId]);

  // Cleanup stale players - removes players who haven't sent heartbeat in 30 minutes
  useEffect(() => {
    const cleanupStalePlayers = async () => {
      try {
        const playersRef = ref(database, `lobbies/${lobbyId}/players`);
        
        onValue(playersRef, async (snapshot) => {
          const data = snapshot.val();
          if (!data) return;

          const now = Date.now();
          const fifteenMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

          for (const [playerId, player] of Object.entries(data)) {
            if (player.lastHeartbeat) {
              const timeSinceLastHeartbeat = now - player.lastHeartbeat;
              
              if (timeSinceLastHeartbeat > fifteenMinutes) {
                console.log(`Removing stale player: ${player.username} (inactive for ${Math.round(timeSinceLastHeartbeat / 60000)} minutes)`);
                const stalePlayerRef = ref(database, `lobbies/${lobbyId}/players/${playerId}`);
                await remove(stalePlayerRef);
              }
            }
          }
        }, { onlyOnce: true });
      } catch (error) {
        console.error('Error cleaning up stale players:', error);
      }
    };

    // Run cleanup every 60 seconds
    cleanupInterval.current = setInterval(cleanupStalePlayers, 60000);

    // Run initial cleanup
    cleanupStalePlayers();

    return () => {
      if (cleanupInterval.current) {
        clearInterval(cleanupInterval.current);
      }
    };
  }, [lobbyId]);

  // Try to reconnect user on mount
  useEffect(() => {
    const reconnectUser = async () => {
      try {
        // Check if user data exists in memory (from before refresh)
        const savedUserId = sessionStorage.getItem('currentUserId');
        const savedUsername = sessionStorage.getItem('currentUsername');
        const savedPhoto = sessionStorage.getItem('currentPhoto');
        const savedJoinedAt = sessionStorage.getItem('currentJoinedAt');
        
        if (savedUserId && savedUsername) {
          console.log('Found saved user data, reconnecting...');
          
          // Check if this player still exists in Firebase
          const playerRef = ref(database, `lobbies/${lobbyId}/players/${savedUserId}`);
          
          onValue(playerRef, (snapshot) => {
            if (snapshot.exists()) {
              // Player still exists, reconnect them
              console.log('Player found in Firebase, reconnecting...');
              setCurrentUser({
                username: savedUsername,
                photo: savedPhoto,
                firebaseId: savedUserId,
                joinedAt: parseInt(savedJoinedAt) || Date.now()
              });
              
              // Get current game state to set correct page
              const gameStateRef = ref(database, `lobbies/${lobbyId}/gameState`);
              onValue(gameStateRef, (gameSnapshot) => {
                const gameState = gameSnapshot.val();
                if (gameState && gameState.currentPage) {
                  setCurrentPage(gameState.currentPage);
                } else {
                  setCurrentPage('lobby');
                }
              }, { onlyOnce: true });
            } else {
              // Player no longer exists (was removed for inactivity), need to re-register
              console.log('Player not found in Firebase, clearing saved data...');
              sessionStorage.clear();
              setCurrentPage('register');
            }
            setIsReconnecting(false);
          }, { onlyOnce: true });
        } else {
          setIsReconnecting(false);
        }
      } catch (error) {
        console.error('Error reconnecting user:', error);
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
        if (gameState.currentPage && currentUser) {
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
  }, [lobbyId, currentUser]);

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
      
      const joinedAt = Date.now();
      
      await set(newPlayerRef, {
        username: userData.username,
        photo: userData.photo,
        joinedAt: joinedAt,
        lastHeartbeat: Date.now()
      });
      
      console.log('Player added to Firebase successfully!');

      const userWithId = {
        ...userData,
        firebaseId: newPlayerRef.key,
        joinedAt: joinedAt
      };
      
      // Save user data to sessionStorage for reconnection after refresh
      sessionStorage.setItem('currentUserId', newPlayerRef.key);
      sessionStorage.setItem('currentUsername', userData.username);
      sessionStorage.setItem('currentPhoto', userData.photo);
      sessionStorage.setItem('currentJoinedAt', joinedAt.toString());
      
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
      // First, read the current scores from Firebase to ensure we have the latest data
      const scoresRef = ref(database, `lobbies/${lobbyId}/scores`);
      const scoresSnapshot = await new Promise((resolve) => {
        onValue(scoresRef, (snapshot) => {
          resolve(snapshot);
        }, { onlyOnce: true });
      });
      
      const currentScores = scoresSnapshot.val() || {};
      
      // Initialize scores for new players
      allPlayers.forEach(player => {
        if (!currentScores[player.id]) {
          currentScores[player.id] = 0;
        }
      });

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

      // Find most voted player
      const mostVotedPlayer = sortedPlayers[0];
      const secondMostVotedPlayer = sortedPlayers[1];
      const mostVotedCount = voteCount[mostVotedPlayer?.id] || 0;
      const secondMostVotedCount = voteCount[secondMostVotedPlayer?.id] || 0;

      // Check if imposter was caught (imposter has most votes)
      const imposterCaught = mostVotedPlayer && mostVotedPlayer.id === imposterId && mostVotedCount > secondMostVotedCount;

      console.log('Vote counts:', voteCount);
      console.log('Most voted player:', mostVotedPlayer?.username, 'with', mostVotedCount, 'votes');
      console.log('Imposter ID:', imposterId);
      console.log('Imposter caught:', imposterCaught);
      console.log('Current scores before update:', JSON.stringify(currentScores));

      // Give 1 point to each player who voted for the imposter
      Object.values(votes).forEach(vote => {
        if (vote.votedFor === imposterId && vote.votedBy) {
          const oldScore = currentScores[vote.votedBy];
          currentScores[vote.votedBy] = (currentScores[vote.votedBy] || 0) + 1;
          console.log(`Awarded 1 point to ${vote.votedBy} for voting for imposter (${oldScore} -> ${currentScores[vote.votedBy]})`);
        }
      });

      if (!imposterCaught) {
        // Give 2 points to the imposter
        const oldScore = currentScores[imposterId];
        currentScores[imposterId] = (currentScores[imposterId] || 0) + 2;
        console.log(`Awarded 2 points to imposter ${imposterId} (${oldScore} -> ${currentScores[imposterId]})`);
      }

      // Subtract 1 point from the most voted player (if not the imposter)
      if (mostVotedCount > 0) {
        // Find all players with the most votes
        const playersWithMostVotes = sortedPlayers.filter(player => 
          voteCount[player.id] === mostVotedCount
        );
        
        // Subtract 1 point from each non-imposter with most votes
        playersWithMostVotes.forEach(player => {
          if (player.id !== imposterId) {
            const oldScore = currentScores[player.id];
            currentScores[player.id] = (currentScores[player.id] || 0) - 1;
            console.log(`Subtracted 1 point from tied most voted player ${player.id} (${oldScore} -> ${currentScores[player.id]})`);
          }
        });
      }

      console.log('Final scores after update:', JSON.stringify(currentScores));

      // Save scores to Firebase
      await set(scoresRef, currentScores);
      console.log('Scores saved to Firebase successfully');

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
        <div className="text-white text-xl">Reconnecting...</div>
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