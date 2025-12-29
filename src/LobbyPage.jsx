import { useState, useEffect } from 'react';
import { Settings, Users, Crown, Zap } from 'lucide-react';

export default function LobbyPage({ players = [], currentUser, onStartGame, onOpenSettings }) {
  const [particles, setParticles] = useState([]);
  const [pulseSettings, setPulseSettings] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  const isFirstPlayer = sortedPlayers.length > 0 && currentUser && 
                        sortedPlayers[0].id === currentUser.firebaseId;

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 6 + 2,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * -20,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
      setParticles(newParticles);
    };
    generateParticles();

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }, []);

  // Pulse settings button every 5 seconds
  useEffect(() => {
    if (!isFirstPlayer) return;
    const interval = setInterval(() => {
      setPulseSettings(true);
      setTimeout(() => setPulseSettings(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [isFirstPlayer]);

  const handleStart = () => {
    if (isStarting) return; // Prevent multiple clicks
    setIsStarting(true);
    
    if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
        #root { min-height: 100vh; }
        @keyframes drift {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.8); }
        }
        @keyframes settingsPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(10deg); }
          75% { transform: scale(1.1) rotate(-10deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-hover:hover::before {
          width: 300px;
          height: 300px;
        }
        .btn-hover:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        .btn-hover:active {
          transform: translateY(-1px) scale(0.98);
        }
        .player-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .player-card:hover {
          transform: translateX(10px) scale(1.02);
        }
        .host-crown {
          animation: bounce 2s ease-in-out infinite;
        }
        .settings-pulse {
          animation: settingsPulse 0.5s ease-in-out;
        }
        .shimmer-effect {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem', 
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
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

        {isFirstPlayer && (
          <button
            onClick={onOpenSettings}
            className={`btn-hover ${pulseSettings ? 'settings-pulse' : ''}`}
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
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
              animation: 'slideInRight 0.6s ease-out'
            }}
          >
            <Settings size={28} color="white" />
          </button>
        )}

        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '2rem', 
          position: 'relative', 
          zIndex: 10, 
          marginTop: isFirstPlayer ? '5rem' : '2rem'
        }}>

          <h1 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            marginBottom: '-1rem',
            animation: 'fadeInUp 0.6s ease-out'
          }}>
            Salle d'attente
          </h1>

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
            gap: '0.75rem',
            animation: 'scaleIn 0.6s ease-out 0.1s backwards'
          }}>
            <Users size={28} />
            <span>{sortedPlayers.length} {sortedPlayers.length === 1 ? 'Joueur' : 'Joueurs'}</span>
          </div>

          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
            minHeight: '300px',
            animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
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
                      animation: `slideInLeft 0.5s ease-out ${index * 0.1 + 0.3}s backwards`
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: isCurrentUser 
                        ? '3px solid rgba(16, 185, 129, 0.8)' 
                        : isHost 
                        ? '3px solid rgba(251, 191, 36, 0.8)'
                        : '3px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                      boxShadow: isCurrentUser 
                        ? '0 0 20px rgba(16, 185, 129, 0.5)' 
                        : isHost
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
                      {isHost && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 10px rgba(251, 191, 36, 0.5)',
                          border: '2px solid white'
                        }}>
                          <Crown size={16} color="white" className="host-crown" />
                        </div>
                      )}
                    </div>

                    <div style={{
                      flex: 1,
                      padding: '1rem 1.5rem',
                      background: isCurrentUser 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                        : isHost
                        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: isCurrentUser 
                        ? '2px solid rgba(16, 185, 129, 0.6)'
                        : isHost
                        ? '2px solid rgba(251, 191, 36, 0.6)'
                        : '2px solid rgba(255, 255, 255, 0.4)',
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
                      {isHost && <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>👑 Hôte</span>}
                      {isCurrentUser && !isHost && <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>✨ Vous</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {isFirstPlayer && (
            <button
              onClick={handleStart}
              disabled={isStarting}
              className={`btn-hover ${isStarting ? '' : 'shimmer-effect'}`}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '1.25rem 3rem',
                background: isStarting 
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)',
                backgroundSize: isStarting ? '100% 100%' : '200% 100%',
                border: '3px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '1.25rem',
                color: 'white',
                cursor: isStarting ? 'not-allowed' : 'pointer',
                boxShadow: isStarting ? 'none' : '0 10px 30px rgba(245, 87, 108, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '1rem',
                animation: isStarting ? 'none' : 'scaleIn 0.6s ease-out 0.4s backwards',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                opacity: isStarting ? 0.6 : 1
              }}
            >
              {isStarting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Lancement...
                </>
              ) : (
                <>
                  <Zap size={24} fill="white" />
                  Commencer la Partie
                  <Zap size={24} fill="white" />
                </>
              )}
            </button>
          )}

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
              fontWeight: '500',
              animation: 'fadeInUp 0.8s ease-out 0.5s backwards'
            }}>
              ⏳ En attente que l'hôte lance la partie...
            </div>
          )}
        </div>
      </div>
    </>
  );
}