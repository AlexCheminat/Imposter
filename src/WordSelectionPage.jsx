import { useState, useEffect } from 'react';

export default function WordSelectionPage({ players = [], currentUser, onConfirm, lobbyId, database }) {
  const [triangles, setTriangles] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [generatedWord, setGeneratedWord] = useState('');
  const [loading, setLoading] = useState(true);

  // Generate animated triangles
  useEffect(() => {
    const generateTriangles = () => {
      const newTriangles = [];
      for (let i = 0; i < 8; i++) {
        newTriangles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 30 + 20,
          duration: Math.random() * 8 + 12,
          delay: i * 2.5 - 20,
          opacity: Math.random() * 0.25 + 0.1
        });
      }
      setTriangles(newTriangles);
    };
    generateTriangles();

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
  }, []);

  // Generate and sync word with Firebase
  useEffect(() => {
    if (!database || !lobbyId) return;

    const { ref, onValue, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);

    // Listen to the word in Firebase
    const unsubscribe = onValue(wordRef, async (snapshot) => {
      const wordData = snapshot.val();
      
      if (wordData && wordData.word) {
        // Word already exists, use it
        setGeneratedWord(wordData.word);
        setLoading(false);
      } else {
        // No word exists, generate one (only first viewer will do this)
        const commonNouns = [
          'pomme'
        ];
        
        const randomWord = commonNouns[Math.floor(Math.random() * commonNouns.length)];
        
        // Save to Firebase so everyone gets the same word
        await set(wordRef, {
          word: randomWord,
          generatedAt: Date.now()
        });
        
        setGeneratedWord(randomWord);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [database, lobbyId]);

  const handleConfirm = () => {
    if (!selectedPlayer) {
      alert('Please select a player!');
      return;
    }
    
    if (onConfirm) {
      onConfirm({ selectedPlayer, word: generatedWord });
    } else {
      alert(`Selected: ${selectedPlayer.username} with word: ${generatedWord}`);
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
        }
        @keyframes float-down {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
      
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #86efac, #bbf7d0)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', margin: 0, boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, overflow: 'auto' }}>
        
        {/* Animated Triangles Background */}
        {triangles.map(triangle => (
          <div
            key={triangle.id}
            style={{
              position: 'absolute',
              left: `${triangle.left}%`,
              top: '-100px',
              width: 0,
              height: 0,
              borderLeft: `${triangle.size}px solid transparent`,
              borderRight: `${triangle.size}px solid transparent`,
              borderBottom: `${triangle.size * 1.732}px solid rgba(134, 239, 172, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        
          {/* AI Generated Word */}
          <div style={{
            width: '100%',
            padding: '2rem',
            backgroundColor: '#86efac',
            border: '4px solid #22c55e',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#22c55e',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {loading ? 'Generating word...' : generatedWord}
          </div>

          {/* Players List with Radio Buttons */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {players.map(player => {
              const isCurrentUser = currentUser && player.id === currentUser.firebaseId;
              const isSelected = selectedPlayer && selectedPlayer.id === player.id;
              
              return (
                <div 
                  key={player.id} 
                  onClick={() => setSelectedPlayer(player)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? '#22c55e' : 'transparent'}`
                  }}
                >
                  {/* Player Photo */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `4px solid ${isCurrentUser ? '#22c55e' : '#22c55e'}`,
                    backgroundColor: isCurrentUser ? '#86efac' : '#86efac',
                    flexShrink: 0
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
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isCurrentUser ? '#86efac' : '#86efac',
                    border: `4px solid ${isCurrentUser ? '#22c55e' : '#22c55e'}`,
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isCurrentUser ? '#22c55e' : '#22c55e'
                  }}>
                    {player.username}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '4.5rem' }}>
            <button
              onClick={handleConfirm}
              style={{
                padding: '1rem 5rem',
                backgroundColor: '#86efac',
                border: '4px solid #22c55e',
                borderRadius: '9999px',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: '#22c55e',
                cursor: 'pointer',
                minWidth: '250px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#bbf7d0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#86efac'}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}