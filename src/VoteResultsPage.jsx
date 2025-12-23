import { useState, useEffect } from 'react';

export default function VoteResultsPage({ players = [], votes = {}, imposterId, currentUser, onContinue }) {
  const [triangles, setTriangles] = useState([]);

  // Check if all players have voted
  const allPlayersVoted = Object.keys(votes).length === players.length && players.length > 0;

  // Sort players by join time to determine host
  const sortedPlayersByJoinTime = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  
  // Debug logs
  console.log('VoteResults - Current User:', currentUser);
  console.log('VoteResults - First Player:', sortedPlayersByJoinTime[0]);
  console.log('VoteResults - All Players:', players);
  
  // Check if current user is the first player (host)
  const isFirstPlayer = sortedPlayersByJoinTime.length > 0 && currentUser && 
                        sortedPlayersByJoinTime[0].id === currentUser.firebaseId;
  
  console.log('VoteResults - isFirstPlayer:', isFirstPlayer);

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

  // Calculate votes for each player and track who voted for whom
  const voteCount = {};
  const votersForPlayer = {};
  
  players.forEach(player => {
    voteCount[player.id] = 0;
    votersForPlayer[player.id] = [];
  });

  // Process votes and build voter lists
  Object.entries(votes).forEach(([voterId, vote]) => {
    if (vote.votedFor && voteCount[vote.votedFor] !== undefined) {
      voteCount[vote.votedFor]++;
      const voter = players.find(p => p.id === voterId);
      if (voter) {
        votersForPlayer[vote.votedFor].push(voter);
      }
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
  const secondMostVotedPlayer = sortedPlayers[1];
  const imposterCaught = mostVotedPlayer && mostVotedPlayer.id === imposterId
                      && voteCount[mostVotedPlayer.id] > voteCount[secondMostVotedPlayer.id];

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
      
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #ddb96aff, #f0d28fff)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', paddingBottom: '100px', margin: 0, boxSizing: 'border-box', position: 'relative', overflow: 'auto' }}>
        
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
              borderBottom: `${triangle.size * 1.732}px solid rgba(255, 153, 51, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        
          {/* Result Message - Only show when all votes are in */}
          {allPlayersVoted && (
            <div style={{
              width: '100%',
              padding: '1.5rem',
              backgroundColor: '#f3d985ff',
              border: '4px solid #977b48ff',
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#977b48ff'
            }}>
              {imposterCaught
                ? 'L\'imposteur a perdu'
                : 'L\'imposteur a gagné'}
            </div>
          )}

          {/* Vote Results - Bar Graph */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedPlayers.map(player => {
              const votes = voteCount[player.id] || 0;
              const voters = votersForPlayer[player.id] || [];
              const isImposter = player.id === imposterId;

              return (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Player Photo - Red border if imposter and all votes are in */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `4px solid ${allPlayersVoted && isImposter ? '#ad5246ff' : '#977b48ff'}`,
                    backgroundColor: '#f3d985ff',
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

                  {/* Vote Bar with Voter Photos */}
                  <div style={{
                    flex: 1,
                    height: '60px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {voters.length > 0 && (
                      <div style={{
                        width: `${voters.length * 53 + 5}px`,
                        height: '100%',
                        backgroundColor: '#dba952ff',
                        border: '4px solid #977b48ff',
                        transition: 'width 0.5s ease-out',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 0.5rem',
                        gap: '0.3rem',
                        overflow: 'visible',
                        boxSizing: 'border-box'
                      }}>
                        {/* Display voter photos inside the bar */}
                        {voters.map((voter) => (
                          <div
                            key={voter.id}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: '2px solid #977b48ff',
                              backgroundColor: '#f3d985ff',
                              flexShrink: 0
                            }}
                          >
                            <img 
                              src={voter.photo} 
                              alt={voter.username}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Vote Count */}
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#977b48ff',
                    minWidth: '30px',
                    textAlign: 'center'
                  }}>
                    {votes}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button - Only show when all votes are in AND user is host */}
          {allPlayersVoted && isFirstPlayer && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={onContinue}
                style={{
                  padding: '1rem 5rem',
                  backgroundColor: '#f3d985ff',
                  border: '4px solid #977b48ff',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: '#977b48ff',
                  cursor: 'pointer',
                  minWidth: '250px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dcb869ff'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3d985ff'}
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}