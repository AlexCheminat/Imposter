import { useState, useEffect } from 'react';

export default function WordSelectionPage({ players = [], currentUser, onConfirm }) {
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

  // Generate random noun using Claude API
  useEffect(() => {
    const generateWord = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              { 
                role: "user", 
                content: "Generate a single random common noun (like 'apple', 'chair', 'ocean', 'building'). Reply with ONLY the word, nothing else." 
              }
            ],
          })
        });

        const data = await response.json();
        const word = data.content[0].text.trim();
        setGeneratedWord(word);
        setLoading(false);
      } catch (error) {
        console.error('Error generating word:', error);
        setGeneratedWord('apple'); // Fallback word
        setLoading(false);
      }
    };

    generateWord();
  }, []);

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
      
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #93c5fd, #bfdbfe)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', margin: 0, boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, overflow: 'auto' }}>
        
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
              borderBottom: `${triangle.size * 1.732}px solid rgba(147, 197, 253, ${triangle.opacity})`,
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
            backgroundColor: '#93c5fd',
            border: '4px solid #38475eff',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#38475eff',
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
                    backgroundColor: isSelected ? 'rgba(59, 71, 94, 0.1)' : 'transparent',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? '#38475eff' : 'transparent'}`
                  }}
                >
                  {/* Radio Button */}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '3px solid #38475eff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && (
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#38475eff'
                      }} />
                    )}
                  </div>

                  {/* Player Photo */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `4px solid ${isCurrentUser ? '#22c55e' : '#38475eff'}`,
                    backgroundColor: isCurrentUser ? '#86efac' : '#93c5fd',
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
                    backgroundColor: isCurrentUser ? '#86efac' : '#93c5fd',
                    border: `4px solid ${isCurrentUser ? '#22c55e' : '#38475eff'}`,
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isCurrentUser ? '#22c55e' : '#38475eff'
                  }}>
                    {player.username}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleConfirm}
              style={{
                padding: '1rem 5rem',
                backgroundColor: '#93c5fd',
                border: '4px solid #38475eff',
                borderRadius: '9999px',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: '#38475eff',
                cursor: 'pointer',
                minWidth: '250px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#bfdbfe'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#93c5fd'}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}