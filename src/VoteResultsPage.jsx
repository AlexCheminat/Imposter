import { useState, useEffect } from 'react';
import { Trophy, XCircle, BarChart3 } from 'lucide-react';

export default function VoteResultsPage({ players = [], votes = {}, imposterId, currentUser, onContinue }) {
  const [particles, setParticles] = useState([]);
  const [hasContinued, setHasContinued] = useState(false);

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

  const handleContinue = () => {
    setHasContinued(true);
    if (onContinue) onContinue();
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
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
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes expandBar {
          from {
            width: 0;
          }
          to {
            width: var(--bar-width);
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
        .btn-hover:disabled:hover {
          transform: none;
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '2rem', 
        paddingBottom: '0', 
        boxSizing: 'border-box', 
        position: 'relative',
        overflowX: 'auto'
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
          marginTop: '2rem',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
        
          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            marginBottom: '-1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <BarChart3 size={40} />
            Résultats
          </h1>

          {/* Result Message - Only show when all votes are in */}
          {allPlayersVoted ? (
            <div style={{
              width: '100%',
              padding: '2rem',
              background: imposterCaught 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)',
              backdropFilter: 'blur(20px)',
              border: imposterCaught 
                ? '3px solid rgba(16, 185, 129, 0.6)'
                : '3px solid rgba(239, 68, 68, 0.6)',
              borderRadius: '30px',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              boxShadow: imposterCaught
                ? '0 15px 40px rgba(16, 185, 129, 0.3)'
                : '0 15px 40px rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}>
              {imposterCaught ? (
                <>
                  <Trophy size={32} />
                  L'imposteur a été attrapé!
                </>
              ) : (
                <>
                  <XCircle size={32} />
                  L'imposteur a gagné!
                </>
              )}
            </div>
          ) : (
            <div style={{
              width: '100%',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '3px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '30px',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}>
              ⏳ En attente des votes...
            </div>
          )}

          {/* Vote Results Container */}
          <div style={{
            width: '100%',
            minWidth: 'fit-content',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
            overflow: 'visible'
          }}>
            {/* Vote Results - Bar Graph */}
            <div style={{ width: '100%', minWidth: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'visible' }}>
              {sortedPlayers.map((player, index) => {
                const votes = voteCount[player.id] || 0;
                const voters = votersForPlayer[player.id] || [];
                const isImposter = player.id === imposterId;

                return (
                  <div 
                    key={player.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      animation: `slideInRight 0.4s ease-out ${index * 0.1}s backwards`
                    }}
                  >
                    {/* Player Photo - Red border if imposter and all votes are in */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: allPlayersVoted && isImposter 
                        ? '3px solid rgba(239, 68, 68, 0.8)'
                        : '3px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                      boxShadow: allPlayersVoted && isImposter
                        ? '0 0 20px rgba(239, 68, 68, 0.5)'
                        : '0 4px 15px rgba(0, 0, 0, 0.2)',
                      position: 'relative'
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
                      alignItems: 'center',
                      minWidth: 0,
                      overflow: 'visible'
                    }}>
                      {voters.length > 0 && (
                        <div style={{
                          width: `${voters.length * 51 + 5}px`,
                          maxWidth: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.4) 0%, rgba(240, 68, 56, 0.4) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                          borderRadius: '15px',
                          transition: 'width 0.5s ease-out',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0.5rem',
                          gap: '0.3rem',
                          overflow: 'visible',
                          boxSizing: 'border-box',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
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
                                border: '2px solid rgba(255, 255, 255, 0.8)',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                flexShrink: 0,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
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
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: 'white',
                      minWidth: '40px',
                      textAlign: 'center',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}>
                      {votes}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Button - Only show when all votes are in AND user is host */}
          {allPlayersVoted && isFirstPlayer && (
            <button
              onClick={handleContinue}
              disabled={hasContinued}
              className="btn-hover"
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '1.25rem 3rem',
                background: hasContinued
                  ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                  : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: '3px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '1.25rem',
                color: 'white',
                cursor: hasContinued ? 'not-allowed' : 'pointer',
                boxShadow: hasContinued
                  ? '0 10px 30px rgba(100, 116, 139, 0.4)'
                  : '0 10px 30px rgba(245, 87, 108, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '1rem',
                opacity: hasContinued ? 0.6 : 1
              }}
            >
              {hasContinued ? 'En cours... ⏳' : 'Continuer ➡️'}
            </button>
          )}

          {/* Waiting message for non-hosts */}
          {allPlayersVoted && !isFirstPlayer && (
            <div style={{
              width: '100%',
              padding: '1rem 2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem',
              textAlign: 'center',
              fontWeight: '500',
              boxSizing: 'border-box'
            }}>
              En attente que l'hôte continue...
            </div>
          )}
        </div>
      </div>
    </>
  );
}