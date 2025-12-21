import { useState, useEffect } from 'react';

// Word categories directly in the file
const wordCategories = {
  animals: [
    { word: 'Chat', hint: 'Domestique' },
    { word: 'Chien', hint: 'Fidèle' },
  ]
};

function getRandomWord(categories = ['animals']) {
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
  const [triangles, setTriangles] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [generatedWord, setGeneratedWord] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Check if current user is the imposter
  const isImposter = currentUser && imposterId && currentUser.firebaseId === imposterId;
  
  console.log('===== IMPOSTER CHECK =====');
  console.log('Current User Firebase ID:', currentUser?.firebaseId);
  console.log('Imposter ID from props:', imposterId);
  console.log('Is Imposter:', isImposter);
  console.log('========================');

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
          opacity: Math.random() * 0.25
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

    const unsubscribe = onValue(wordRef, async (snapshot) => {
      const wordData = snapshot.val();
      
      if (wordData && wordData.word) {
        setGeneratedWord(wordData.word);
        setHint(wordData.hint || '');
        setCategory(wordData.category || '');
        setLoading(false);
      } else {
        // Generate word logic - you'll add your word data back here
        const randomWord = {
          word: 'Pomme',
          hint: 'Fruit',
          category: 'food'
        };
        
        await set(wordRef, {
          word: randomWord.word,
          hint: randomWord.hint,
          category: randomWord.category,
          generatedAt: Date.now()
        });
        
        setGeneratedWord(randomWord.word);
        setHint(randomWord.hint);
        setCategory(randomWord.category);
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
      onConfirm({ 
        selectedPlayer, 
        word: generatedWord,
        hint: hint,
        category: category
      });
    }
  };

  console.log('Is Imposter:', isImposter, 'Current User:', currentUser?.firebaseId, 'Imposter ID:', imposterId);

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
      
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #a8a8a8ff, #686868ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', margin: 0, boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, overflow: 'auto' }}>
        
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
              borderBottom: `${triangle.size * 1.732}px solid rgba(${isImposter ? '255, 102, 102' : '153, 255, 153'}, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        
          {/* Generated Word with Hint */}
          <div style={{
            width: '100%',
            padding: '2rem',
            backgroundColor: '#b3b3b3ff',
            border: '4px solid #6f6f6fff',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#6f6f6fff',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {loading ? 'Generating word...' : (
              <>
                {isImposter ? (
                  <>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>😈 Tu es l'imposteur!</div>
                    <div style={{ fontSize: '1rem' }}>Indice: {hint}</div>
                  </>
                ) : (
                  <>
                    <div>{generatedWord}</div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Players List */}
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
                    backgroundColor: isSelected ? 'rgba(150, 50, 94, 0.2)' : 'transparent',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? '#6f6f6fff' : 'transparent'}`
                  }}
                >
                  {/* Player Photo */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `4px solid ${isCurrentUser ? (isImposter ? '#cd6a6aff' : '#74a887ff') : '#6f6f6fff'}`,
                    backgroundColor: '#b3b3b3ff',
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
                    backgroundColor: '#b3b3b3ff',
                    border: `4px solid ${isCurrentUser ? (isImposter ? '#cd6a6aff' : '#74a887ff') : '#6f6f6fff'}`,
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isCurrentUser ? (isImposter ? '#cd6a6aff' : '#74a887ff') : '#6f6f6fff',
                  }}>
                    {player.username}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '-5px' }}>
            <button
              onClick={handleConfirm}
              style={{
                padding: '1rem 5rem',
                backgroundColor: '#b3b3b3ff',
                border: '4px solid #6f6f6fff',
                borderRadius: '9999px',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: '#6f6f6fff',
                cursor: 'pointer',
                minWidth: '250px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c9c9c9ff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#b3b3b3ff'}
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}