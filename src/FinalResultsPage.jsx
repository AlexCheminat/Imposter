import { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

export default function FinalResultsPage({ players = [], scores = {}, currentUser, onNextRound }) {
  const [particles, setParticles] = useState([]);

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

  // Get scores for each player
  const playerScores = players.map(player => ({
    ...player,
    score: scores[player.id] || 0
  }));

  // Sort players by score (descending)
  const sortedPlayers = [...playerScores].sort((a, b) => b.score - a.score);

  // Find max score for scaling the bars
  const maxScore = Math.max(...playerScores.map(p => p.score), 1);

  // Check if there's a clear winner (no tie at the top)
  const topScore = sortedPlayers[0]?.score || 0;
  const secondScore = sortedPlayers[1]?.score || -1;
  const hasWinner = topScore > 0 && topScore > secondScore;

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
          width: 100% !important;
          max-width: 100% !important;
          height: 100% !important;
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
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
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
          marginTop: '9rem',
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
            <Trophy size={40} />
            Classement Final
          </h1>

          {/* Winner Highlight - Only show if there's a clear winner */}
          {hasWinner && (
            <div style={{
              width: '100%',
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)',
              backdropFilter: 'blur(20px)',
              border: '3px solid rgba(251, 191, 36, 0.6)',
              borderRadius: '30px',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              boxShadow: '0 15px 40px rgba(251, 191, 36, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}>
              <Trophy size={32} fill="#fbbf24" color="#fbbf24" />
              {sortedPlayers[0].username} Gagne!
            </div>
          )}

          {/* Scores Container */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Score Results - Bar Graph */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {sortedPlayers.map((player, index) => {
                const score = player.score;
                const barWidth = maxScore > 0 ? (score / maxScore) * 100 : 0;
                const isWinner = hasWinner && index === 0;

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
                    {/* Player Photo */}
                    <div style={{
                      position: 'relative',
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: isWinner 
                        ? '3px solid rgba(251, 191, 36, 0.8)'
                        : '3px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                      boxShadow: isWinner
                        ? '0 0 20px rgba(251, 191, 36, 0.5)'
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

                    {/* Score Bar */}
                    <div style={{
                      flex: 1,
                      height: '60px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: 0
                    }}>
                      {barWidth > 0 && (
                        <div style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          background: isWinner
                            ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.4) 100%)'
                            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: isWinner
                            ? '2px solid rgba(251, 191, 36, 0.6)'
                            : '2px solid rgba(255, 255, 255, 0.5)',
                          borderRadius: '15px',
                          transition: 'width 0.8s ease-out',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '1rem',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '1rem',
                          animation: 'expandBar 0.8s ease-out'
                        }}>
                          {player.username}
                        </div>
                      )}
                    </div>

                    {/* Score Count */}
                    <div style={{
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: 'white',
                      minWidth: '40px',
                      textAlign: 'center',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}>
                      {score}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Round Button - Only show for host */}
          {isFirstPlayer && (
            <button
              onClick={onNextRound}
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
                letterSpacing: '1px',
                marginTop: '1rem'
              }}
            >
              Nouvelle Partie 🎮
            </button>
          )}

          {/* Waiting message for non-hosts */}
          {!isFirstPlayer && (
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
              En attente que l'hôte lance une nouvelle partie...
            </div>
          )}
        </div>
      </div>
    </>
  );
}