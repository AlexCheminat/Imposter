import { useState, useEffect } from 'react';
import { RotateCw, Play } from 'lucide-react';

// Word categories directly in the file
const wordCategories = {
  animals: [
    { word: 'Chat', hint: 'Indépendant' },
    { word: 'Chien', hint: 'Loyal' },
  ]
};

function getRandomWord(categories = ['animals', 'food', 'objects', 'places', 'jobs', 'sports', 'countries', 'celebrities', 'brands']) {
  const allWords = [];
  
  categories.forEach(category => {
    if (wordCategories[category]) {
      wordCategories[category].forEach(item => {
        allWords.push({ ...item, category });
      });
    }
  });
  
  if (allWords.length === 0) {
    return { word: 'Pomme', hint: 'Fruit', category: 'food' };
  }
  
  return allWords[Math.floor(Math.random() * allWords.length)];
}

export default function WordSelectionPage({ players = [], currentUser, onConfirm, lobbyId, database, imposterId }) {
  const [particles, setParticles] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [generatedWord, setGeneratedWord] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['animals', 'food', 'objects']);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  
  // Sort players by join time to determine host
  const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  
  // Check if current user is the first player (host)
  const isFirstPlayer = sortedPlayers.length > 0 && currentUser && 
                        sortedPlayers[0].id === currentUser.firebaseId;

  // Check if current user is the imposter
  const isImposter = currentUser && imposterId && currentUser.firebaseId === imposterId;

  console.log('===== IMPOSTER CHECK =====');
  console.log('Current User Firebase ID:', currentUser?.firebaseId);
  console.log('Imposter ID from props:', imposterId);
  console.log('Is Imposter:', isImposter);
  console.log('========================');

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * -20,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };
    generateParticles();

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }, []);

  // Load selected categories from Firebase
  useEffect(() => {
    if (!database || !lobbyId) return;

    const { ref, onValue } = database;
    const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);

    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data) && data.length > 0) {
        setSelectedCategories(data);
      }
      setCategoriesLoaded(true);
    });

    return () => unsubscribe();
  }, [database, lobbyId]);

  // Generate and sync word with Firebase
  useEffect(() => {
    if (!database || !lobbyId || !categoriesLoaded) return;

    const { ref, onValue, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);

    const unsubscribe = onValue(wordRef, async (snapshot) => {
      const wordData = snapshot.val();
      
      if (wordData && wordData.word) {
        setGeneratedWord(wordData.word);
        setHint(wordData.hint || '');
        setCategory(wordData.category || '');
        setStartingPlayer(wordData.startingPlayer || null);
        setLoading(false);
        setIsRefreshing(false);
      } else {
        // Generate random word using getRandomWord function with selected categories
        const randomWordData = getRandomWord(selectedCategories);
        
        // Select random starting player
        const randomPlayerIndex = Math.floor(Math.random() * players.length);
        const randomPlayer = players[randomPlayerIndex];
        
        await set(wordRef, {
          word: randomWordData.word,
          hint: randomWordData.hint,
          category: randomWordData.category,
          startingPlayer: randomPlayer ? randomPlayer.username : null,
          generatedAt: Date.now()
        });
        
        setGeneratedWord(randomWordData.word);
        setHint(randomWordData.hint);
        setCategory(randomWordData.category);
        setStartingPlayer(randomPlayer ? randomPlayer.username : null);
        setLoading(false);
        setIsRefreshing(false);
      }
    });

    return () => unsubscribe();
  }, [database, lobbyId, players, selectedCategories, categoriesLoaded]);

  const handleRefresh = async () => {
    if (!database || !lobbyId || isRefreshing) return;
    
    setIsRefreshing(true);
    
    const { ref, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);
    const imposterRef = ref(database.db, `lobbies/${lobbyId}/gameState/imposterId`);
    
    // Generate new random word using selected categories
    const randomWordData = getRandomWord(selectedCategories);
    
    // Select random starting player
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomPlayerIndex];
    
    // Select random imposter (independently, can be anyone including starting player)
    const randomImposterIndex = Math.floor(Math.random() * players.length);
    const randomImposter = players[randomImposterIndex];
    
    // Update both word and imposter in Firebase
    await set(wordRef, {
      word: randomWordData.word,
      hint: randomWordData.hint,
      category: randomWordData.category,
      startingPlayer: randomPlayer ? randomPlayer.username : null,
      generatedAt: Date.now()
    });
    
    await set(imposterRef, randomImposter ? randomImposter.id : null);
  };

  const handleConfirm = () => {
    if (!selectedPlayer) {
      alert('Vous devez choisir un joueur!');
      return;
    }
    
    if (onConfirm) {
      onConfirm({ 
        selectedPlayer, 
        word: generatedWord,
        hint: hint,
        category: category
      });
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
        }
        body > div {
          max-width: 100vw !important;
        }
        #root {
          min-height: 100vh;
        }
        @keyframes drift {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.7), 0 0 60px rgba(239, 68, 68, 0.5);
          }
        }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .btn-hover:active {
          transform: translateY(0);
        }
        .player-card {
          transition: all 0.3s ease;
        }
        .player-card:not(.disabled):hover {
          transform: translateX(5px);
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        background: isImposter 
          ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '2rem', 
        paddingBottom: '3rem', 
        boxSizing: 'border-box', 
        position: 'relative' 
      }}>
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              bottom: '-20px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: `rgba(255, 255, 255, ${particle.opacity})`,
              animation: `drift ${particle.duration}s linear ${particle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        {/* Main Container */}
        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '2rem', 
          position: 'relative', 
          zIndex: 10, 
          marginTop: '4rem',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
        
          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            marginBottom: '-1rem'
          }}>
            {isImposter ? '🎭 Vous êtes l\'Imposteur!' : '🎯 Votre Mot'}
          </h1>

          {/* Generated Word Card */}
          <div style={{
            width: '100%',
            height: '250px',
            padding: '2.5rem 2rem',
            background: isImposter 
              ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 100%)'
              : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            border: isImposter 
              ? '3px solid rgba(239, 68, 68, 0.6)'
              : '3px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '30px',
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            position: 'relative',
            boxSizing: 'border-box',
            boxShadow: isImposter 
              ? '0 15px 40px rgba(220, 38, 38, 0.4)'
              : '0 15px 40px rgba(0, 0, 0, 0.3)',
            animation: isImposter ? 'pulse 2s infinite' : 'none'
          }}>
            {/* Refresh Button */}
            {isFirstPlayer && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="btn-hover"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isRefreshing || loading ? 0.5 : 1,
                  padding: 0
                }}
              >
                <RotateCw 
                  size={22} 
                  color="white"
                  strokeWidth={2}
                  style={{
                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                  }}
                />
              </button>
            )}

            {loading ? (
              <div style={{ fontSize: '1.25rem' }}>Chargement...</div>
            ) : (
              <>
                {isImposter ? (
                  <>
                    <div style={{ fontSize: '1.5rem', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                      Vous devez deviner!
                    </div>
                    <div style={{ 
                      fontSize: '1.125rem', 
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '15px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      💡 Indice: {hint}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '2.5rem', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                    {generatedWord}
                  </div>
                )}
                {startingPlayer && (
                  <div style={{ 
                    fontSize: '1rem', 
                    opacity: 0.9,
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Play size={18} fill="white" />
                    {startingPlayer} commence
                  </div>
                )}
              </>
            )}
          </div>

          {/* Players List Section */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Qui est l'Imposteur?
            </h2>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {players.map((player, index) => {
                const isCurrentUser = currentUser && player.id === currentUser.firebaseId;
                const isSelected = selectedPlayer && selectedPlayer.id === player.id;
                const cannotSelect = isCurrentUser;
                
                return (
                  <div 
                    key={player.id} 
                    onClick={() => !cannotSelect && setSelectedPlayer(player)}
                    className={`player-card ${cannotSelect ? 'disabled' : ''}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      cursor: cannotSelect ? 'not-allowed' : 'pointer',
                      padding: isSelected ? '0.25rem' : '0.5rem',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(240, 68, 56, 0.3) 100%)'
                        : 'transparent',
                      backdropFilter: isSelected ? 'blur(10px)' : 'none',
                      borderRadius: '20px',
                      border: `3px solid ${isSelected ? 'rgba(245, 87, 108, 0.6)' : 'transparent'}`,
                      opacity: cannotSelect ? 0.5 : 1,
                      animation: `slideIn 0.4s ease-out ${index * 0.1}s backwards`
                    }}
                  >
                    {/* Player Photo */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: isCurrentUser 
                        ? (isImposter ? '3px solid rgba(239, 68, 68, 0.8)' : '3px solid rgba(16, 185, 129, 0.8)')
                        : '3px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                      boxShadow: isCurrentUser 
                        ? (isImposter ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(16, 185, 129, 0.5)')
                        : '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}>
                      <img 
                        src={player.photo} 
                        alt={player.username}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Player Username */}
                    <div style={{
                      flex: 1,
                      padding: '1rem 1.5rem',
                      background: isCurrentUser 
                        ? (isImposter 
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)'
                          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)')
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: isCurrentUser 
                        ? (isImposter ? '2px solid rgba(239, 68, 68, 0.6)' : '2px solid rgba(16, 185, 129, 0.6)')
                        : '2px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '20px',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                      minWidth: 0
                    }}>
                      {player.username}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="btn-hover"
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: '3px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '25px',
              fontWeight: '700',
              fontSize: '1.25rem',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(245, 87, 108, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Voter 🗳️
          </button>
        </div>
      </div>
    </>
  );
}