import { useState, useEffect } from 'react';
import { Settings, Users, Crown } from 'lucide-react';

export default function LobbyPage({ players = [], currentUser, onStartGame, onOpenSettings }) {
  const [particles, setParticles] = useState([]);
  
  // Sort players by join time to determine host
  const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  
  // Check if current user is the first player (host)
  const isFirstPlayer = sortedPlayers.length > 0 && currentUser && 
                        sortedPlayers[0].id === currentUser.firebaseId;

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

  const handleStart = () => {
    console.log('Start button clicked, calling onStartGame...');
    if (onStartGame) {
      onStartGame();
    } else {
      console.error('onStartGame prop not provided!');
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
          width: 100% !important;
          max-width: 100% !important;
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
          pointer-events: none;
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

        {/* Settings Icon (only for host) */}
        {isFirstPlayer && (
          <button
            onClick={onOpenSettings}
            className="btn-hover"
            style={{
              position: 'absolute',
              top: '3rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Settings size={28} color="white" />
          </button>
        )}

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
          marginTop: isFirstPlayer ? '5rem' : '2rem',
          animation: 'fadeInUp 0.6s ease-out'
        }}>

          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            marginBottom: '-1rem'
          }}>
            Salle d'attente
          </h1>

          {/* Player Count Card */}
          <div style={{
            width: '100%',
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '25px',
            textAlign: 'center',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'white',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            <Users size={28} />
            <span>{sortedPlayers.length} {sortedPlayers.length === 1 ? 'Joueur' : 'Joueurs'}</span>
          </div>

          {/* Players List Container */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
            minHeight: '300px'
          }}>
            <div style={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem'
            }}>
              {sortedPlayers.map((player, index) => {
                const isCurrentUser = currentUser && player.id === currentUser.firebaseId;
                const isHost = index === 0;
                return (
                  <div 
                    key={player.id} 
                    className="player-card"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      animation: `slideIn 0.4s ease-out ${index * 0.1}s backwards`
                    }}
                  >
                    {/* Player Photo */}
                    <div style={{
                      position: 'relative',
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `3px solid ${isCurrentUser ? '#10b981' : 'rgba(255, 255, 255, 0.6)'}`,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                      boxShadow: isCurrentUser ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 4px 15px rgba(0, 0, 0, 0.2)'
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
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: `2px solid ${isCurrentUser ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.4)'}`,
                      borderRadius: '20px',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      {player.username}
                      {isCurrentUser && <span style={{ fontSize: '0.875rem', opacity: 0.8 }}></span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Button (only for first player) */}
          {isFirstPlayer && (
            <button
              onClick={handleStart}
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
              Commencer la Partie 🚀
            </button>
          )}

          {/* Waiting message for non-hosts */}
          {!isFirstPlayer && (
            <div style={{
              padding: '1rem 2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              En attente que l'hôte lance la partie...
            </div>
          )}
        </div>
      </div>
    </>
  );
}