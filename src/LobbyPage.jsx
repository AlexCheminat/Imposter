import { useState, useEffect } from 'react';

export default function LobbyPage({ players = [], currentUser, onStartGame }) {
  const [triangles, setTriangles] = useState([]);
  
  // Sort players by join time to determine host
  const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  
  // Check if current user is the first player (host)
  const isFirstPlayer = sortedPlayers.length > 0 && currentUser && 
                        sortedPlayers[0].id === currentUser.firebaseId;

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

  const handleStart = () => {
    if (onStartGame) {
      onStartGame();
    } else {
      alert('Starting game...');
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
      
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #c084fc, #e9d5ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', margin: 0, boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, overflow: 'auto' }}>
        
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
              borderBottom: `${triangle.size * 1.732}px solid rgba(192, 132, 252, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        
          {/* Player Count - Fixed at top */}
          <div style={{
            width: '100%',
            padding: '1rem 2rem',
            backgroundColor: '#c084fc',
            border: '4px solid #7c3aed',
            textAlign: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#7c3aed'
          }}>
            Player Count: {sortedPlayers.length}
          </div>

          {/* Players List */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '400px' }}>
            {sortedPlayers.map(player => {
              const isCurrentUser = currentUser && player.id === currentUser.firebaseId;
              return (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Player Photo */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `4px solid ${isCurrentUser ? '#22c55e' : '#7c3aed'}`,
                    backgroundColor: isCurrentUser ? '#86efac' : '#c084fc',
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
                    padding: '1.5rem',
                    backgroundColor: isCurrentUser ? '#86efac' : '#c084fc',
                    border: `4px solid ${isCurrentUser ? '#22c55e' : '#7c3aed'}`,
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: isCurrentUser ? '#22c55e' : '#7c3aed'
                  }}>
                    {player.username}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Start Button (only for first player) */}
          {isFirstPlayer && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={handleStart}
                style={{
                  padding: '1rem 5rem',
                  backgroundColor: '#c084fc',
                  border: '4px solid #7c3aed',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: '#7c3aed',
                  cursor: 'pointer',
                  minWidth: '250px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e9d5ff'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#c084fc'}
              >
                Start
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}