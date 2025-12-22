import { useState, useEffect } from 'react';

export default function FinalResultsPage({ players = [], scores = {}, currentUser, onNextRound }) {
  const [triangles, setTriangles] = useState([]);

  // Sort players by join time to determine host
  const sortedPlayersByJoinTime = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  
  // Debug logs
  console.log('FinalResults - Current User:', currentUser);
  console.log('FinalResults - First Player:', sortedPlayersByJoinTime[0]);
  console.log('FinalResults - All Players:', players);
  
  // Check if current user is the first player (host)
  const isFirstPlayer = sortedPlayersByJoinTime.length > 0 && currentUser && 
                        sortedPlayersByJoinTime[0].id === currentUser.firebaseId;
  
  console.log('FinalResults - isFirstPlayer:', isFirstPlayer);

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
    document.body.style.overflow = 'auto';
  }, []);

  // Get scores for each player
  const playerScores = players.map(player => ({
    ...player,
    score: scores[player.id] || 0
  }));

  // Sort players by score (descending)
  const sortedPlayers = [...playerScores].sort((a, b) => b.score - a.score);

  // Find max score for scaling the bars
  const maxScore = Math.max(...playerScores.map(p => p.score), 1);

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
          overflow-y: auto !important;
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
      
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #939393ff, #bebebeff)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', paddingBottom: '100px', margin: 0, boxSizing: 'border-box', position: 'relative' }}>
        
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
              borderBottom: `${triangle.size * 1.732}px solid rgba(192, 192, 192, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        
          {/* Total Scores Header */}
          <div style={{
            width: '100%',
            padding: '1.5rem',
            backgroundColor: '#cfcfcfff',
            border: '4px solid #979797ff',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#979797ff'
          }}>
            Scores Totaux
          </div>

          {/* Score Results - Bar Graph */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedPlayers.map(player => {
              const score = player.score;
              const barWidth = maxScore > 0 ? (score / maxScore) * 100 : 0;

              return (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Player Photo */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid #979797ff',
                    backgroundColor: '#cfcfcfff',
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

                  {/* Score Bar */}
                  <div style={{
                    flex: 1,
                    height: '60px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      backgroundColor: '#767676ff',
                      border: '4px solid #979797ff',
                      transition: 'width 0.5s ease-out',
                      minWidth: barWidth > 0 ? '4px' : '0'
                    }} />
                  </div>

                  {/* Score Count */}
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#979797ff',
                    minWidth: '30px',
                    textAlign: 'center'
                  }}>
                    {score}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Round Button - Only show for host */}
          {isFirstPlayer && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={onNextRound}
                style={{
                  padding: '1rem 5rem',
                  backgroundColor: '#cfcfcfff',
                  border: '4px solid #979797ff',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: '#979797ff',
                  cursor: 'pointer',
                  minWidth: '250px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#787878ff'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#cfcfcfff'}
              >
                Prochaine Partie
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}