import { useState, useEffect } from 'react';
import { Home, Check } from 'lucide-react';

const categories = [
  { id: 'animals', emoji: '🐾', name: 'Animaux' },
  { id: 'food', emoji: '🍎', name: 'Nourriture' },
  { id: 'objects', emoji: '🔧', name: 'Objets' },
  { id: 'countries', emoji: '🌍', name: 'Pays' },
  { id: 'jobs', emoji: '💼', name: 'Métiers' },
  { id: 'sports', emoji: '⚽', name: 'Sports' },
  { id: 'celebrities', emoji: '⭐', name: 'Célébrités' },
  { id: 'brands', emoji: '🏷️', name: 'Marques' },
  { id: 'fictionalCharacters', emoji: '🎥', name: 'Fiction' }
];

export default function SettingsPage({ onBack, database, lobbyId }) {
  const [selectedCategories, setSelectedCategories] = useState(new Set(['animals', 'food', 'objects', 'countries', 'jobs', 'sports', 'celebrities', 'brands', 'fictionalCharacters']));
  const [inTheDarkMode, setInTheDarkMode] = useState(false);
  const [drawingBoardEnabled, setDrawingBoardEnabled] = useState(false);
  const [particles, setParticles] = useState([]);

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

  // Load selected categories, game mode, and drawing board setting from Firebase
  useEffect(() => {
    if (!database || !lobbyId) return;

    const { ref, onValue } = database;
    const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);
    const gameModeRef = ref(database.db, `lobbies/${lobbyId}/inTheDarkMode`);
    const drawingBoardRef = ref(database.db, `lobbies/${lobbyId}/drawingBoardEnabled`);

    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data)) {
        setSelectedCategories(new Set(data));
      }
    });

    const unsubscribeGameMode = onValue(gameModeRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setInTheDarkMode(data);
      }
    });

    const unsubscribeDrawingBoard = onValue(drawingBoardRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setDrawingBoardEnabled(data);
      }
    });

    return () => {
      unsubscribeCategories();
      unsubscribeGameMode();
      unsubscribeDrawingBoard();
    };
  }, [database, lobbyId]);

  const toggleCategory = async (categoryId) => {
    const newSelected = new Set(selectedCategories);
    
    if (newSelected.has(categoryId)) {
      // Don't allow deselecting if it's the last one
      if (newSelected.size === 1) {
        alert('Vous devez sélectionner au moins une catégorie!');
        return;
      }
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    
    setSelectedCategories(newSelected);

    // Save to Firebase
    if (database && lobbyId) {
      const { ref, set } = database;
      const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);
      await set(categoriesRef, Array.from(newSelected));
    }
  };

  const toggleInTheDarkMode = async () => {
    const newMode = !inTheDarkMode;
    setInTheDarkMode(newMode);

    // Save to Firebase
    if (database && lobbyId) {
      const { ref, set } = database;
      const gameModeRef = ref(database.db, `lobbies/${lobbyId}/inTheDarkMode`);
      await set(gameModeRef, newMode);
    }
  };

  const toggleDrawingBoard = async () => {
    const newEnabled = !drawingBoardEnabled;
    setDrawingBoardEnabled(newEnabled);

    // Save to Firebase
    if (database && lobbyId) {
      const { ref, set } = database;
      const drawingBoardRef = ref(database.db, `lobbies/${lobbyId}/drawingBoardEnabled`);
      await set(drawingBoardRef, newEnabled);
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
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover {
          transform: scale(1.05);
        }
        .btn-hover:active {
          transform: scale(0.95);
        }
        .category-card {
          transition: all 0.3s ease;
        }
        .category-card:hover {
          transform: scale(1.08) !important;
        }
        .category-card:active {
          transform: scale(0.98) !important;
        }
        .toggle-switch {
          position: relative;
          width: 60px;
          height: 30px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.4);
        }
        .toggle-switch.active {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-color: rgba(16, 185, 129, 0.6);
        }
        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .toggle-switch.active .toggle-slider {
          transform: translateX(30px);
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

        {/* Home Button */}
        <button
          onClick={onBack}
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
          <Home size={28} color="white" />
        </button>

        {/* Main Container */}
        <div style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          zIndex: 10,
          marginTop: '4rem',
          animation: 'fadeInUp 0.6s ease-out'
        }}>

          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            top: '2rem',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            marginBottom: '-0.5rem'
          }}>
            Paramètres
          </h1>

          {/* In The Dark Mode Toggle */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 2rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  🤷🏿‍♂️ Mode "Dans le Noir"
                </h2>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  L'imposteur ne sait pas qu'il est l'imposteur et reçoit un mot différent
                </p>
              </div>
              <div
                onClick={toggleInTheDarkMode}
                className={`toggle-switch ${inTheDarkMode ? 'active' : ''}`}
              >
                <div className="toggle-slider" />
              </div>
            </div>
          </div>

          {/* Drawing Board Toggle */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 2rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  🎨 Tableau de Dessin
                </h2>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  Afficher un tableau collaboratif pour dessiner pendant le jeu
                </p>
              </div>
              <div
                onClick={toggleDrawingBoard}
                className={`toggle-switch ${drawingBoardEnabled ? 'active' : ''}`}
              >
                <div className="toggle-slider" />
              </div>
            </div>
          </div>

          {/* Selected Count Card */}
          <div style={{
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '25px',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'white',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={24} />
            <span>{selectedCategories.size} catégorie{selectedCategories.size > 1 ? 's' : ''} sélectionnée{selectedCategories.size > 1 ? 's' : ''}</span>
          </div>

          {/* Category Grid Container */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Category Grid */}
            <div style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem'
            }}>
              {categories.map((category, index) => {
                const isSelected = selectedCategories.has(category.id);
                
                return (
                  <div
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className="category-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      opacity: isSelected ? 1 : 0.5,
                      animation: `popIn 0.4s ease-out ${index * 0.05}s backwards`
                    }}
                  >
                    {/* Emoji Box */}
                    <div style={{
                      width: '72px',
                      height: '72px',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: isSelected 
                        ? '3px solid rgba(16, 185, 129, 0.8)' 
                        : '3px solid rgba(255, 255, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      borderRadius: '20px',
                      boxShadow: isSelected 
                        ? '0 8px 25px rgba(16, 185, 129, 0.3)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.15)',
                      position: 'relative'
                    }}>
                      {category.emoji}
                      {/* Check Mark */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                        }}>
                          <Check size={16} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Category Name */}
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'white',
                      textAlign: 'center',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}>
                      {category.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}