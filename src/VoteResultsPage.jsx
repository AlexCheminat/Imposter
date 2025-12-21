import { useState, useEffect } from 'react';

export default function VoteResultsPage({ players = [], votes = {}, imposterId, onContinue }) {
  const [triangles, setTriangles] = useState([]);
  const [showResult, setShowResult] = useState(false);

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

    // Show result after all votes are in
    // You can add a delay here if you want
    setTimeout(() => setShowResult(true), 2000);
  }, []);

  // Calculate votes for each player
  const voteCount = {};
  players.forEach(player => {
    voteCount[player.id] = 0;
  });

  Object.values(votes).forEach(vote => {
    if (vote.votedFor && voteCount[vote.votedFor] !== undefined) {
      voteCount[vote.votedFor]++;
    }
  });

  // Sort players by vote count (descending)
  const sortedPlayers = [...players].sort((a, b) => {
    return (voteCount[b.id] || 0) - (voteCount[a.id] || 0);
  });

  // Find max votes for scaling the bars
  const maxVotes = Math.max(...Object.values(voteCount), 1);

  // Check if imposter was caught
  const mostVotedPlayer = sortedPlayers[0];
  const imposterCaught = mostVotedPlayer && mostVotedPlayer.id === imposterId;

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
        
          {/* Result Message */}
          {showResult && (
            <div style={{
              width: '100%',
              padding: '1.5rem',
              backgroundColor: '#93c5fd',
              border: '4px solid #38475eff',
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#38475eff'
            }}>
              {imposterCaught 
                ? 'Imposter has won/lost (This will only display once everyone has voted!)'
                : 'Imposter has won/lost (This will only display once everyone has voted!)'}
            </div>
          )}

          {/* Vote Results - Bar Graph */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedPlayers.map(player => {
              const votes = voteCount[player.id] || 0;
              const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;

              return (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Player Photo */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid #38475eff',
                    backgroundColor: '#93c5fd',
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

                  {/* Vote Bar */}
                  <div style={{
                    flex: 1,
                    height: '60px',
                    backgroundColor: '#93c5fd',
                    border: '4px solid #38475eff',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      backgroundColor: '#60a5fa',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>

                  {/* Vote Count */}
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#38475eff',
                    minWidth: '30px',
                    textAlign: 'center'
                  }}>
                    {votes}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          {showResult && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={onContinue}
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
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}